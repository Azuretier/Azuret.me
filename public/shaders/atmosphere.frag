#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;

// Hash functions for procedural generation
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.x, p.y, p.x) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract(vec2((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y));
}

// Noise functions
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

// Architecture silhouette function
float buildingSilhouette(vec2 uv, float time) {
  float aspectRatio = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspectRatio, uv.y);
  
  // Create building shapes
  float buildingId = floor(p.x * 8.0);
  float h = hash21(vec2(buildingId, 0.0)) * 0.3 + 0.3;
  float buildingX = fract(p.x * 8.0);
  
  // Building body
  float building = step(p.y, h) * step(0.05, buildingX) * step(buildingX, 0.95);
  
  // Windows with time-based flicker
  float windowGridX = fract(buildingX * 4.0);
  float windowGridY = fract(p.y * 20.0);
  float windowMask = step(0.2, windowGridX) * step(windowGridX, 0.8) * 
                     step(0.2, windowGridY) * step(windowGridY, 0.8);
  float windowFlicker = hash21(vec2(buildingId * 10.0 + floor(buildingX * 4.0), floor(p.y * 20.0)));
  float windowLight = step(0.3 + sin(time * windowFlicker * 2.0) * 0.2, windowFlicker);
  
  building = building * (0.1 + windowMask * windowLight * 0.5);
  
  return building;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float time = u_time;
  
  // Gradient background (dawn/dusk colors)
  vec3 skyGradient = mix(
    vec3(0.05, 0.08, 0.15),  // Deep blue-purple
    vec3(0.15, 0.12, 0.25),  // Slightly lighter purple
    smoothstep(0.0, 1.0, uv.y)
  );
  
  // Add some color variation with time
  vec3 colorShift = vec3(
    sin(time * 0.1) * 0.05,
    cos(time * 0.15) * 0.03,
    sin(time * 0.12) * 0.04
  );
  
  vec3 col = skyGradient + colorShift;
  
  // Building silhouettes at bottom
  if (uv.y < 0.4) {
    float buildings = buildingSilhouette(uv, time);
    col = mix(col, vec3(0.02, 0.03, 0.05), buildings * 0.8);
    
    // Window lights
    if (buildings > 0.2) {
      col += vec3(0.8, 0.7, 0.5) * (buildings - 0.1) * 0.3;
    }
  }
  
  // Atmospheric fog layers
  float fogNoise1 = fbm(vec2(uv.x * 3.0 + time * 0.02, uv.y * 2.0 - time * 0.01));
  float fogNoise2 = fbm(vec2(uv.x * 5.0 - time * 0.03, uv.y * 3.0 + time * 0.015));
  
  float fog = mix(fogNoise1, fogNoise2, 0.5);
  vec3 fogColor = vec3(0.2, 0.25, 0.35) * 0.3;
  col = mix(col, fogColor, fog * smoothstep(0.2, 0.6, uv.y) * 0.4);
  
  // Vignette
  float vignette = smoothstep(0.8, 0.2, length(uv - vec2(0.5, 0.5)));
  col *= 0.5 + 0.5 * vignette;
  
  // Color grading - modern cinematic look
  col = pow(col, vec3(1.1, 1.0, 0.95)); // Slight warmth
  col = col * 1.2; // Boost overall brightness
  col = clamp(col, vec3(0.0), vec3(1.0));
  
  gl_FragColor = vec4(col, 1.0);
}
