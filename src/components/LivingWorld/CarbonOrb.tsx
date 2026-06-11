// src/components/LivingWorld/CarbonOrb.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { computeWorldState } from "@/lib/computeWorld";

interface CarbonOrbProps {
  co2Kg: number;
  weeklyGoalKg: number;
}

export const CarbonOrb: React.FC<CarbonOrbProps> = ({ co2Kg, weeklyGoalKg }) => {
  const state = computeWorldState(co2Kg, weeklyGoalKg);
  const dailyGoal = weeklyGoalKg / 7;
  const percentage = Math.min((co2Kg / dailyGoal) * 100, 100);

  // Dynamic 3D Claymorphic gradients and shadows depending on the safety mood
  const getOrbStyle = (mood: string) => {
    switch (mood) {
      case "thriving":
        return {
          background: "radial-gradient(circle at 35% 35%, #a7f3d0 0%, #4ade80 50%, #15803d 100%)",
          boxShadow: "inset 6px 6px 12px rgba(255, 255, 255, 0.75), inset -8px -8px 16px rgba(21, 128, 61, 0.45), 0 12px 24px rgba(21, 128, 61, 0.15)",
          textPrimary: "text-[#064e3b]",
          textSecondary: "text-[#065f46]/75",
        };
      case "neutral":
        return {
          background: "radial-gradient(circle at 35% 35%, #fef9c3 0%, #fef08a 50%, #ca8a04 100%)",
          boxShadow: "inset 6px 6px 12px rgba(255, 255, 255, 0.8), inset -8px -8px 16px rgba(161, 98, 7, 0.45), 0 12px 24px rgba(161, 98, 7, 0.12)",
          textPrimary: "text-[#713f12]",
          textSecondary: "text-[#854d0e]/75",
        };
      case "stressed":
        return {
          background: "radial-gradient(circle at 35% 35%, #ffedd5 0%, #fdba74 50%, #c2410c 100%)",
          boxShadow: "inset 6px 6px 12px rgba(255, 255, 255, 0.8), inset -8px -8px 16px rgba(194, 65, 12, 0.45), 0 12px 24px rgba(194, 65, 12, 0.15)",
          textPrimary: "text-[#7c2d12]",
          textSecondary: "text-[#9a3412]/75",
        };
      case "critical":
      default:
        return {
          background: "radial-gradient(circle at 35% 35%, #fee2e2 0%, #fecaca 50%, #b91c1c 100%)",
          boxShadow: "inset 6px 6px 12px rgba(255, 255, 255, 0.8), inset -8px -8px 16px rgba(185, 28, 28, 0.45), 0 12px 24px rgba(185, 28, 28, 0.15)",
          textPrimary: "text-[#7f1d1d]",
          textSecondary: "text-[#991b1b]/75",
        };
    }
  };

  const style = getOrbStyle(state.mood);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Container for Orb & Progress Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        
        {/* SVG Circular Goal Ring around Orb */}
        <svg className="w-full h-full -rotate-90 absolute z-10" viewBox="0 0 100 100">
          {/* Recessed Clay Base Track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#edf2eb"
            strokeWidth="3.5"
            style={{
              filter: "drop-shadow(1px 1px 1px rgba(165, 180, 160, 0.15))"
            }}
          />
          {/* Active Progress */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={state.orbColor}
            strokeWidth="3.5"
            strokeDasharray="283"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              filter: `drop-shadow(0 2px 4px ${state.orbColor}40)`,
            }}
          />
        </svg>

        {/* Breathing 3D Clay Carbon Orb */}
        <motion.div
          className="w-48 h-48 rounded-full flex flex-col items-center justify-center relative overflow-hidden z-20 cursor-default border border-white/50"
          style={{
            background: style.background,
            boxShadow: style.boxShadow,
          }}
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
        >
          {/* Soft Matte lighting top-left reflection highlight */}
          <div className="absolute top-4 left-6 w-12 h-8 bg-white/30 rounded-full blur-sm rotate-[-15deg] pointer-events-none" />

          {/* Core Values Display */}
          <div className="text-center select-none relative z-10 px-4">
            <span className={`text-[10px] uppercase tracking-widest font-extrabold font-display ${style.textSecondary}`}>
              Emissions
            </span>
            <h2 className={`text-4xl font-extrabold tracking-tight my-0.5 font-display ${style.textPrimary}`}>
              {co2Kg.toFixed(1)}
            </h2>
            <span className={`text-[10px] font-extrabold uppercase tracking-wide ${style.textSecondary}`}>
              kg CO₂
            </span>
          </div>
        </motion.div>
      </div>

      {/* Target Progress Legend */}
      <div className="mt-4 text-center">
        <p className="text-xs text-on-surface-variant font-bold">
          Daily Target Limit: <span className="text-primary font-black">{dailyGoal.toFixed(1)} kg</span>
        </p>
        <span 
          className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full inline-block mt-2 border shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]"
          style={{
            color: state.orbColor === "#22c55e" ? "#15803d" : state.orbColor,
            borderColor: `${state.orbColor}50`,
            backgroundColor: `${state.orbColor}20`
          }}
        >
          Status: {state.mood.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
