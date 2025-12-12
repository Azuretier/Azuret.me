"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PanoramaBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert so we see inside

    // 3. Load Texture with Debugging
    const textureLoader = new THREE.TextureLoader();
    
    // NOTE: In Next.js, "public/media/image.png" is accessed via "/media/image.png"
    const texture = textureLoader.load(
      '/media/panorama.png', 
      // On Success
      () => {
        console.log("✅ Background Texture loaded successfully.");
      },
      // On Progress
      undefined,
      // On Error
      (err) => {
        console.error("❌ FAILED to load texture. Check these things:");
        console.error("1. Is the file exactly at: /public/media/panorama.png?");
        console.error("2. Is the filename lowercase?");
        console.error("3. Did you restart the dev server?");
        console.error("Error Details:", err);
      }
    );
    
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false; 

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. Animation
    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.0006; 
      renderer.render(scene, camera);
    };
    animate();

    // 5. Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
        filter: 'blur(4px) scale(1.02)' 
      }} 
    />
  );
}