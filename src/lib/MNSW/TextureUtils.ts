import * as THREE from 'three';

export const createProceduralTexture = (colorHex: string, noiseAmount: number = 20): THREE.Texture => {
    const size = 64; // 64x64 texture
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) return new THREE.Texture();

    // 1. Fill Base Color
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, size, size);

    // 2. Add Noise
    const idata = ctx.getImageData(0, 0, size, size);
    const buffer32 = new Uint32Array(idata.data.buffer);
    
    // Parse base color
    const r = parseInt(colorHex.slice(1, 3), 16);
    const g = parseInt(colorHex.slice(3, 5), 16);
    const b = parseInt(colorHex.slice(5, 7), 16);

    for (let i = 0; i < buffer32.length; i++) {
        // Random lightness variation
        const noise = (Math.random() - 0.5) * noiseAmount;
        
        const nr = Math.max(0, Math.min(255, r + noise));
        const ng = Math.max(0, Math.min(255, g + noise));
        const nb = Math.max(0, Math.min(255, b + noise));

        // Little Endian (ABGR)
        buffer32[i] = (255 << 24) | (nb << 16) | (ng << 8) | nr;
    }

    ctx.putImageData(idata, 0, 0);

    // 3. Create Texture
    const texture = new THREE.CanvasTexture(canvas);
    // CRITICAL: NearestFilter makes it look pixelated (Minecraft style), not blurry
    texture.magFilter = THREE.NearestFilter; 
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    
    return texture;
};