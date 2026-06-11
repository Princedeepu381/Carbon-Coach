// src/components/LogForm/NudgeCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, X, Check } from "lucide-react";

interface NudgeCardProps {
  nudgeMessage: string;
  co2Estimate: number;
  alternative: string | null;
  alternativeCo2: number | null;
  saving: number | null;
  onAccept: () => void;
  onDismiss: () => void;
}

export const NudgeCard: React.FC<NudgeCardProps> = ({
  nudgeMessage,
  co2Estimate,
  alternative,
  alternativeCo2,
  saving,
  onAccept,
  onDismiss,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="clay-card-blue p-5 relative overflow-hidden group"
    >
      {/* Animated glow effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all pointer-events-none" />
      
      {/* Close button */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/40 text-[#1e3a8a] transition-all z-10"
        aria-label="Dismiss nudge"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-[#326295]/10 rounded-xl border border-[#326295]/20 shrink-0">
          <Sparkles className="w-5 h-5 text-[#326295] animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#1e3a8a] mb-1.5 font-display">
            💡 AI Coach Suggestion
          </h4>
          <p className="text-xs leading-relaxed text-[#1e3a8a]/90 font-bold">
            {nudgeMessage}
          </p>
        </div>
      </div>

      {/* Comparison Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/60 rounded-xl p-3 border border-white/80 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]">
          <span className="text-[9px] text-[#1e3a8a]/70 font-black uppercase tracking-wider block mb-1">
            Current Choice
          </span>
          <span className="text-lg font-black text-[#1e3a8a] font-display block">
            {co2Estimate.toFixed(1)} kg
          </span>
          <span className="text-[8px] text-[#1e3a8a]/60 font-bold uppercase">
            CO₂ Emission
          </span>
        </div>

        <div className="bg-[#e3f2e4] rounded-xl p-3 border border-[#366a32]/25 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]">
          <span className="text-[9px] text-[#1e4620]/70 font-black uppercase tracking-wider block mb-1">
            Green Alternative
          </span>
          <span className="text-lg font-black text-[#1e4620] font-display block">
            {alternativeCo2?.toFixed(1)} kg
          </span>
          <span className="text-[8px] text-[#1e4620]/60 font-bold uppercase">
            CO₂ Emission
          </span>
        </div>
      </div>

      {/* Savings Highlight */}
      {saving && saving > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 mb-4 border border-emerald-200 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <span className="text-xs font-black text-emerald-800 block">
              Save {saving.toFixed(1)} kg CO₂
            </span>
            <span className="text-[9px] text-emerald-700 font-bold">
              That's {((saving / co2Estimate) * 100).toFixed(0)}% reduction!
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onDismiss}
          className="flex-1 py-2.5 px-4 text-xs font-bold clay-btn clay-btn-secondary"
        >
          Keep Original
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-2.5 px-4 text-xs font-black clay-btn clay-btn-primary flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          Switch to Green
        </button>
      </div>

      {/* Subtle educational note */}
      <p className="text-[9px] text-[#1e3a8a]/60 text-center mt-3 font-semibold">
        Powered by Google Gemini AI • Real-time carbon analysis
      </p>
    </motion.div>
  );
};

// Made with Bob
