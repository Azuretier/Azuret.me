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
    mountRef.current.appendChild(renderer.domElement);

    // 2. Load the 6 CubeMap Images (Minecraft Style)
    // You need to place panorama_0.png to panorama_5.png in public/media/
    // Order: Right, Left, Top, Bottom, Front, Back
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      '/media/panorama_0.png', // px
      '/media/panorama_2.png', // nx
      '/media/panorama_4.png', // py
      '/media/panorama_5.png', // ny
      '/media/panorama_1.png', // pz
      '/media/panorama_3.png', // nz
    ]);
    scene.background = texture;

    // 3. Animation Loop (Slow Rotation)
    let autoRotateSpeed = 0.0005; // Very slow, like Java Edition

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate camera automatically
      camera.rotation.y -= autoRotateSpeed;
      
      // Optional: Gentle pitch (up/down) movement like some versions
      // camera.rotation.x = Math.sin(Date.now() * 0.0001) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // 4. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0,
        filter: 'blur(4px)' // CSS Blur for that menu feel
      }} 
    />
  );
}