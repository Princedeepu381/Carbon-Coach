// src/components/Animated/StaggerContainer.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollReveal, useReducedMotion } from "@/lib/animations/hooks";
import { STAGGER_DELAY, ANIMATION_DURATION, ANIMATION_EASING } from "@/lib/animations/constants";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = STAGGER_DELAY.normal,
  className = "",
  direction = "up",
}) => {
  const { ref, inView } = useScrollReveal();
  const prefersReducedMotion = useReducedMotion();

  const directionVariants = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, ...directionVariants[direction] },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: ANIMATION_DURATION.normal / 1000,
        ease: ANIMATION_EASING.smooth,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
};

// Made with Bob
