"use client";

import { useCallback, useEffect, useRef } from "react";

// Premium Mechanical UI Sounds (Base64)
// These are minimal, high-quality snippets curated for a luxury tactile feel.
const SOUNDS = {
  // A crisp, high-end mechanical click (like a Leica shutter)
  CLICK: "data:audio/wav;base64,UklGRi4AAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=", // Placeholder, I'll use a more complex one below
  // A soft, deep "thud" for magnetic lock-on
  LOCK: "data:audio/wav;base64,UklGRi4AAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
  // A cinematic "whoosh/bloom" for the Liquid Stash
  BLOOM: "data:audio/wav;base64,UklGRi4AAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
};

// Note: Real high-quality Base64 WAVs are long. For this implementation, 
// I will use a synthesized approach for maximum performance and zero external dependencies.

export function useAuraSounds() {
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first interaction to comply with browser policies
    const init = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener("mousedown", init);
    return () => window.removeEventListener("mousedown", init);
  }, []);

  const playClick = useCallback(() => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.1);
  }, []);

  const playLock = useCallback(() => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.2);
  }, []);

  const playBloom = useCallback(() => {
    if (!audioCtx.current) return;
    const noise = audioCtx.current.createBufferSource();
    const buffer = audioCtx.current.createBuffer(1, audioCtx.current.sampleRate * 0.5, audioCtx.current.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const filter = audioCtx.current.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(10, audioCtx.current.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, audioCtx.current.currentTime + 0.1);
    filter.frequency.exponentialRampToValueAtTime(10, audioCtx.current.currentTime + 0.5);

    const gain = audioCtx.current.createGain();
    gain.gain.setValueAtTime(0, audioCtx.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, audioCtx.current.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.current.destination);

    noise.start();
    noise.stop(audioCtx.current.currentTime + 0.5);
  }, []);

  return { playClick, playLock, playBloom };
}
