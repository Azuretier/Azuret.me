"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { detectGPUCapability, isMobileDevice } from "@/lib/gpu-detection";
import type { GPUCapability } from "@/lib/gpu-detection";
import dynamic from "next/dynamic";
import LoadingScreen from "./LoadingScreen";
import MessengerUI from "./MessengerUI";

// Dynamically import background components to avoid SSR issues
const WebGLBackground = dynamic(() => import("./WebGLBackground"), {
  ssr: false,
});
const StaticBackground = dynamic(() => import("./StaticBackground"), {
  ssr: false,
});

export default function InteractiveHomepage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing");
  const [gpuCapability, setGpuCapability] = useState<GPUCapability | null>(null);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      // Detect GPU capability
      setStatus("Detecting capabilities");
      setProgress(20);

      const capability = await detectGPUCapability();
      
      if (!mounted) return;
      
      setGpuCapability(capability);
      console.log("GPU Capability:", capability);

      // Simulate loading progression
      setStatus("Loading experience");
      setProgress(40);

      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (!mounted) return;

      setProgress(60);
      setStatus("Preparing interface");

      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (!mounted) return;

      setProgress(80);
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // When background is loaded, complete the loading
    if (backgroundLoaded && progress >= 80) {
      setProgress(100);
      setStatus("Ready");

      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  }, [backgroundLoaded, progress]);

  const handleBackgroundLoaded = () => {
    console.log("Background loaded");
    setBackgroundLoaded(true);
  };

  // Render appropriate background based on GPU capability
  const renderBackground = () => {
    // Wait for GPU detection to complete
    if (gpuCapability === null) {
      return null;
    }
    
    // For WebGPU (desktop) or WebGL (mobile/fallback), use WebGL shader
    // Note: WebGPU implementation would require more complex setup
    // For now, we'll use WebGL for both as it's more widely supported
    if (gpuCapability === "webgpu" || gpuCapability === "webgl") {
      return <WebGLBackground onLoaded={handleBackgroundLoaded} />;
    }

    // Static gradient fallback for no GPU support
    return <StaticBackground onLoaded={handleBackgroundLoaded} />;
  };

  return (
    <>
      {/* Background shader/gradient */}
      {renderBackground()}

      {/* Loading screen */}
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen progress={progress} status={status} />}
      </AnimatePresence>

      {/* Main messenger UI */}
      {!loading && <MessengerUI />}
    </>
  );
}
