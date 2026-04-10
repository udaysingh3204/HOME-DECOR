"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAuraSounds } from "@/hooks/use-aura-sounds";

export function Magnetic({ children }: { children: React.ReactNode }) {
  const { playLock } = useAuraSounds();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const hasLocked = useRef(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    // Audio 'Lock-on' feedback
    if (!hasLocked.current) {
      playLock();
      hasLocked.current = true;
    }
    
    // Calculate distance for the pull effect (0.35 is the intensity)
    setPosition({ x: middleX * 0.35, y: middleY * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    hasLocked.current = false;
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
