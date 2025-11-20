import * as THREE from 'three';

export interface DitherUniforms {
  uTime: { value: number };
  uResolution: { value: THREE.Vector2 };
  uMouse: { value: THREE.Vector2 };
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
}

export interface AIResponse {
  text: string;
}

export enum AIStatus {
  IDLE,
  THINKING,
  SUCCESS,
  ERROR
}

export interface SystemMetric {
  label: string;
  value: string | number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
}