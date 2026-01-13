// GPU capability detection for WebGPU and WebGL

export type GPUCapability = "webgpu" | "webgl" | "none";

/**
 * Detects the best available GPU rendering capability
 * Priority: WebGPU (desktop) > WebGL (mobile/fallback) > none (static)
 */
export async function detectGPUCapability(): Promise<GPUCapability> {
  // Check for WebGPU (modern browsers, desktop)
  if (typeof navigator !== "undefined" && "gpu" in navigator) {
    try {
      const gpu = (navigator as any).gpu;
      const adapter = await gpu.requestAdapter();
      if (adapter) {
        return "webgpu";
      }
    } catch (error) {
      console.warn("WebGPU detection failed:", error);
    }
  }

  // Check for WebGL (fallback for mobile/older browsers)
  if (typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (gl) {
        return "webgl";
      }
    } catch (error) {
      console.warn("WebGL detection failed:", error);
    }
  }

  // No GPU support available
  return "none";
}

/**
 * Check if device is likely mobile based on user agent and screen size
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  const isSmallScreen = window.innerWidth < 768;

  return isMobileUA || isSmallScreen;
}
