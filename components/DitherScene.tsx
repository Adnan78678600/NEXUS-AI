import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, ScrollControls, Scroll, useScroll, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { DitherMaterial } from './DitherShader';
import Overlay from './Overlay';

// -----------------------------------------------------------------------------
// AUDIO ENGINE
// -----------------------------------------------------------------------------

const useProceduralAudio = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const harmonicOscRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isInitialized = useRef(false);

  const initAudio = () => {
    if (isInitialized.current) return;
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0; // Start silent, fade in
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    // Filter (Lowpass) - Controls the "brightness"
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 100;
    filter.Q.value = 1;
    filter.connect(masterGain);
    filterRef.current = filter;

    // Osc 1: Deep Drone (Sawtooth)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 50;
    osc1.connect(filter);
    droneOscRef.current = osc1;

    // Osc 2: Texture (Sine, slightly detuned)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 51; 
    osc2.connect(filter);
    harmonicOscRef.current = osc2;

    // Start
    osc1.start();
    osc2.start();
    
    // Fade in
    masterGain.gain.setTargetAtTime(0.08, ctx.currentTime, 2);

    isInitialized.current = true;
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (!isInitialized.current) initAudio();
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (scrollProgress: number, mouseVelocity: number) => {
    if (!audioCtxRef.current || !filterRef.current || !droneOscRef.current || !harmonicOscRef.current) return;
    
    const time = audioCtxRef.current.currentTime;

    // 1. Scroll Modulation
    // As we scroll down, pitch drops (darker) but filter opens (brighter/sharper)
    // Page 1 (0.0): 60Hz
    // Page 5 (1.0): 40Hz (Deep rumbling)
    const targetFreq = 60 - (scrollProgress * 20);
    droneOscRef.current.frequency.setTargetAtTime(targetFreq, time, 0.1);
    harmonicOscRef.current.frequency.setTargetAtTime(targetFreq * 1.02, time, 0.1);

    // Filter opens up based on scroll + mouse velocity
    // Base filter: 100Hz -> 800Hz based on scroll
    const baseFilterFreq = 100 + (scrollProgress * 800);
    // Add mouse velocity for "swoosh" effect
    const velocityImpact = mouseVelocity * 2000;
    
    filterRef.current.frequency.setTargetAtTime(baseFilterFreq + velocityImpact, time, 0.1);
  };
};

// -----------------------------------------------------------------------------
// SCENE
// -----------------------------------------------------------------------------

const SceneContent = () => {
  const materialRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { size, pointer, viewport } = useThree();
  const scroll = useScroll();
  const updateAudio = useProceduralAudio();
  
  // Track previous pointer for velocity calculation
  const prevPointer = useRef(new THREE.Vector2());

  // Pre-allocate colors for 5-stage smooth transitions
  const colors = useMemo(() => ({
    page1: { c1: new THREE.Color('#020202'), c2: new THREE.Color('#00ff9f') }, // Neon Green/Black (Hero)
    page2: { c1: new THREE.Color('#0a0010'), c2: new THREE.Color('#d400ff') }, // Cyber Purple (Identity)
    page3: { c1: new THREE.Color('#000814'), c2: new THREE.Color('#00a2ff') }, // Deep Blue (Architecture)
    page4: { c1: new THREE.Color('#1a0500'), c2: new THREE.Color('#ff3c00') }, // Industrial Orange (Specs)
    page5: { c1: new THREE.Color('#000000'), c2: new THREE.Color('#e0e0e0') }, // Monochrome (Terminal)
  }), []);

  useFrame((state, delta) => {
    const r1 = scroll.range(0/4, 1/4); // Page 1 -> 2
    const r2 = scroll.range(1/4, 1/4); // Page 2 -> 3
    const r3 = scroll.range(2/4, 1/4); // Page 3 -> 4
    const r4 = scroll.range(3/4, 1/4); // Page 4 -> 5

    // Calculate Mouse Velocity
    const mouseDist = prevPointer.current.distanceTo(pointer);
    const mouseVelocity = mouseDist / delta; // Distance per second approx
    prevPointer.current.copy(pointer);
    
    // Update Audio
    // Clamp velocity to avoid exploding ears on glitch
    const safeVelocity = Math.min(mouseVelocity, 5.0); 
    updateAudio(scroll.offset, safeVelocity);

    // Global Uniform Updates
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      // Smooth mouse follow
      materialRef.current.uMouse.lerp(new THREE.Vector2((pointer.x + 1) / 2, (pointer.y + 1) / 2), 0.05);
      materialRef.current.uResolution.set(size.width, size.height);

      // Complex Color Interpolation Logic
      const c1 = new THREE.Color().copy(colors.page1.c1);
      const c2 = new THREE.Color().copy(colors.page1.c2);

      if (scroll.offset < 0.25) {
         c1.lerp(colors.page2.c1, r1);
         c2.lerp(colors.page2.c2, r1);
      } else if (scroll.offset < 0.5) {
         c1.copy(colors.page2.c1).lerp(colors.page3.c1, r2);
         c2.copy(colors.page2.c2).lerp(colors.page3.c2, r2);
      } else if (scroll.offset < 0.75) {
         c1.copy(colors.page3.c1).lerp(colors.page4.c1, r3);
         c2.copy(colors.page3.c2).lerp(colors.page4.c2, r3);
      } else {
         c1.copy(colors.page4.c1).lerp(colors.page5.c1, r4);
         c2.copy(colors.page4.c2).lerp(colors.page5.c2, r4);
      }

      materialRef.current.uColor1.copy(c1);
      materialRef.current.uColor2.copy(c2);
    }

    // Mesh Animation
    if (meshRef.current && groupRef.current) {
      // Base rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;

      // Scroll-driven transformations
      const targetPos = new THREE.Vector3(0, 0, 0);
      const targetRot = new THREE.Euler(0, 0, 0);
      
      // State machine for 3D transforms - Updated for CUBE
      if (scroll.offset < 0.25) {
        // Hero -> Identity
        // Start: Diagonal view. End: Shift left, rotate to flat face
        targetPos.set(
           THREE.MathUtils.lerp(0, -viewport.width * 0.2, r1), 
           0, 
           THREE.MathUtils.lerp(0, -1, r1)
        );
        targetRot.set(
          THREE.MathUtils.lerp(0.6, 1.0, r1), // Tilted start
          THREE.MathUtils.lerp(0.8, 2.0, r1),
          THREE.MathUtils.lerp(0, 0.5, r1)
        );
      } else if (scroll.offset < 0.5) {
        // Identity -> Architecture
        // Move right, show edge
        targetPos.set(
          THREE.MathUtils.lerp(-viewport.width * 0.2, viewport.width * 0.25, r2),
          THREE.MathUtils.lerp(0, -0.5, r2),
          THREE.MathUtils.lerp(-1, -1.5, r2)
        );
        targetRot.set(
          THREE.MathUtils.lerp(1.0, 2.5, r2),
          THREE.MathUtils.lerp(2.0, 1.0, r2),
          THREE.MathUtils.lerp(0.5, 0, r2)
        );
      } else if (scroll.offset < 0.75) {
        // Architecture -> Specs
        // Zoom center, straight on
        targetPos.set(
          THREE.MathUtils.lerp(viewport.width * 0.25, 0, r3),
          THREE.MathUtils.lerp(-0.5, 0, r3),
          THREE.MathUtils.lerp(-1.5, 1.5, r3) // Zoom way in
        );
        targetRot.set(
          THREE.MathUtils.lerp(2.5, 3.14, r3), // Rotate to flat face
          THREE.MathUtils.lerp(1.0, 0.7, r3),
          0
        );
      } else {
        // Specs -> Terminal
        // Push back, spin fast
        targetPos.set(
          0,
          THREE.MathUtils.lerp(0, -0.5, r4),
          THREE.MathUtils.lerp(1.5, -6, r4) // Push far back
        );
        targetRot.set(
          THREE.MathUtils.lerp(3.14, 4.0, r4),
          THREE.MathUtils.lerp(0.7, 15.0, r4), // High speed spin
          0
        );
      }

      groupRef.current.position.lerp(targetPos, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.x, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot.y, 0.08);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.z, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        {/* High segment count (64) ensures vertex noise looks good on flat surfaces */}
        <Box args={[2.5, 2.5, 2.5, 64, 64, 64]} ref={meshRef}>
          <DitherMaterial
            ref={materialRef}
            uColor1={colors.page1.c1}
            uColor2={colors.page1.c2}
          />
        </Box>
      </Float>
      <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

const DitherScene = () => {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 40 }}
        dpr={[1, 2]} 
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      >
        <ScrollControls pages={5} damping={0.15}>
          <SceneContent />
          {/* Explicitly set width/height to prevent collapse in some browsers */}
          <Scroll html style={{ width: '100vw', height: '100vh' }}>
            <Overlay />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default DitherScene;
