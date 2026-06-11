// src/components/Animated/AnimatedCard.tsx
"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useScrollReveal, useReducedMotion } from "@/lib/animations/hooks";
import { ANIMATION_DURATION, ANIMATION_EASING, MICRO_INTERACTIONS } from "@/lib/animations/constants";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  hover?: boolean;
  className?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  direction = "up",
  hover = true,
  className = "",
  ...props
}) => {
  const { ref, inView } = useScrollReveal({ delay });
  const prefersReducedMotion = useReducedMotion();

  const directionVariants = {
    up: { y: 30, opacity: 0 },
    down: { y: -30, opacity: 0 },
    left: { x: 30, opacity: 0 },
    right: { x: -30, opacity: 0 },
    scale: { scale: 0.8, opacity: 0 },
  };

  const initial = prefersReducedMotion ? { opacity: 0 } : directionVariants[direction];
  const animate = inView
    ? { y: 0, x: 0, scale: 1, opacity: 1 }
    : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{
        duration: ANIMATION_DURATION.normal / 1000,
        delay,
        ease: ANIMATION_EASING.smooth,
      }}
      whileHover={hover && !prefersReducedMotion ? MICRO_INTERACTIONS.card.hover : undefined}
      whileTap={hover && !prefersReducedMotion ? MICRO_INTERACTIONS.card.tap : undefined}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Made with Bob
