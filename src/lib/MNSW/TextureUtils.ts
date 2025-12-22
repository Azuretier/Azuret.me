import * as THREE from 'three';

// The order of blocks in the Atlas. 
// 0=Grass, 1=Dirt, 2=Stone, etc.
export const BLOCK_IDS: Record<string, number> = {
    'grass': 0,
    'dirt': 1,
    'stone': 2,
    'wood': 3,
    'brick': 4,
    'leaves': 5,
    'water': 6,
    'obsidian': 7,
    'sand': 8,
    'air': 9 
};

export const TOTAL_BLOCKS = Object.keys(BLOCK_IDS).length;

export const createTextureAtlas = (): THREE.CanvasTexture => {
    const resolution = 64; // High-res pixel look (64x64 per block)
    const width = resolution * TOTAL_BLOCKS;
    const height = resolution;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Helper to draw noise
    const drawNoise = (xOffset: number, baseColor: string, noiseFactor: number, pattern: 'noise'|'bricks'|'planks' = 'noise') => {
        // Fill Base
        ctx.fillStyle = baseColor;
        ctx.fillRect(xOffset * resolution, 0, resolution, resolution);

        // Add Detail
        const imgData = ctx.getImageData(xOffset * resolution, 0, resolution, resolution);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            const grain = (Math.random() - 0.5) * noiseFactor;
            data[i] = Math.min(255, Math.max(0, data[i] + grain));     // R
            data[i+1] = Math.min(255, Math.max(0, data[i+1] + grain)); // G
            data[i+2] = Math.min(255, Math.max(0, data[i+2] + grain)); // B
        }
        ctx.putImageData(imgData, xOffset * resolution, 0);

        // Specific Patterns
        if (pattern === 'bricks') {
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            // Horizontal lines
            ctx.fillRect(xOffset * resolution, 0, resolution, 4);
            ctx.fillRect(xOffset * resolution, resolution/2, resolution, 4);
            // Vertical lines
            ctx.fillRect(xOffset * resolution + 10, 4, 4, resolution/2 - 4);
            ctx.fillRect(xOffset * resolution + 40, resolution/2 + 4, 4, resolution/2 - 4);
        }
        if (pattern === 'planks') {
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            // Vertical planks
            ctx.fillRect(xOffset * resolution, 0, 2, resolution);
            ctx.fillRect(xOffset * resolution + resolution/3, 0, 2, resolution);
            ctx.fillRect(xOffset * resolution + (resolution/3)*2, 0, 2, resolution);
        }
    };

    // --- GENERATE TEXTURES ---
    
    // 0: Grass (Green with noise)
    drawNoise(0, '#567d46', 40);
    // Add "dirt" specks to grass
    ctx.fillStyle = "rgba(60, 40, 20, 0.1)"; 
    ctx.fillRect(0, 0, resolution, resolution);

    // 1: Dirt (Brown)
    drawNoise(1, '#5d4037', 50);

    // 2: Stone (Grey)
    drawNoise(2, '#757575', 40);

    // 3: Wood (Plank pattern)
    drawNoise(3, '#6d4c41', 30, 'planks');

    // 4: Brick (Brick pattern)
    drawNoise(4, '#8d6e63', 30, 'bricks');

    // 5: Leaves (Dark Green + Holes)
    drawNoise(5, '#2e7d32', 60);
    
    // 6: Water (Blue + Transparent look)
    drawNoise(6, '#40a4df', 20);

    // 7: Obsidian (Dark Purple/Black)
    drawNoise(7, '#1a1a1a', 20);
    
    // 8: Sand (Beige)
    drawNoise(8, '#e6ddc5', 30);

    const texture = new THREE.CanvasTexture(canvas);
    // CRITICAL: NearestFilter gives the crisp "Minecraft" pixel look
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    
    return texture;
};