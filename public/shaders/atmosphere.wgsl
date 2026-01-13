// Atmospheric shader with fog and architecture silhouettes
// WebGPU WGSL shader for desktop

struct Uniforms {
  time: f32,
  resolution: vec2<f32>,
  _padding: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var output: VertexOutput;
  
  // Full-screen quad
  let x = f32((vertexIndex & 1u) << 2u);
  let y = f32((vertexIndex & 2u) << 1u);
  
  output.position = vec4<f32>(x - 1.0, 1.0 - y, 0.0, 1.0);
  output.uv = vec2<f32>(x * 0.5, y * 0.5);
  
  return output;
}

// Hash functions for procedural generation
fn hash21(p: vec2<f32>) -> f32 {
  var p3 = fract(vec3<f32>(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, vec3<f32>(p3.y, p3.z, p3.x) + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

fn hash22(p: vec2<f32>) -> vec2<f32> {
  var p3 = fract(vec3<f32>(p.x, p.y, p.x) * vec3<f32>(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, vec3<f32>(p3.y, p3.z, p3.x) + 33.33);
  return fract(vec2<f32>((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y));
}

// Noise functions
fn noise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  
  let a = hash21(i);
  let b = hash21(i + vec2<f32>(1.0, 0.0));
  let c = hash21(i + vec2<f32>(0.0, 1.0));
  let d = hash21(i + vec2<f32>(1.0, 1.0));
  
  let u = f * f * (3.0 - 2.0 * f);
  
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p: vec2<f32>) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var frequency = 1.0;
  var pp = p;
  
  for (var i = 0; i < 5; i++) {
    value += amplitude * noise(pp * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

// Architecture silhouette function
fn buildingSilhouette(uv: vec2<f32>, time: f32) -> f32 {
  let aspectRatio = uniforms.resolution.x / uniforms.resolution.y;
  var p = vec2<f32>(uv.x * aspectRatio, uv.y);
  
  // Create building shapes
  let buildingId = floor(p.x * 8.0);
  let h = hash21(vec2<f32>(buildingId, 0.0)) * 0.3 + 0.3;
  let buildingX = fract(p.x * 8.0);
  
  // Building body
  var building = step(p.y, h) * step(0.05, buildingX) * step(buildingX, 0.95);
  
  // Windows with time-based flicker
  let windowGridX = fract(buildingX * 4.0);
  let windowGridY = fract(p.y * 20.0);
  let windowMask = step(0.2, windowGridX) * step(windowGridX, 0.8) * 
                   step(0.2, windowGridY) * step(windowGridY, 0.8);
  let windowFlicker = hash21(vec2<f32>(buildingId * 10.0 + floor(buildingX * 4.0), floor(p.y * 20.0)));
  let windowLight = step(0.3 + sin(time * windowFlicker * 2.0) * 0.2, windowFlicker);
  
  building = building * (0.1 + windowMask * windowLight * 0.5);
  
  return building;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let uv = input.uv;
  let time = uniforms.time;
  
  // Gradient background (dawn/dusk colors)
  let skyGradient = mix(
    vec3<f32>(0.05, 0.08, 0.15),  // Deep blue-purple
    vec3<f32>(0.15, 0.12, 0.25),  // Slightly lighter purple
    smoothstep(0.0, 1.0, uv.y)
  );
  
  // Add some color variation with time
  let colorShift = vec3<f32>(
    sin(time * 0.1) * 0.05,
    cos(time * 0.15) * 0.03,
    sin(time * 0.12) * 0.04
  );
  
  var col = skyGradient + colorShift;
  
  // Building silhouettes at bottom
  if (uv.y < 0.4) {
    let buildings = buildingSilhouette(uv, time);
    col = mix(col, vec3<f32>(0.02, 0.03, 0.05), buildings * 0.8);
    
    // Window lights
    if (buildings > 0.2) {
      col += vec3<f32>(0.8, 0.7, 0.5) * (buildings - 0.1) * 0.3;
    }
  }
  
  // Atmospheric fog layers
  let fogNoise1 = fbm(vec2<f32>(uv.x * 3.0 + time * 0.02, uv.y * 2.0 - time * 0.01));
  let fogNoise2 = fbm(vec2<f32>(uv.x * 5.0 - time * 0.03, uv.y * 3.0 + time * 0.015));
  
  let fog = mix(fogNoise1, fogNoise2, 0.5);
  let fogColor = vec3<f32>(0.2, 0.25, 0.35) * 0.3;
  col = mix(col, fogColor, fog * smoothstep(0.2, 0.6, uv.y) * 0.4);
  
  // Vignette
  let vignette = smoothstep(0.8, 0.2, length(uv - vec2<f32>(0.5, 0.5)));
  col *= 0.5 + 0.5 * vignette;
  
  // Color grading - modern cinematic look
  col = pow(col, vec3<f32>(1.1, 1.0, 0.95)); // Slight warmth
  col = col * 1.2; // Boost overall brightness
  col = clamp(col, vec3<f32>(0.0), vec3<f32>(1.0));
  
  return vec4<f32>(col, 1.0);
}
