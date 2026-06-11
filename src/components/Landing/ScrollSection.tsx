// src/components/Landing/ScrollSection.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  fullHeight?: boolean;
  id?: string;
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  fullHeight = false,
  id,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const directionVariants = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 },
    none: {},
  };

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      animate={
        inView
          ? { opacity: 1, y: 0, x: 0 }
          : { opacity: 0, ...directionVariants[direction] }
      }
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={`${fullHeight ? "min-h-screen" : ""} ${className}`}
    >
      {children}
    </motion.section>
  );
};

// Made with Bob
