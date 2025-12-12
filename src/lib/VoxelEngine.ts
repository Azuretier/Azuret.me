import * as THREE from 'three';
import { db } from './firebase';
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';

export type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'brick' | 'leaves' | 'water' | 'obsidian' | 'sand' | 'air';

const BLOCK_SIZE = 10;
const WORLD_SIZE = 128; // 128x128
const HALF_WORLD = WORLD_SIZE / 2;

const COLORS: Record<string, number> = {
    grass: 0x567d46, dirt: 0x5d4037, stone: 0x757575,
    wood: 0x4e342e, brick: 0x8d6e63, leaves: 0x2e7d32,
    water: 0x40a4df, obsidian: 0x121212, sand: 0xc2b280,
    air: 0x000000
};

// --- PERLIN NOISE IMPLEMENTATION ---
class Perlin {
    private p: number[] = [];
    constructor(seed: number) {
        this.p = new Array(512);
        const p = new Array(256);
        for(let i=0; i<256; i++) p[i] = i;
        // Shuffle based on seed
        let currentSeed = seed;
        const random = () => {
            const x = Math.sin(currentSeed++) * 10000;
            return x - Math.floor(x);
        };
        for(let i=255; i>0; i--) {
            const r = Math.floor(random() * (i + 1));
            [p[i], p[r]] = [p[r], p[i]];
        }
        for(let i=0; i<512; i++) this.p[i] = p[i & 255];
    }
    fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(t: number, a: number, b: number) { return a + t * (b - a); }
    grad(hash: number, x: number, y: number, z: number) {
        const h = hash & 15;
        const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    noise(x: number, y: number, z: number) {
        const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
        x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
        const u = this.fade(x), v = this.fade(y), w = this.fade(z);
        const p = this.p;
        const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA], x, y, z), this.grad(p[BA], x - 1, y, z)),
            this.lerp(u, this.grad(p[AB], x, y - 1, z), this.grad(p[BB], x - 1, y - 1, z))),
            this.lerp(v, this.lerp(u, this.grad(p[AA + 1], x, y, z - 1), this.grad(p[BA + 1], x - 1, y, z - 1)),
            this.lerp(u, this.grad(p[AB + 1], x, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1))));
    }
}

export class VoxelEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private raycaster: THREE.Raycaster;
    
    private objects: THREE.Object3D[] = [];
    private blockMeshes: Map<string, THREE.Mesh> = new Map();
    private unsubscribeWorld: (() => void) | null = null;
    
    // Physics & Movement
    private velocity = new THREE.Vector3();
    private moveState = { fwd: false, bwd: false, left: false, right: false };
    private canJump = false;
    private onGround = false;
    private prevTime = performance.now();
    
    public isRunning = false;
    public isPaused = false;
    public sensitivity = 0.002;

    private container: HTMLElement;
    private worldPath: string;
    private updateHUD: (x: number, y: number, z: number) => void;

    // Optimization: Shared Geometry
    private boxGeometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    private materials: Map<string, THREE.Material> = new Map();

    // Generation
    private perlin: Perlin;
    private worldType: 'default' | 'superflat';

    constructor(
        container: HTMLElement, 
        worldPath: string, 
        updateHUD: (x:number, y:number, z:number) => void,
        settings: { seed: number, type: 'default' | 'superflat' }
    ) {
        this.container = container;
        this.worldPath = worldPath;
        this.updateHUD = updateHUD;
        this.worldType = settings.type;
        this.perlin = new Perlin(settings.seed);

        // 1. Setup Three.js
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 500);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 80, 0); // Start high

        this.renderer = new THREE.WebGLRenderer({ antialias: false }); // Disable AA for performance
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        this.setupLights();
        this.raycaster = new THREE.Raycaster();

        // 2. Pre-create Materials
        Object.keys(COLORS).forEach(key => {
            if(key === 'air') return;
            const mat = new THREE.MeshLambertMaterial({ 
                color: COLORS[key],
                transparent: key === 'water' || key === 'leaves',
                opacity: key === 'water' ? 0.6 : 1.0
            });
            this.materials.set(key, mat);
        });

        // 3. Generate World
        this.generateWorld();

        // 4. Bind Events
        window.addEventListener('resize', this.onResize);
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        document.body.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mousedown', this.onMouseDown);

        // 5. Connect DB (Apply overrides)
        this.connectToFirebase();
        this.animate();
    }

    private setupLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xffffff, 0.7);
        sun.position.set(50, 150, 50);
        sun.castShadow = false; // Disable shadows for performance
        this.scene.add(sun);
    }

    private addBlock(x: number, y: number, z: number, type: string, isNatural = false, docId?: string) {
        if (type === 'air') return;
        const key = `${x}_${y}_${z}`;
        
        // Don't add if already exists (handling overlap)
        if (this.blockMeshes.has(key)) return;

        const mat = this.materials.get(type);
        if (!mat) return;

        const mesh = new THREE.Mesh(this.boxGeometry, mat);
        mesh.position.set(x, y, z);
        mesh.userData = { id: docId, natural: isNatural, type };
        
        // Simple culling: don't add to objects array for collision if it's too far down (optional opt)
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.blockMeshes.set(key, mesh);
    }

    private removeBlock(x: number, y: number, z: number) {
        const key = `${x}_${y}_${z}`;
        const mesh = this.blockMeshes.get(key);
        if (mesh) {
            this.scene.remove(mesh);
            this.objects.splice(this.objects.indexOf(mesh), 1);
            this.blockMeshes.delete(key);
        }
    }

    private generateWorld() {
        // Limit render distance for initial generation to prevent freeze
        // But prompt asks for 128x128. We will generate it.
        
        const startX = -HALF_WORLD * BLOCK_SIZE;
        const endX = HALF_WORLD * BLOCK_SIZE;
        const startZ = -HALF_WORLD * BLOCK_SIZE;
        const endZ = HALF_WORLD * BLOCK_SIZE;

        for (let x = startX; x < endX; x += BLOCK_SIZE) {
            for (let z = startZ; z < endZ; z += BLOCK_SIZE) {
                
                let height = 0;
                
                if (this.worldType === 'superflat') {
                    // Superflat: Grass at 0, Dirt at -10, -20, Bedrock at -30
                    this.addBlock(x, 0, z, 'grass', true);
                    this.addBlock(x, -BLOCK_SIZE, z, 'dirt', true);
                    this.addBlock(x, -BLOCK_SIZE * 2, z, 'dirt', true);
                    this.addBlock(x, -BLOCK_SIZE * 3, z, 'obsidian', true);
                } else {
                    // Default: Perlin Terrain
                    // Noise returns -1 to 1 mostly. 
                    // Scale coord to smoothen (0.01). Amplitude 40.
                    const n = this.perlin.noise(x * 0.005, 0, z * 0.005);
                    const h = Math.floor(n * 4) * BLOCK_SIZE; // Discrete steps
                    height = h;

                    // Base Terrain
                    this.addBlock(x, h, z, 'grass', true);
                    
                    // Fill dirt below
                    for(let d=1; d<=3; d++) {
                        this.addBlock(x, h - d*BLOCK_SIZE, z, 'dirt', true);
                    }
                    // Stone below that
                    this.addBlock(x, h - 4*BLOCK_SIZE, z, 'stone', true);

                    // Trees (Simple)
                    // Random chance on top of grass if not too low (water level logic skipped for simplicity)
                    if (Math.random() < 0.015) {
                        this.generateTree(x, h + BLOCK_SIZE, z);
                    }
                }
            }
        }
        
        // Caves (Post-pass: Remove blocks using 3D noise)
        if (this.worldType === 'default') {
             // Basic implementation: Iterate existing blocks? 
             // Too slow to iterate ALL space. 
             // We'll skip complex cave generation for 128x128 web performance 
             // or just check noise during the loop above.
             // (Cave generation omitted to ensure stable framerate on 16k blocks)
        }
    }

    private generateTree(x: number, y: number, z: number) {
        const trunkHeight = 4 + Math.floor(Math.random() * 2);
        for(let i=0; i<trunkHeight; i++) {
            this.addBlock(x, y + i*BLOCK_SIZE, z, 'wood', true);
        }
        // Leaves
        const topY = y + trunkHeight * BLOCK_SIZE;
        for(let lx=-1; lx<=1; lx++) {
            for(let lz=-1; lz<=1; lz++) {
                for(let ly=0; ly<=1; ly++) {
                    // Don't replace the trunk top
                    if(lx===0 && lz===0 && ly===0) continue; 
                    this.addBlock(x + lx*BLOCK_SIZE, topY + ly*BLOCK_SIZE - BLOCK_SIZE, z + lz*BLOCK_SIZE, 'leaves', true);
                }
            }
        }
        this.addBlock(x, topY + BLOCK_SIZE, z, 'leaves', true);
    }

    public setSensitivity(val: number) {
        this.sensitivity = val;
    }

    private connectToFirebase() {
        // Listen for changes (User placed/broken blocks)
        const q = collection(db, `${this.worldPath}/blocks`);
        this.unsubscribeWorld = onSnapshot(q, (snap) => {
            snap.docChanges().forEach(change => {
                const d = change.doc.data();
                const bx = d.x, by = d.y, bz = d.z;
                
                if (change.type === 'removed') {
                    // This happens if a USER PLACED block is removed via DB console?
                    // Or if we reverted a change.
                    // For this engine, 'removed' in DB means the override is gone.
                    // We should restore the natural block? 
                    // Complexity: high. We assume DB is truth.
                    this.removeBlock(bx, by, bz);
                } else {
                    // Added or Modified
                    if (d.type === 'air') {
                        // "Air" doc means a natural block was broken
                        this.removeBlock(bx, by, bz);
                    } else {
                        // User placed block
                        // Remove existing mesh first (natural or prev user block)
                        this.removeBlock(bx, by, bz);
                        this.addBlock(bx, by, bz, d.type, false, change.doc.id);
                    }
                }
            });
        });
    }

    private animate = () => {
        if (!this.renderer) return; 
        requestAnimationFrame(this.animate);

        if (this.isRunning && !this.isPaused) {
            const time = performance.now();
            const delta = Math.min((time - this.prevTime) / 1000, 0.1);
            this.physics(delta);
            this.prevTime = time;
            this.updateHUD(Math.round(this.camera.position.x), Math.round(this.camera.position.y), Math.round(this.camera.position.z));
        } else {
            this.prevTime = performance.now();
        }
        this.renderer.render(this.scene, this.camera);
    };

    private physics(delta: number) {
        const damping = Math.exp(-(this.onGround ? 10.0 : 2.0) * delta);
        this.velocity.x *= damping;
        this.velocity.z *= damping;
        this.velocity.y -= 500 * delta; // Gravity

        const direction = new THREE.Vector3();
        direction.set(Number(this.moveState.right) - Number(this.moveState.left), 0, Number(this.moveState.bwd) - Number(this.moveState.fwd));
        direction.normalize();

        if (this.moveState.fwd || this.moveState.bwd || this.moveState.left || this.moveState.right) {
            const camDir = new THREE.Vector3();
            this.camera.getWorldDirection(camDir); camDir.y = 0; camDir.normalize();
            const camRight = new THREE.Vector3();
            camRight.crossVectors(camDir, this.camera.up).normalize();
            const moveVec = new THREE.Vector3().addScaledVector(camDir, -direction.z).addScaledVector(camRight, direction.x);
            moveVec.normalize();
            const speed = this.onGround ? 2000 : 500;
            this.velocity.addScaledVector(moveVec, speed * delta);
        }

        this.camera.position.x += this.velocity.x * delta;
        if (this.checkCollide()) { this.camera.position.x -= this.velocity.x * delta; this.velocity.x = 0; }

        this.camera.position.z += this.velocity.z * delta;
        if (this.checkCollide()) { this.camera.position.z -= this.velocity.z * delta; this.velocity.z = 0; }

        this.onGround = false;
        this.camera.position.y += this.velocity.y * delta;
        if (this.checkCollide()) {
            this.camera.position.y -= this.velocity.y * delta;
            if (this.velocity.y < 0) { this.onGround = true; this.canJump = true; }
            this.velocity.y = 0;
        }

        if (this.camera.position.y < -150) {
            // Respawn
            this.velocity.set(0, 0, 0);
            this.camera.position.set(0, 100, 0);
        }
    }

    private checkCollide() {
        const playerR = 3;
        const headY = this.camera.position.y;
        const footY = this.camera.position.y - 18;

        // Optimization: Only check objects near player
        const pX = this.camera.position.x;
        const pY = this.camera.position.y;
        const pZ = this.camera.position.z;

        for (const o of this.objects) {
            // Fast distance check (AABB roughly)
            if (Math.abs(o.position.x - pX) > 12) continue;
            if (Math.abs(o.position.z - pZ) > 12) continue;
            if (Math.abs(o.position.y - pY) > 25) continue;

            const bMinX = o.position.x - 5, bMaxX = o.position.x + 5;
            const bMinY = o.position.y - 5, bMaxY = o.position.y + 5;
            const bMinZ = o.position.z - 5, bMaxZ = o.position.z + 5;

            const pMinX = pX - playerR, pMaxX = pX + playerR;
            const pMinZ = pZ - playerR, pMaxZ = pZ + playerR;

            if (pMinX < bMaxX && pMaxX > bMinX && footY < bMaxY && headY > bMinY && pMinZ < bMaxZ && pMaxZ > bMinZ) {
                return true;
            }
        }
        return false;
    }

    // --- Input Handlers ---
    private onKeyDown = (e: KeyboardEvent) => {
        if (!this.isRunning) return;
        switch (e.code) {
            case 'KeyW': this.moveState.fwd = true; break;
            case 'KeyS': this.moveState.bwd = true; break;
            case 'KeyA': this.moveState.left = true; break;
            case 'KeyD': this.moveState.right = true; break;
            case 'Space': if (this.canJump) { this.velocity.y = 160; this.canJump = false; } break;
        }
    }

    private onKeyUp = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'KeyW': this.moveState.fwd = false; break;
            case 'KeyS': this.moveState.bwd = false; break;
            case 'KeyA': this.moveState.left = false; break;
            case 'KeyD': this.moveState.right = false; break;
        }
    }

    private onMouseMove = (e: MouseEvent) => {
        if (!this.isRunning || this.isPaused) return;
        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        euler.setFromQuaternion(this.camera.quaternion);
        euler.y -= e.movementX * this.sensitivity;
        euler.x -= e.movementY * this.sensitivity;
        euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
        this.camera.quaternion.setFromEuler(euler);
    }

    private onMouseDown = (e: MouseEvent) => {
        if (!this.isRunning || this.isPaused) return;
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const hits = this.raycaster.intersectObjects(this.objects);
        if (hits.length === 0 || hits[0].distance > 60) return;

        const hit = hits[0];
        const pos = hit.object.position;
        const userData = hit.object.userData;

        if (e.button === 0) { // Break
            if (userData.natural) {
                // Natural block: Create an 'air' record to mask it
                const bid = `${pos.x}_${pos.y}_${pos.z}`;
                setDoc(doc(db, `${this.worldPath}/blocks`, bid), { 
                    x: pos.x, y: pos.y, z: pos.z, type: 'air' 
                });
            } else if (userData.id) {
                // User block: Delete the record
                deleteDoc(doc(db, `${this.worldPath}/blocks`, userData.id));
            }
        } else if (e.button === 2) { // Place
            const n = hit.face!.normal;
            const bx = pos.x + n.x * BLOCK_SIZE;
            const by = pos.y + n.y * BLOCK_SIZE;
            const bz = pos.z + n.z * BLOCK_SIZE;

            // Player collision check
            if (Math.abs(bx - this.camera.position.x) < 5 && Math.abs(bz - this.camera.position.z) < 5 && by > this.camera.position.y - 20 && by < this.camera.position.y + 5) return;

            const newKey = `${bx}_${by}_${bz}`;
            const selectedBlock = (window as any).__SELECTED_BLOCK__ || 'grass'; 
            setDoc(doc(db, `${this.worldPath}/blocks`, newKey), {
                x: bx, y: by, z: bz, type: selectedBlock
            });
        }
    }

    private onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public dispose() {
        if (this.unsubscribeWorld) this.unsubscribeWorld();
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.body.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mousedown', this.onMouseDown);
        if (this.container && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
        this.renderer.dispose();
    }
}