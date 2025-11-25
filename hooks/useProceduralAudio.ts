import { useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../stores/useAppStore';

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export const useProceduralAudio = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const harmonicOscRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isInitialized = useRef(false);
  const isDestroyed = useRef(false);
  
  const isAudioEnabled = useAppStore((state) => state.isAudioEnabled);

  const initAudio = useCallback(() => {
    if (isInitialized.current || isDestroyed.current) return;
    
    const win = window as WebkitWindow;
    const AudioContextClass = window.AudioContext || win.webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 100;
    filter.Q.value = 1;
    filter.connect(masterGain);
    filterRef.current = filter;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 50;
    osc1.connect(filter);
    droneOscRef.current = osc1;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 51;
    osc2.connect(filter);
    harmonicOscRef.current = osc2;

    osc1.start();
    osc2.start();
    masterGain.gain.setTargetAtTime(0.08, ctx.currentTime, 2);

    isInitialized.current = true;
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      if (!isInitialized.current && !isDestroyed.current) {
        initAudio();
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    
    return () => {
      isDestroyed.current = true;
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      
      try {
        droneOscRef.current?.stop();
        harmonicOscRef.current?.stop();
      } catch {
        // Oscillators may already be stopped
      }
      
      droneOscRef.current?.disconnect();
      harmonicOscRef.current?.disconnect();
      filterRef.current?.disconnect();
      gainRef.current?.disconnect();
      
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
      
      audioCtxRef.current = null;
      droneOscRef.current = null;
      harmonicOscRef.current = null;
      filterRef.current = null;
      gainRef.current = null;
    };
  }, [initAudio]);

  const updateAudio = useCallback((scrollProgress: number, mouseVelocity: number) => {
    if (!audioCtxRef.current || !filterRef.current || !droneOscRef.current || !harmonicOscRef.current) return;
    if (!isAudioEnabled) {
      if (gainRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
      }
      return;
    }
    
    if (gainRef.current && gainRef.current.gain.value < 0.08) {
      gainRef.current.gain.setTargetAtTime(0.08, audioCtxRef.current.currentTime, 0.5);
    }
    
    const time = audioCtxRef.current.currentTime;
    const targetFreq = 60 - (scrollProgress * 20);
    droneOscRef.current.frequency.setTargetAtTime(targetFreq, time, 0.1);
    harmonicOscRef.current.frequency.setTargetAtTime(targetFreq * 1.02, time, 0.1);

    const baseFilterFreq = 100 + (scrollProgress * 800);
    const safeVelocity = Math.min(mouseVelocity, 5.0);
    const velocityImpact = safeVelocity * 2000;
    
    filterRef.current.frequency.setTargetAtTime(baseFilterFreq + velocityImpact, time, 0.1);
  }, [isAudioEnabled]);

  return updateAudio;
};
