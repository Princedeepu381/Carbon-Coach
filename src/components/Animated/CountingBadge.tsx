// src/components/Animated/CountingBadge.tsx
"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useCountUp, useScrollReveal } from "@/lib/animations/hooks";
import { EMISSION_COLORS } from "@/lib/animations/constants";

interface CountingBadgeProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  emissionLevel?: keyof typeof EMISSION_COLORS;
  className?: string;
  autoStart?: boolean;
}

export const CountingBadge: React.FC<CountingBadgeProps> = ({
  value,
  suffix = "",
  prefix = "",
  decimals = 1,
  duration = 2000,
  emissionLevel = "thriving",
  className = "",
  autoStart = true,
}) => {
  const { ref, inView } = useScrollReveal({ threshold: 0.5 });
  const { count, start, formattedCount } = useCountUp(value, {
    duration,
    decimals,
  });

  useEffect(() => {
    if (inView && autoStart) {
      start();
    }
  }, [inView, autoStart, start]);

  const colors = EMISSION_COLORS[emissionLevel];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className={`inline-flex items-center gap-1 px-4 py-2 rounded-full font-black ${className}`}
      style={{
        background: colors.bg,
        color: colors.text,
        border: `2px solid ${colors.from}20`,
      }}
    >
      <motion.span
        key={count}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-lg"
      >
        {prefix}
        {formattedCount}
        {suffix}
      </motion.span>
    </motion.div>
  );
};

// Made with Bob
