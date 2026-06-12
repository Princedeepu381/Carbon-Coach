// src/components/LivingWorld/WorldScene.tsx
"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { computeWorldState, WorldState } from "@/lib/computeWorld";

interface WorldSceneProps {
  co2Kg: number;
  weeklyGoalKg: number;
}

export const WorldScene: React.FC<WorldSceneProps> = memo(({ co2Kg, weeklyGoalKg }) => {
  const state: WorldState = computeWorldState(co2Kg, weeklyGoalKg);

  // Define tree positions so they sprout in natural, fixed locations on the hills
  const treePositions = [
    { x: 120, y: 350, scale: 0.8 },
    { x: 180, y: 360, scale: 0.9 },
    { x: 230, y: 340, scale: 0.7 },
    { x: 300, y: 370, scale: 1.1 },
    { x: 340, y: 380, scale: 0.8 },
    { x: 80, y: 360, scale: 0.75 },
    { x: 150, y: 375, scale: 1.0 },
    { x: 420, y: 390, scale: 0.9 },
    { x: 480, y: 370, scale: 1.15 },
    { x: 550, y: 350, scale: 0.8 },
    { x: 620, y: 340, scale: 0.7 },
    { x: 680, y: 360, scale: 0.9 },
    { x: 740, y: 350, scale: 0.75 },
    { x: 810, y: 370, scale: 1.1 },
    { x: 860, y: 380, scale: 0.8 },
    { x: 910, y: 360, scale: 1.0 },
    { x: 950, y: 350, scale: 0.7 },
    { x: 980, y: 375, scale: 0.85 },
  ];

  // Limit tree count to state.trees
  const visibleTrees = treePositions.slice(0, state.trees);

  return (
    <div className="relative w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden border border-[#edf2eb] shadow-[8px_8px_16px_rgba(165,180,160,0.15),-8px_-8px_16px_rgba(255,255,255,0.95)] bg-white p-1">
      <svg
        className="w-full h-full rounded-[22px]"
        viewBox="0 0 1000 450"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dynamic Sky Gradient (Light Mode Claymorphism) */}
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={
                state.mood === "thriving"
                  ? "#bae6fd" // bright blue
                  : state.mood === "neutral"
                  ? "#e0f2fe" // light sky
                  : state.mood === "stressed"
                  ? "#ffedd5" // warm orange haze
                  : "#fee2e2" // critical light red
              }
            />
            <stop offset="100%" stopColor="#f1f6f0" />
          </linearGradient>

          {/* Sun Gradient */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </radialGradient>

          {/* Depth Shadow Filter for Hills */}
          <filter id="hillShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#275422" floodOpacity="0.1" />
          </filter>

          {/* Hill Gradients (Clay styled) */}
          <linearGradient id="hillBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={
                state.mood === "thriving" || state.mood === "neutral"
                  ? "#a7f3d0" // fresh light green
                  : state.mood === "stressed"
                  ? "#fde047" // faded yellow-green
                  : "#fca5a5" // polluted red
              }
            />
            <stop
              offset="100%"
              stopColor={
                state.mood === "thriving" || state.mood === "neutral"
                  ? "#6ee7b7"
                  : state.mood === "stressed"
                  ? "#eab308"
                  : "#ef4444"
              }
            />
          </linearGradient>

          <linearGradient id="hillFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={
                state.mood === "thriving" || state.mood === "neutral"
                  ? "#34d399" // rich minty green
                  : state.mood === "stressed"
                  ? "#f97316" // warm orange clay
                  : "#dc2626" // deep warning red
              }
            />
            <stop
              offset="100%"
              stopColor={
                state.mood === "thriving" || state.mood === "neutral"
                  ? "#047857"
                  : state.mood === "stressed"
                  ? "#c2410c"
                  : "#991b1b"
              }
            />
          </linearGradient>

          {/* River Gradient */}
          <linearGradient id="riverClean" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="riverMurky" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Puffy Tree Foliage Gradients */}
          <linearGradient id="treeGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          <linearGradient id="treeWithered" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="1000" height="450" fill="url(#skyGradient)" />

        {/* Elegant top-right Sun placement */}
        <g opacity={state.mood === "critical" ? 0.3 : 1.0}>
          <circle cx="820" cy="90" r="110" fill="url(#sunGlow)" />
          <circle
            cx="820"
            cy="90"
            r="35"
            fill="#fffbeb"
            className="shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8)]"
          />
        </g>

        {/* Floating clouds for visual layering */}
        {(state.mood === "neutral" || state.mood === "stressed" || state.mood === "critical") && (
          <g opacity={state.hazeOpacity + 0.35}>
            {/* Cloud 1 */}
            <motion.path
              d="M140 90 C 170 60, 230 60, 250 90 C 270 90, 290 110, 280 130 C 270 150, 140 150, 140 90 Z"
              fill="#ffffff"
              opacity="0.8"
              animate={{ x: [0, 45, 0] }}
              transition={{ repeat: Infinity, duration: 26, ease: "easeInOut" }}
            />
            {/* Cloud 2 */}
            <motion.path
              d="M600 70 C 625 45, 675 45, 690 70 C 705 70, 720 85, 715 100 C 710 115, 600 115, 600 70 Z"
              fill="#e2e8f0"
              opacity="0.7"
              animate={{ x: [0, -35, 0] }}
              transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            />
          </g>
        )}

        {/* Back Hills */}
        <path
          d="M0 320 Q 250 200, 500 320 T 1000 320 L 1000 450 L 0 450 Z"
          fill="url(#hillBack)"
        />

        {/* River (Winding organically through the landscape) */}
        <motion.path
          d="M 500 320 C 490 350, 420 360, 430 380 C 440 400, 560 410, 520 450 L 610 450 C 650 410, 510 400, 500 380 C 490 360, 550 350, 530 320 Z"
          fill={state.mood === "thriving" || state.mood === "neutral" ? "url(#riverClean)" : "url(#riverMurky)"}
          animate={{ opacity: state.riverOpacity }}
          transition={{ duration: 1.5 }}
        />

        {/* Front Hills (Rendered with drop shadow filter for 3D depth) */}
        <path
          d="M0 360 Q 150 280, 400 370 T 800 350 T 1000 380 L 1000 450 L 0 450 Z"
          fill="url(#hillFront)"
          filter="url(#hillShadow)"
        />

        {/* Puffy 3D-styled Clay Trees Layer */}
        <g id="trees">
          <AnimatePresence>
            {visibleTrees.map((tree, i) => {
              const isWithered = state.mood === "critical" || (state.mood === "stressed" && i >= 3);
              return (
                <motion.g
                  key={i}
                  transform={`translate(${tree.x}, ${tree.y}) scale(${tree.scale})`}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  style={{ transformOrigin: "bottom center" }}
                >
                  {/* Brown Clay Trunk */}
                  <rect x="-2" y="0" width="4" height="18" fill="#5c2e0b" rx="1.5" />
                  
                  {/* Overlapping Puffy Clay Circles for Foliage */}
                  <g className="shadow-md">
                    {/* Bottom main cloud */}
                    <circle cx="0" cy="-14" r="13" fill={isWithered ? "url(#treeWithered)" : "url(#treeGreen)"} />
                    {/* Middle left bubble */}
                    <circle cx="-8" cy="-24" r="9" fill={isWithered ? "url(#treeWithered)" : "url(#treeGreen)"} />
                    {/* Middle right bubble */}
                    <circle cx="8" cy="-24" r="9" fill={isWithered ? "url(#treeWithered)" : "url(#treeGreen)"} />
                    {/* Top bubble cap */}
                    <circle cx="0" cy="-33" r="10" fill={isWithered ? "url(#treeWithered)" : "url(#treeGreen)"} />
                  </g>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </g>

        {/* Smog multiplier layer if high or critical pollution */}
        {state.skyPollution > 0.4 && (
          <motion.rect
            width="1000"
            height="450"
            fill="#475569"
            initial={{ opacity: 0 }}
            animate={{ opacity: state.skyPollution * 0.35 }}
            transition={{ duration: 1.5 }}
            className="mix-blend-multiply"
          />
        )}
      </svg>

      {/* Floating Sparkles overlaying in thriving mood */}
      {state.mood === "thriving" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[25%] left-[20%] w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping opacity-70" />
          <div className="absolute top-[40%] left-[50%] w-3 h-3 bg-sky-200 rounded-full animate-ping opacity-60" />
          <div className="absolute top-[55%] right-[25%] w-2 h-2 bg-emerald-200 rounded-full animate-ping opacity-85" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[20%] right-[40%] w-3 h-3 bg-yellow-100 rounded-full animate-ping opacity-65" style={{ animationDelay: "0.5s" }} />
        </div>
      )}

      {/* World state label badge inside scene */}
      <div className={`absolute top-4 left-4 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border-2 ${
        state.mood === "thriving"
          ? "bg-emerald-50 border-emerald-200"
          : state.mood === "neutral"
          ? "bg-blue-50 border-blue-200"
          : state.mood === "stressed"
          ? "bg-amber-50 border-amber-200"
          : "bg-red-50 border-red-200"
      }`}>
        <span className="text-lg">
          {state.mood === "thriving" ? "🌳" : state.mood === "neutral" ? "🌿" : state.mood === "stressed" ? "🍂" : "🥀"}
        </span>
        <span className={`text-xs uppercase tracking-wider font-extrabold font-display ${
          state.mood === "thriving"
            ? "text-emerald-700"
            : state.mood === "neutral"
            ? "text-blue-700"
            : state.mood === "stressed"
            ? "text-amber-700"
            : "text-red-700"
        }`}>
          {state.mood === "thriving" ? "Thriving" : state.mood === "neutral" ? "Balanced" : state.mood === "stressed" ? "Stressed" : "Critical"}
        </span>
      </div>
    </div>
  );
});

WorldScene.displayName = 'WorldScene';
