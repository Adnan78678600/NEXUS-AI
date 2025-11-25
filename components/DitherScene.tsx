import { useRef, useMemo, useLayoutEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, ScrollControls, Scroll, useScroll, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { DitherMaterial } from './DitherShader';
import Overlay from './Overlay';
import { useProceduralAudio } from '../hooks/useProceduralAudio';
import { useAppStore, SECTION_COUNT } from '../stores/useAppStore';

interface SceneContentProps {
  scrollRef: React.MutableRefObject<{ el: HTMLElement | null; offset: number } | null>;
}

const SceneContent = ({ scrollRef }: SceneContentProps) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { size, pointer, viewport } = useThree();
  const scroll = useScroll();
  const updateAudio = useProceduralAudio();
  const setScrollOffset = useAppStore((state) => state.setScrollOffset);
  
  const prevPointer = useRef(new THREE.Vector2());

  useLayoutEffect(() => {
    scrollRef.current = scroll;
    const resetScroll = () => {
      if (scroll.el) {
        scroll.el.scrollTop = 0;
      }
    };
    requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });
  }, [scroll, scrollRef]);

  const colors = useMemo(() => ({
    page1: { c1: new THREE.Color('#020202'), c2: new THREE.Color('#00ff9f') },
    page2: { c1: new THREE.Color('#0a0010'), c2: new THREE.Color('#d400ff') },
    page3: { c1: new THREE.Color('#000814'), c2: new THREE.Color('#00a2ff') },
    page4: { c1: new THREE.Color('#1a0500'), c2: new THREE.Color('#ff3c00') },
    page5: { c1: new THREE.Color('#000000'), c2: new THREE.Color('#e0e0e0') },
  }), []);

  useFrame((_state, delta) => {
    const r1 = scroll.range(0/4, 1/4);
    const r2 = scroll.range(1/4, 1/4);
    const r3 = scroll.range(2/4, 1/4);
    const r4 = scroll.range(3/4, 1/4);

    setScrollOffset(scroll.offset);

    const mouseDist = prevPointer.current.distanceTo(pointer);
    const mouseVelocity = mouseDist / delta;
    prevPointer.current.copy(pointer);
    
    const safeVelocity = Math.min(mouseVelocity, 5.0);
    updateAudio(scroll.offset, safeVelocity);

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      
      const currentMouse = materialRef.current.uniforms.uMouse.value as THREE.Vector2;
      currentMouse.lerp(new THREE.Vector2((pointer.x + 1) / 2, (pointer.y + 1) / 2), 0.05);
      
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);

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

      (materialRef.current.uniforms.uColor1.value as THREE.Color).copy(c1);
      (materialRef.current.uniforms.uColor2.value as THREE.Color).copy(c2);
    }

    if (meshRef.current && groupRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;

      const targetPos = new THREE.Vector3(0, 0, 0);
      const targetRot = new THREE.Euler(0, 0, 0);
      
      if (scroll.offset < 0.25) {
        targetPos.set(
          THREE.MathUtils.lerp(0, -viewport.width * 0.2, r1),
          0,
          THREE.MathUtils.lerp(0, -1, r1)
        );
        targetRot.set(
          THREE.MathUtils.lerp(0.6, 1.0, r1),
          THREE.MathUtils.lerp(0.8, 2.0, r1),
          THREE.MathUtils.lerp(0, 0.5, r1)
        );
      } else if (scroll.offset < 0.5) {
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
        targetPos.set(
          THREE.MathUtils.lerp(viewport.width * 0.25, 0, r3),
          THREE.MathUtils.lerp(-0.5, 0, r3),
          THREE.MathUtils.lerp(-1.5, 1.5, r3)
        );
        targetRot.set(
          THREE.MathUtils.lerp(2.5, 3.14, r3),
          THREE.MathUtils.lerp(1.0, 0.7, r3),
          0
        );
      } else {
        targetPos.set(
          0,
          THREE.MathUtils.lerp(0, -0.5, r4),
          THREE.MathUtils.lerp(1.5, -6, r4)
        );
        targetRot.set(
          THREE.MathUtils.lerp(3.14, 4.0, r4),
          THREE.MathUtils.lerp(0.7, 15.0, r4),
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

interface DitherSceneProps {
  onScrollReady?: (scrollToSection: (section: number) => void) => void;
}

const DitherScene = ({ onScrollReady }: DitherSceneProps) => {
  const [mountKey] = useState(() => Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<{ el: HTMLElement | null; offset: number } | null>(null);

  const scrollToSection = useCallback((section: number) => {
    if (scrollRef.current?.el) {
      const totalHeight = scrollRef.current.el.scrollHeight - scrollRef.current.el.clientHeight;
      const targetScroll = (section / (SECTION_COUNT - 1)) * totalHeight;
      scrollRef.current.el.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, []);

  useLayoutEffect(() => {
    onScrollReady?.(scrollToSection);
  }, [onScrollReady, scrollToSection]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const resetScrollElements = () => {
      const scrollContainers = containerRef.current?.querySelectorAll('div[style*="overflow"]');
      scrollContainers?.forEach((el) => {
        (el as HTMLElement).scrollTop = 0;
      });
    };

    resetScrollElements();

    const t1 = setTimeout(resetScrollElements, 0);
    const t2 = setTimeout(resetScrollElements, 100);
    const t3 = setTimeout(resetScrollElements, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 bg-black">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 40 }}
        dpr={[1, 2]} 
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      >
        <ScrollControls key={mountKey} pages={SECTION_COUNT} damping={0.15}>
          <SceneContent scrollRef={scrollRef} />
          <Scroll html style={{ width: '100vw', height: '100vh' }}>
            <Overlay />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default DitherScene;
