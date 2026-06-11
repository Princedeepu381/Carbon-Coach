// src/components/Landing/ParallaxBackground.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxBackground: React.FC = () => {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Different parallax speeds for depth effect
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]); // Slowest (furthest)
  const y2 = useTransform(scrollY, [0, 1000], [0, -250]); // Medium
  const y3 = useTransform(scrollY, [0, 1000], [0, -350]); // Fastest (closest)

  const opacity1 = useTransform(scrollY, [0, 500], [1, 0.3]);
  const opacity2 = useTransform(scrollY, [0, 500], [1, 0.5]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Layer 1 - Furthest (slowest movement) */}
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-[#2d5e29]/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-[#326295]/4 rounded-full blur-[100px]" />
      </motion.div>

      {/* Layer 2 - Middle (medium movement) */}
      <motion.div
        style={{ y: y2, opacity: opacity2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-[#326295]/5 rounded-full blur-[110px]" />
        <div className="absolute top-1/2 right-20 w-[380px] h-[380px] bg-[#b56c07]/4 rounded-full blur-[95px]" />
      </motion.div>

      {/* Layer 3 - Closest (fastest movement) */}
      <motion.div
        style={{ y: y3 }}
        className="absolute inset-0"
      >
        <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[#2d5e29]/7 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 left-1/3 w-[360px] h-[360px] bg-[#b56c07]/5 rounded-full blur-[90px]" />
      </motion.div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#e4eee1]/20" />
    </div>
  );
};

export const ParallaxSection: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className = "" }) => {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

// Made with Bob
