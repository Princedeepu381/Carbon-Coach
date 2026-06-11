// src/components/Landing/NatureElements.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export const AnimatedClouds: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Cloud 1 */}
      <motion.div
        className="absolute top-10 left-0 w-32 h-16 bg-white/30 rounded-full blur-xl"
        animate={{
          x: ["-100%", "100vw"],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Cloud 2 */}
      <motion.div
        className="absolute top-24 left-0 w-40 h-20 bg-white/20 rounded-full blur-xl"
        animate={{
          x: ["-100%", "100vw"],
        }}
        transition={{
          duration: 80,
          repeat: Infinity,
          ease: "linear",
          delay: 10,
        }}
      />
      {/* Cloud 3 */}
      <motion.div
        className="absolute top-40 left-0 w-36 h-18 bg-white/25 rounded-full blur-xl"
        animate={{
          x: ["-100%", "100vw"],
        }}
        transition={{
          duration: 70,
          repeat: Infinity,
          ease: "linear",
          delay: 20,
        }}
      />
    </div>
  );
};

export const GrowingTree: React.FC<{ inView: boolean; className?: string }> = ({
  inView,
  className = "",
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={inView ? { scaleY: 1, opacity: 1 } : {}}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{ transformOrigin: "bottom" }}
    >
      {/* Tree trunk */}
      <div className="w-4 h-20 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-t-lg mx-auto" />
      {/* Tree foliage */}
      <motion.div
        className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-[#2d5e29] to-[#1e4620] rounded-full"
        animate={inView ? { scale: [0.8, 1.1, 1] } : {}}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
      />
      <motion.div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-[#366a32] to-[#2d5e29] rounded-full"
        animate={inView ? { scale: [0.8, 1.1, 1] } : {}}
        transition={{ duration: 2, delay: 0.7, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.div>
  );
};

export const FlowingRiver: React.FC<{ inView: boolean; className?: string }> = ({
  inView,
  className = "",
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        width="100%"
        height="60"
        viewBox="0 0 400 60"
        className="w-full"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,30 Q100,10 200,30 T400,30 L400,60 L0,60 Z"
          fill="url(#riverGradient)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#326295" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#4a90e2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#326295" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
      {/* Animated water flow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={inView ? { x: ["-100%", "200%"] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export const FloatingLeaves: React.FC<{ className?: string }> = ({ className = "" }) => {
  const leaves = [
    { delay: 0, duration: 8, x: 20 },
    { delay: 2, duration: 10, x: 60 },
    { delay: 4, duration: 9, x: 40 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ left: `${leaf.x}%`, top: "-10%" }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, 30, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          🍃
        </motion.div>
      ))}
    </div>
  );
};

export const SunRays: React.FC<{ inView: boolean; className?: string }> = ({
  inView,
  className = "",
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-1/2 w-1 bg-gradient-to-b from-yellow-200/40 to-transparent origin-top"
          style={{
            height: "50%",
            transform: `rotate(${i * 45}deg)`,
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={inView ? { opacity: [0.3, 0.6, 0.3], scaleY: 1 } : {}}
          transition={{
            duration: 4,
            delay: i * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export const Butterflies: React.FC<{ className?: string }> = ({ className = "" }) => {
  const butterflies = [
    { delay: 0, duration: 12, startX: 10, endX: 80 },
    { delay: 3, duration: 15, startX: 70, endX: 20 },
    { delay: 6, duration: 10, startX: 40, endX: 90 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {butterflies.map((butterfly, i) => (
        <motion.div
          key={i}
          className="absolute text-xl"
          style={{ left: `${butterfly.startX}%`, top: "20%" }}
          animate={{
            x: [`0%`, `${butterfly.endX - butterfly.startX}vw`],
            y: [0, -50, 0, 50, 0],
          }}
          transition={{
            duration: butterfly.duration,
            delay: butterfly.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🦋
        </motion.div>
      ))}
    </div>
  );
};

// Made with Bob
