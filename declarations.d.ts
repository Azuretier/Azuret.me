// declarations.d.ts
declare module '*.frag' {
  const value: string;
  export default value;
}
declare module '*.glsl' {
  const value: string;
  export default value;
}
declare module '*.wgsl' {
  const value: string;
  export default value;
}

// Extend HTMLCanvasElement to support webgpu context
interface HTMLCanvasElement {
  getContext(contextId: "webgpu"): GPUCanvasContext | null;
}

// WebGPU type definitions
interface Navigator {
  gpu?: GPU;
}

interface GPU {
  requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
  getPreferredCanvasFormat(): GPUTextureFormat;
}

interface GPURequestAdapterOptions {
  powerPreference?: "low-power" | "high-performance";
  forceFallbackAdapter?: boolean;
}

interface GPUAdapter {
  requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
  features: ReadonlySet<string>;
  limits: Record<string, number>;
  isFallbackAdapter: boolean;
}

interface GPUDeviceDescriptor {
  requiredFeatures?: string[];
  requiredLimits?: Record<string, number>;
}

interface GPUDevice {
  createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
  createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule;
  createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline;
  createPipelineLayout(descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout;
  createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout;
  createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup;
  createCommandEncoder(): GPUCommandEncoder;
  queue: GPUQueue;
}

interface GPUBuffer {
  size: number;
  usage: number;
}

interface GPUBufferDescriptor {
  size: number;
  usage: number;
}

declare const GPUBufferUsage: {
  UNIFORM: number;
  COPY_DST: number;
  VERTEX: number;
  INDEX: number;
  STORAGE: number;
  COPY_SRC: number;
};

declare const GPUShaderStage: {
  VERTEX: number;
  FRAGMENT: number;
  COMPUTE: number;
};

interface GPUShaderModule {}

interface GPUShaderModuleDescriptor {
  code: string;
}

interface GPURenderPipeline {}

interface GPURenderPipelineDescriptor {
  layout: GPUPipelineLayout | "auto";
  vertex: GPUVertexState;
  fragment?: GPUFragmentState;
  primitive?: GPUPrimitiveState;
}

interface GPUVertexState {
  module: GPUShaderModule;
  entryPoint: string;
}

interface GPUFragmentState {
  module: GPUShaderModule;
  entryPoint: string;
  targets: GPUColorTargetState[];
}

interface GPUColorTargetState {
  format: GPUTextureFormat;
}

interface GPUPrimitiveState {
  topology: GPUPrimitiveTopology;
}

type GPUPrimitiveTopology = "triangle-list" | "triangle-strip" | "line-list" | "line-strip" | "point-list";
type GPUTextureFormat = string;

interface GPUPipelineLayout {}

interface GPUPipelineLayoutDescriptor {
  bindGroupLayouts: GPUBindGroupLayout[];
}

interface GPUBindGroupLayout {}

interface GPUBindGroupLayoutDescriptor {
  entries: GPUBindGroupLayoutEntry[];
}

interface GPUBindGroupLayoutEntry {
  binding: number;
  visibility: number;
  buffer?: {
    type?: "uniform" | "storage" | "read-only-storage";
  };
}

interface GPUBindGroup {}

interface GPUBindGroupDescriptor {
  layout: GPUBindGroupLayout;
  entries: GPUBindGroupEntry[];
}

interface GPUBindGroupEntry {
  binding: number;
  resource: { buffer: GPUBuffer };
}

interface GPUCommandEncoder {
  beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder;
  finish(): GPUCommandBuffer;
}

interface GPURenderPassDescriptor {
  colorAttachments: GPURenderPassColorAttachment[];
}

interface GPURenderPassColorAttachment {
  view: GPUTextureView;
  clearValue?: { r: number; g: number; b: number; a: number };
  loadOp: "load" | "clear";
  storeOp: "store" | "discard";
}

interface GPURenderPassEncoder {
  setPipeline(pipeline: GPURenderPipeline): void;
  setBindGroup(index: number, bindGroup: GPUBindGroup): void;
  draw(vertexCount: number): void;
  end(): void;
}

interface GPUCommandBuffer {}

interface GPUQueue {
  submit(commandBuffers: GPUCommandBuffer[]): void;
  writeBuffer(buffer: GPUBuffer, bufferOffset: number, data: ArrayBuffer | ArrayBufferView): void;
}

interface GPUCanvasContext {
  configure(configuration: GPUCanvasConfiguration): void;
  getCurrentTexture(): GPUTexture;
}

interface GPUCanvasConfiguration {
  device: GPUDevice;
  format: GPUTextureFormat;
  alphaMode?: "opaque" | "premultiplied";
}

interface GPUTexture {
  createView(): GPUTextureView;
}

interface GPUTextureView {}
