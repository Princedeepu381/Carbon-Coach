// src/app/world/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const WorldScene = dynamic(() => import("@/components/LivingWorld/WorldScene").then(mod => mod.WorldScene), {
  ssr: false,
  loading: () => <div className="w-full h-[320px] md:h-[400px] bg-[#edf2eb] rounded-3xl animate-pulse flex items-center justify-center text-xs font-bold text-[#2d5e29]/60">Loading environment...</div>
});
import { AnimatedCard, CountingBadge } from "@/components/Animated";
import { useCountUp } from "@/lib/animations/hooks";
import { TreePine, Waves, CloudSun, Calendar, HelpCircle, ArrowLeftRight, ZoomIn, ZoomOut } from "lucide-react";

export default function MyWorldPage() {
  const [userId, setUserId] = useState<string>("demo-user-id");
  const [weeklyGoal, setWeeklyGoal] = useState<number>(42);
  
  // Historical data states
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Scrubber / Selection state
  const [scrubberVal, setScrubberVal] = useState<number>(6);
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);

  // Tooltip highlights
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Animated counters
  const { start: startCo2, count: co2Count, formattedCount: formattedCo2 } = useCountUp(selectedSnapshot?.totalCo2Kg || 0, { duration: 1500, decimals: 1 });
  const { start: startTree, count: treeCount, formattedCount: formattedTree } = useCountUp(selectedSnapshot?.treeCount || 0, { duration: 1500, decimals: 0 });

  useEffect(() => {
    const savedId = localStorage.getItem("carboncoach_user_id") || "demo-user-id";
    const savedGoal = parseFloat(localStorage.getItem("carboncoach_weekly_goal") || "42");
    setUserId(savedId);
    setWeeklyGoal(savedGoal);

    fetchWorldData(savedId);
  }, []);

  useEffect(() => {
    if (selectedSnapshot) {
      startCo2();
      startTree();
    }
  }, [selectedSnapshot, startCo2, startTree]);

  const fetchWorldData = async (uid: string) => {
    try {
      const res = await fetch(`/api/world?userId=${uid}`);
      const data = await res.json();
      if (res.ok && data.snapshots) {
        setSnapshots(data.snapshots);
        if (data.snapshots.length > 0) {
          setSelectedSnapshot(data.snapshots[data.snapshots.length - 1]);
          setScrubberVal(data.snapshots.length - 1);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleScrubberChange = (val: number) => {
    setScrubberVal(val);
    if (snapshots[val]) {
      setSelectedSnapshot(snapshots[val]);
    }
  };

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (loading || !selectedSnapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#1b261a]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xs text-[#3d4f3b] font-black uppercase tracking-widest">
            Rendering Living Environment...
          </p>
        </motion.div>
      </div>
    );
  }

  const dailyTotal = selectedSnapshot.totalCo2Kg;
  const isToday = scrubberVal === snapshots.length - 1;

  const tooltipContent = {
    forest: {
      title: "Lush Forest Canopy",
      desc: `Renders based on your logged transport emissions. Maintaining low transport footprints adds up to 18 pine trees! Currently showing ${selectedSnapshot.treeCount} trees.`,
      icon: TreePine,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    river: {
      title: "Crystalline Waterway",
      desc: "Driven by your energy consumption. High electricity and appliance hours will murk the waters, whereas carbon-efficiency keeps the river clear.",
      icon: Waves,
      color: "text-[#326295]",
      bgColor: "bg-blue-50",
    },
    sky: {
      title: "Atmospheric Quality",
      desc: "Reacts directly to food and shopping footprints. Low daily emissions keeps the skies clear blue, while critical states trigger heavy gray smog.",
      icon: CloudSun,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  };

  return (
    <div className="flex flex-col gap-6 w-full text-[#1b261a]">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b261a] font-display tracking-tight">
            My World Simulator
          </h1>
          <p className="text-xs text-on-surface-variant font-bold mt-1">
            Interact with your digital biosphere and travel back in time.
          </p>
        </div>

        {/* Zoom Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
            aria-label="Zoom Out"
            className="p-2 rounded-lg bg-white border border-[#edf2eb] hover:bg-[#f8faf7] transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-[#3d4f3b]" />
          </motion.button>
          <span className="text-xs font-bold text-[#3d4f3b] w-12 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
            aria-label="Zoom In"
            className="p-2 rounded-lg bg-white border border-[#edf2eb] hover:bg-[#f8faf7] transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-[#3d4f3b]" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Main Living World Simulator Scene */}
      <AnimatedCard direction="scale" delay={0.2} className="relative overflow-hidden">
        <motion.div
          animate={{ scale: zoomLevel }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="origin-center"
        >
          <WorldScene co2Kg={dailyTotal} weeklyGoalKg={weeklyGoal} />
        </motion.div>

        {/* Floating Tooltip Targets */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute top-[35%] left-[25%] z-20"
        >
          <motion.button
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTooltip(activeTooltip === "forest" ? null : "forest")}
            aria-label="Forest Information"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-[#edf2eb] shadow-md flex items-center justify-center text-emerald-600 transition-all"
          >
            <HelpCircle className="w-4.5 h-4.5 stroke-[2.5]" />
          </motion.button>
          {activeTooltip !== "forest" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="absolute top-[75%] left-[53%] z-20"
        >
          <motion.button
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTooltip(activeTooltip === "river" ? null : "river")}
            aria-label="River Information"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-[#edf2eb] shadow-md flex items-center justify-center text-sky-600 transition-all"
          >
            <HelpCircle className="w-4.5 h-4.5 stroke-[2.5]" />
          </motion.button>
          {activeTooltip !== "river" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2, delay: 0.5 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-sky-500 rounded-full"
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="absolute top-[20%] right-[30%] z-20"
        >
          <motion.button
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTooltip(activeTooltip === "sky" ? null : "sky")}
            aria-label="Sky Information"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-[#edf2eb] shadow-md flex items-center justify-center text-amber-600 transition-all"
          >
            <HelpCircle className="w-4.5 h-4.5 stroke-[2.5]" />
          </motion.button>
          {activeTooltip !== "sky" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2, delay: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"
            />
          )}
        </motion.div>

        {/* Active Tooltip Details */}
        <AnimatePresence>
          {activeTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute top-4 right-4 max-w-xs z-30 glass-panel-l2 bg-white/95 border border-[#edf2eb] p-4 rounded-2xl shadow-xl text-[#1b261a]"
            >
              <div className="flex justify-between items-start gap-2 mb-2 border-b border-[#edf2eb] pb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider font-display">
                  {React.createElement(tooltipContent[activeTooltip as keyof typeof tooltipContent].icon, {
                    className: `w-4.5 h-4.5 ${tooltipContent[activeTooltip as keyof typeof tooltipContent].color} stroke-[2.5]`,
                  })}
                  {tooltipContent[activeTooltip as keyof typeof tooltipContent].title}
                </span>
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setActiveTooltip(null)}
                  aria-label="Close details"
                  className="text-[#3d4f3b] hover:text-[#1b261a] text-xs font-black"
                >
                  ✕
                </motion.button>
              </div>
              <p className="text-[10px] text-on-surface-variant font-bold leading-relaxed">
                {tooltipContent[activeTooltip as keyof typeof tooltipContent].desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatedCard>

      {/* Scrubber Controls Area */}
      <AnimatedCard
        direction="up"
        delay={0.4}
        className="glass-panel-l2 bg-white border border-white/80 rounded-3xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-6"
      >
        {/* Selected date label */}
        <div className="flex items-center gap-4 shrink-0">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-2xl bg-[#e3f2e4] border border-[#366a32]/25 flex items-center justify-center text-primary shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]"
          >
            <Calendar className="w-6 h-6 stroke-[2]" />
          </motion.div>
          <div>
            <motion.span
              key={isToday ? "today" : "history"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[9px] text-[#3d4f3b] font-black uppercase tracking-wider block leading-none mb-1"
            >
              {isToday ? "Simulating: Today" : `Simulating: History`}
            </motion.span>
            <motion.span
              key={selectedSnapshot.snapshotDate}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-base font-black text-[#1b261a] font-display block leading-tight"
            >
              {formatDateLabel(selectedSnapshot.snapshotDate)}
            </motion.span>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-grow w-full md:max-w-2xl flex items-center gap-4">
          <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest w-12 text-right shrink-0">
            6d ago
          </span>
          
          <div className="relative flex-grow flex items-center">
            <input
              type="range"
              min="0"
              max={snapshots.length - 1}
              value={scrubberVal}
              onChange={(e) => handleScrubberChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#edf2eb] rounded-full appearance-none cursor-pointer accent-primary"
            />
            {/* Progress indicator */}
            <motion.div
              className="absolute top-0 left-0 h-1.5 bg-primary rounded-full pointer-events-none"
              style={{ width: `${(scrubberVal / (snapshots.length - 1)) * 100}%` }}
              layoutId="scrubber-progress"
            />
          </div>

          <span className="text-[9px] font-black text-primary uppercase tracking-widest w-12 shrink-0">
            Today
          </span>
        </div>

        {/* Stats summary */}
        <div className="shrink-0 flex items-center justify-around gap-6 text-center w-full mt-4 pt-4 border-t border-[#edf2eb] sm:w-auto sm:mt-0 sm:pt-0 sm:border-t-0 sm:border-l sm:pl-6">
          <div>
            <span className="text-[9px] text-[#3d4f3b] font-black uppercase tracking-wider block mb-1">
              Logged Carbon
            </span>
            <motion.span
              key={co2Count}
              initial={{ scale: 1.2, color: "#22c55e" }}
              animate={{ scale: 1, color: "#1b261a" }}
              className="text-base font-black font-display leading-none block"
            >
              {formattedCo2} kg
            </motion.span>
          </div>
          <div>
            <span className="text-[9px] text-[#3d4f3b] font-black uppercase tracking-wider block mb-1">
              Tree Count
            </span>
            <motion.span
              key={treeCount}
              initial={{ scale: 1.2, color: "#22c55e" }}
              animate={{ scale: 1, color: "#2d5e29" }}
              className="text-base font-black text-primary font-display leading-none block"
            >
              {formattedTree} 🌲
            </motion.span>
          </div>
        </div>
      </AnimatedCard>

      {/* Comparative insight banner */}
      <AnimatedCard
        direction="up"
        delay={0.5}
        className="glass-panel-l1 bg-white border border-white/95 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 180, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="w-10 h-10 rounded-full bg-[#edf2eb] flex items-center justify-center border border-white shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]"
          >
            <ArrowLeftRight className="w-5 h-5 text-primary stroke-[2.5]" />
          </motion.div>
          <div>
            <h4 className="text-xs font-black text-[#1b261a]">Environmental Comparison</h4>
            <p className="text-[10px] text-on-surface-variant font-bold leading-relaxed mt-0.5">
              Drag the timeline to see how changes in your commuting choices immediately impacts your foliage counts.
            </p>
          </div>
        </div>

        <CountingBadge
          value={weeklyGoal / 7}
          prefix="Daily limit: "
          suffix=" kg CO₂"
          decimals={1}
          emissionLevel="thriving"
          className="shrink-0"
        />
      </AnimatedCard>

    </div>
  );
}

// Made with Bob
