"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useAuraSounds } from "@/hooks/use-aura-sounds";

export function AuraCursor() {
  const { playClick, playLock } = useAuraSounds();
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "text">("default");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Ultra-Smooth Spring Physics (Optimized for 60fps)
  const springConfig = { damping: 30, stiffness: 800, mass: 0.2 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Direct MotionValue updates bypass React's render loop for performance
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isPointer = window.getComputedStyle(target).cursor === "pointer";
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      const nextType = isInput ? "text" : isPointer ? "pointer" : "default";
      if (nextType === "pointer" && cursorType !== "pointer") {
        playLock();
      }
      setCursorType(nextType);
    };

    const handleMouseDown = () => playClick();

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [cursorX, cursorY, cursorType, playClick, playLock]);

  return (
    <motion.div
      className="fixed top-0 left-0 h-8 w-8 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: cursorType === "pointer" ? 2.5 : cursorType === "text" ? 0.4 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    />
  );
}
