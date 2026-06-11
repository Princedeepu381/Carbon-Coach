// src/components/Animated/AnimatedButton.tsx
"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/lib/animations/hooks";
import { MICRO_INTERACTIONS } from "@/lib/animations/constants";

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary: "clay-btn clay-btn-primary",
    secondary: "clay-btn clay-btn-secondary",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  return (
    <motion.button
      whileHover={!prefersReducedMotion && !disabled ? MICRO_INTERACTIONS.button.hover : undefined}
      whileTap={!prefersReducedMotion && !disabled ? MICRO_INTERACTIONS.button.tap : undefined}
      disabled={disabled || isLoading}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-bold rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span>Loading...</span>
        </motion.div>
      ) : (
        children
      )}

      {/* Ripple effect on click */}
      {!prefersReducedMotion && (
        <motion.span
          className="absolute inset-0 bg-white/20 rounded-lg"
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
};

// Made with Bob
