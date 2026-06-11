// src/components/Animated/AnimatedProgress.tsx
"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useScrollReveal } from "@/lib/animations/hooks";
import { EMISSION_COLORS } from "@/lib/animations/constants";

interface AnimatedProgressProps {
  value: number; // 0-100
  max?: number;
  height?: string;
  showLabel?: boolean;
  label?: string;
  emissionLevel?: keyof typeof EMISSION_COLORS;
  className?: string;
  animated?: boolean;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  height = "h-2",
  showLabel = false,
  label,
  emissionLevel = "thriving",
  className = "",
  animated = true,
}) => {
  const { ref, inView } = useScrollReveal({ threshold: 0.5 });
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (inView && animated) {
      progress.set((value / max) * 100);
    } else if (!animated) {
      progress.set((value / max) * 100);
    }
  }, [inView, value, max, progress, animated]);

  const colors = EMISSION_COLORS[emissionLevel];
  const percentage = Math.round((value / max) * 100);

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-on-surface-variant">{label}</span>
          <span className="text-sm font-black" style={{ color: colors.text }}>
            {percentage}%
          </span>
        </div>
      )}
      
      <div
        className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden relative shadow-inner`}
      >
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: smoothProgress.get() + "%" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// Made with Bob
