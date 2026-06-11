// src/components/Landing/MorphingEffect.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface MorphingNumberToNatureProps {
  number: number;
  unit: string;
  natureElement: "tree" | "river" | "sky";
  description: string;
  className?: string;
}

export const MorphingNumberToNature: React.FC<MorphingNumberToNatureProps> = ({
  number,
  unit,
  natureElement,
  description,
  className = "",
}) => {
  const [showNumber, setShowNumber] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setShowNumber(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  const natureIcons = {
    tree: "🌲",
    river: "🌊",
    sky: "☁️",
  };

  const natureColors = {
    tree: "from-[#2d5e29] to-[#1e4620]",
    river: "from-[#326295] to-[#1e3a8a]",
    sky: "from-[#4a90e2] to-[#326295]",
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {showNumber ? (
          <motion.div
            key="number"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200"
          >
            <div className="text-5xl font-black text-red-600 mb-2">
              {number}
              <span className="text-2xl ml-1">{unit}</span>
            </div>
            <div className="text-sm font-bold text-red-800">CO₂ Emissions</div>
          </motion.div>
        ) : (
          <motion.div
            key="nature"
            initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br ${natureColors[natureElement]} border-2 border-white/30`}
          >
            <motion.div
              className="text-6xl mb-3"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {natureIcons[natureElement]}
            </motion.div>
            <div className="text-sm font-bold text-white text-center">
              {description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ParticleTransition: React.FC<{
  inView: boolean;
  className?: string;
}> = ({ inView, className = "" }) => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-green-400 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            inView
              ? {
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -50],
                }
              : {}
          }
          transition={{
            duration: 2,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      ))}
    </div>
  );
};

export const WaveTransition: React.FC<{
  inView: boolean;
  color?: string;
  className?: string;
}> = ({ inView, color = "#2d5e29", className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
      >
        <motion.path
          d="M0,60 C300,100 600,20 900,60 C1050,80 1200,60 1200,60 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity="0.3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.3 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,80 C300,60 600,100 900,80 C1050,70 1200,80 1200,80 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.2 } : {}}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>
    </div>
  );
};

// Made with Bob
