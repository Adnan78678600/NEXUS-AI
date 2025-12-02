import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import React, { forwardRef } from 'react';

// -----------------------------------------------------------------------------
// SHADER DEFINITIONS
// -----------------------------------------------------------------------------

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // 4x4 Bayer Matrix Logic
  float dither4x4(vec2 position, float brightness) {
    int x = int(mod(position.x, 4.0));
    int y = int(mod(position.y, 4.0));
    int index = x + y * 4;
    
    float limit = 0.0;
    if (x < 8) {
        if (index == 0) limit = 0.0625;
        else if (index == 1) limit = 0.5625;
        else if (index == 2) limit = 0.1875;
        else if (index == 3) limit = 0.6875;
        else if (index == 4) limit = 0.8125;
        else if (index == 5) limit = 0.3125;
        else if (index == 6) limit = 0.9375;
        else if (index == 7) limit = 0.4375;
        else if (index == 8) limit = 0.25;
        else if (index == 9) limit = 0.75;
        else if (index == 10) limit = 0.125;
        else if (index == 11) limit = 0.625;
        else if (index == 12) limit = 1.0;
        else if (index == 13) limit = 0.5;
        else if (index == 14) limit = 0.875;
        else if (index == 15) limit = 0.375;
    }
    return brightness < limit ? 0.0 : 1.0;
  }

  void main() {
    vec3 lightPos = vec3(5.0, 5.0, 5.0);
    lightPos.x += sin(uTime * 0.5) * 2.0;
    
    vec3 lightDir = normalize(lightPos - vPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Ambient wave for visual interest - Adjusted for flat surfaces
    // Using world position for noise to make it flow across the cube faces
    float wave = sin(vPosition.y * 4.0 + uTime) * cos(vPosition.x * 4.0 + uTime) * 0.05 + 0.05;
    float brightness = diff + wave + 0.1; 

    // Mouse interaction (ripple brightness)
    float distToMouse = distance(vUv, uMouse);
    brightness += smoothstep(0.4, 0.0, distToMouse) * 0.3;

    // Dithering
    vec2 screenPos = gl_FragCoord.xy;
    float dither = dither4x4(screenPos, brightness);

    // Smooth mix for colors based on dither result
    vec3 finalColor = mix(uColor1, uColor2, dither);

    // Subtle scanlines
    float scanline = sin(screenPos.y * 0.5 - uTime * 2.0) * 0.02;
    finalColor += scanline;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const vertexShader = `
  uniform float uTime;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 pos = position;
    
    // Vertex displacement "breathing"
    // Reduced intensity (0.05 -> 0.02) to keep the Cube shape sharp
    float noise = sin(pos.x * 3.0 + uTime) * cos(pos.z * 3.0 + uTime) * 0.02;
    pos += normal * noise;
    
    vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// -----------------------------------------------------------------------------
// MATERIAL IMPLEMENTATION
// -----------------------------------------------------------------------------

const DitherMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uMouse: new THREE.Vector2(),
    uColor1: new THREE.Color('#050505'),
    uColor2: new THREE.Color('#00ff88'),
  },
  vertexShader,
  fragmentShader
);

// Register locally
extend({ DitherMaterial: DitherMaterialImpl });

// -----------------------------------------------------------------------------
// TYPES & EXPORT
// -----------------------------------------------------------------------------

export type DitherMaterialProps = {
  uTime?: number;
  uResolution?: THREE.Vector2;
  uMouse?: THREE.Vector2;
  uColor1?: THREE.Color;
  uColor2?: THREE.Color;
} & React.JSX.IntrinsicElements['shaderMaterial'];

export const DitherMaterial = forwardRef<THREE.ShaderMaterial, DitherMaterialProps>((props, ref) => {
  // @ts-ignore - R3F catalog type issue workaround
  return <ditherMaterial ref={ref} side={THREE.DoubleSide} {...props} />;
});
