// src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { CarbonOrb } from "@/components/LivingWorld/CarbonOrb";

const WorldScene = dynamic(() => import("@/components/LivingWorld/WorldScene").then(mod => mod.WorldScene), {
  ssr: false,
  loading: () => <div className="w-full h-[320px] md:h-[400px] bg-[#edf2eb] rounded-3xl animate-pulse flex items-center justify-center text-xs font-bold text-[#2d5e29]/60">Loading environment...</div>
});

const WeeklyChart = dynamic(() => import("@/components/Dashboard/WeeklyChart").then(mod => mod.WeeklyChart), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-[#edf2eb] rounded-3xl animate-pulse flex items-center justify-center text-xs font-bold text-[#2d5e29]/60">Loading chart...</div>
});

const MotionImage = motion(Image);
import { ActivityForm } from "@/components/LogForm/ActivityForm";
import { computeWorldState } from "@/lib/computeWorld";
import { AnimatedCard, AnimatedButton, CountingBadge, AnimatedProgress, StaggerContainer } from "@/components/Animated";
import { useCountUp, useScrollReveal } from "@/lib/animations/hooks";
import { ANIMATION_DURATION, ANIMATION_EASING } from "@/lib/animations/constants";
import {
  Flame,
  Plus,
  Trash2,
  Sparkles,
  Award,
  ChevronRight,
  X,
  PlusCircle,
} from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Auth check & details
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("Priya Sharma");
  const [weeklyGoal, setWeeklyGoal] = useState<number>(42);

  // Data states
  const [todayEmissions, setTodayEmissions] = useState<number>(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>("Analyzing your carbon trends...");
  const [streakCount, setStreakCount] = useState<number>(4);

  // Modal open trigger
  const [isLogOpen, setIsLogOpen] = useState<boolean>(false);

  // Animation triggers
  const { ref: statsRef, inView: statsInView } = useScrollReveal();
  const { start: startEmissions, formattedCount: emissionsFormattedCount } = useCountUp(todayEmissions, { duration: 2000, decimals: 1 });
  const { start: startStreak, formattedCount: streakFormattedCount } = useCountUp(streakCount, { duration: 1500, decimals: 0 });

  // Load session & fetch initial data
  useEffect(() => {
    const savedId = localStorage.getItem("carboncoach_user_id") || "demo-user-id";
    const savedName = localStorage.getItem("carboncoach_user_name") || "Priya Sharma";
    const savedGoal = parseFloat(localStorage.getItem("carboncoach_weekly_goal") || "42");
    
    setUserId(savedId);
    setUserName(savedName);
    setWeeklyGoal(savedGoal);

    // Sync modal query parameter
    if (searchParams.get("openLog") === "true") {
      setIsLogOpen(true);
    }

    fetchDashboardData(savedId, savedGoal);
  }, [searchParams]);

  useEffect(() => {
    if (statsInView) {
      startEmissions();
      startStreak();
    }
  }, [statsInView, startEmissions, startStreak]);

  const fetchDashboardData = async (uid: string, goal: number) => {
    try {
      // Fetch activities & compile statistics
      const actRes = await fetch(`/api/activities?userId=${uid}`);
      const actData = await actRes.json();
      
      if (actRes.ok) {
        setActivities(actData.activities || []);
        setTodayEmissions(actData.todayTotal || 0);
        setWeeklyData(actData.weeklyData || []);
        setInsight(actData.insight || "You're doing great! Replacing short car trips with the metro will keep your forest thriving.");
        setStreakCount(actData.streak || 4);
      }
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    }
  };

  const handleCloseModal = () => {
    setIsLogOpen(false);
    router.replace("/dashboard");
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity log?")) return;

    try {
      const res = await fetch(`/api/activities?id=${id}&userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDashboardData(userId, weeklyGoal);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogSuccess = () => {
    handleCloseModal();
    fetchDashboardData(userId, weeklyGoal);
  };

  // Quick categories definitions
  const quickCategories = [
    { category: "transport", label: "+ Log Commute", color: "hover:border-emerald-500/50 hover:text-emerald-700", icon: "🚗" },
    { category: "food", label: "+ Log Food", color: "hover:border-yellow-500/50 hover:text-yellow-700", icon: "🍽" },
    { category: "energy", label: "+ Log Energy", color: "hover:border-sky-500/50 hover:text-sky-700", icon: "⚡" },
    { category: "shopping", label: "+ Log Purchases", color: "hover:border-pink-500/50 hover:text-pink-700", icon: "🛍" },
  ];

  // Derive active mood and map to claymorphism style profiles
  const state = computeWorldState(todayEmissions, weeklyGoal);

  const getCardStyle = (mood: string) => {
    switch (mood) {
      case "thriving":
        return {
          card: "bg-white border-[#edf2eb] shadow-[8px_8px_16px_rgba(165,180,160,0.15),-8px_-8px_16px_rgba(255,255,255,0.95),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-4px_-4px_8px_rgba(165,180,160,0.08)]",
          text: "text-[#1b261a]",
          textMuted: "text-[#3d4f3b]/70",
          border: "border-[#edf2eb]",
          badge: "bg-[#e3f2e4] text-[#1e4620] border-white/60",
          aiCard: "clay-card-green",
          aiText: "text-[#1e4620]",
          aiTextMuted: "text-[#1e4620]/90",
          aiIconBg: "bg-[#366a32]/10",
          aiIconBorder: "border-[#366a32]/20",
          aiIconColor: "text-[#366a32]",
          emissionLevel: "thriving" as const,
        };
      case "neutral":
        return {
          card: "bg-white border-[#edf2eb] shadow-[8px_8px_16px_rgba(165,180,160,0.15),-8px_-8px_16px_rgba(255,255,255,0.95),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-4px_-4px_8px_rgba(165,180,160,0.08)]",
          text: "text-[#1b261a]",
          textMuted: "text-[#3d4f3b]/70",
          border: "border-[#edf2eb]",
          badge: "bg-[#edf2eb] text-[#3d4f3b] border-white/60",
          aiCard: "clay-card-blue",
          aiText: "text-[#1e3a8a]",
          aiTextMuted: "text-[#1e3a8a]/90",
          aiIconBg: "bg-[#326295]/10",
          aiIconBorder: "border-[#326295]/20",
          aiIconColor: "text-[#326295]",
          emissionLevel: "moderate" as const,
        };
      case "stressed":
        return {
          card: "bg-[#fef3c7] border-[#d97706]/35 shadow-[8px_8px_16px_rgba(165,180,160,0.12),-8px_-8px_16px_rgba(255,255,255,0.9),inset_4px_4px_8px_rgba(255,255,255,0.85),inset_-4px_-4px_8px_rgba(180,83,9,0.15)]",
          text: "text-[#78350f]",
          textMuted: "text-[#78350f]/75",
          border: "border-[#d97706]/25",
          badge: "bg-[#fef3c7] text-[#78350f] border-amber-300",
          aiCard: "clay-card-amber",
          aiText: "text-[#78350f]",
          aiTextMuted: "text-[#78350f]/90",
          aiIconBg: "bg-[#b56c07]/10",
          aiIconBorder: "border-[#b56c07]/20",
          aiIconColor: "text-[#b56c07]",
          emissionLevel: "warning" as const,
        };
      case "critical":
      default:
        return {
          card: "bg-[#fee2e2] border-[#c22e2e]/35 shadow-[8px_8px_16px_rgba(165,180,160,0.12),-8px_-8px_16px_rgba(255,255,255,0.9),inset_4px_4px_8px_rgba(255,255,255,0.85),inset_-4px_-4px_8px_rgba(185,28,28,0.15)]",
          text: "text-[#7f1d1d]",
          textMuted: "text-[#991b1b]/75",
          border: "border-[#c22e2e]/25",
          badge: "bg-[#fee2e2] text-[#7f1d1d] border-red-300",
          aiCard: "clay-card-red",
          aiText: "text-[#7f1d1d]",
          aiTextMuted: "text-[#7f1d1d]/90",
          aiIconBg: "bg-[#c22e2e]/10",
          aiIconBorder: "border-[#c22e2e]/20",
          aiIconColor: "text-[#c22e2e]",
          emissionLevel: "critical" as const,
        };
    }
  };

  const cardStyle = getCardStyle(state.mood);

  return (
    <div className="flex flex-col gap-6 w-full text-[#1b261a]">
      
      {/* Standalone Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-2"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-[#2d5e29]/60 font-display">
          Your Living World
        </span>
      </motion.div>

      {/* Improved Living World Status Card */}
      <AnimatedCard direction="scale" delay={0.1} className="w-full relative rounded-[32px] overflow-hidden border-2 border-white/90 shadow-xl">
        {/* Banner Background Image */}
        <MotionImage
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={
            state.mood === "thriving" || state.mood === "neutral"
              ? "/images/thriving_forest_clay.png"
              : "/images/critical_forest_clay.png"
          }
          alt="Living World Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-6 md:p-8">
          {/* Top Section: World Status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full border border-white/70 shadow-lg mb-3">
              <span className="text-2xl">
                {state.mood === "thriving" ? "🌳" : state.mood === "neutral" ? "🌿" : state.mood === "stressed" ? "🍂" : "🥀"}
              </span>
              <span className={`text-sm font-black font-display ${
                state.mood === "thriving" ? "text-emerald-700" :
                state.mood === "neutral" ? "text-blue-700" :
                state.mood === "stressed" ? "text-amber-700" : "text-red-700"
              }`}>
                {state.mood === "thriving" ? "Thriving Ecosystem" :
                 state.mood === "neutral" ? "Balanced State" :
                 state.mood === "stressed" ? "Needs Attention" : "Critical State"}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight leading-tight drop-shadow-lg mb-2">
              Your Living World
            </h1>
            <p className="text-sm text-white/90 font-bold drop-shadow max-w-md">
              {state.mood === "thriving"
                ? `Amazing work, ${userName}! Your sustainable choices are creating a thriving digital forest.`
                : state.mood === "neutral"
                ? `Good progress, ${userName}. Keep making eco-friendly choices to grow your forest.`
                : state.mood === "stressed"
                ? `${userName}, your world needs care. Small changes can make a big difference.`
                : `${userName}, your ecosystem is struggling. Let's turn this around together!`
              }
            </p>
          </motion.div>

          {/* Bottom Section: Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-4 border border-white/70 shadow-lg">
              <div className="text-2xl font-black text-emerald-600 font-display">{state.trees}</div>
              <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mt-1">Trees</div>
            </div>
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-4 border border-white/70 shadow-lg">
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                </motion.div>
                <div className="text-2xl font-black text-amber-600 font-display">{streakFormattedCount}</div>
              </div>
              <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mt-1">Day Streak</div>
            </div>
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-4 border border-white/70 shadow-lg">
              <div className="text-2xl font-black text-blue-600 font-display">{Math.round((1 - state.skyPollution) * 100)}%</div>
              <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mt-1">Air Quality</div>
            </div>
          </motion.div>
        </div>
      </AnimatedCard>

      {/* Main Living World Hero Landscape */}
      <AnimatedCard direction="up" delay={0.2} className="w-full">
        <WorldScene co2Kg={todayEmissions} weeklyGoalKg={weeklyGoal} />
      </AnimatedCard>

      {/* Proactive AI Quick Actions */}
      <AnimatedCard direction="up" delay={0.3} className={`${cardStyle.aiCard} p-5 relative overflow-hidden border border-white/70 shadow-md`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`p-2 ${cardStyle.aiIconBg} rounded-xl border ${cardStyle.aiIconBorder} shrink-0`}
          >
            <Sparkles className={`w-5 h-5 ${cardStyle.aiIconColor}`} />
          </motion.div>
          <div className="flex-1">
            <h3 className={`text-xs font-black uppercase tracking-widest font-display ${cardStyle.aiText} mb-1.5`}>
              💡 Today's Personalized Actions
            </h3>
            <p className={`text-xs leading-relaxed font-bold ${cardStyle.aiTextMuted}`}>
              Simple changes that reduce your footprint right now:
            </p>
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/60 rounded-xl p-3 border border-white/80 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] hover:bg-white transition-all cursor-pointer"
            onClick={() => setIsLogOpen(true)}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">🚇</span>
              <span className={`text-xs font-black ${cardStyle.aiText}`}>Take Metro Today</span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-bold leading-relaxed">
              Save ~4.2 kg CO₂ vs driving. Your forest will add 2 trees! 🌲
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/60 rounded-xl p-3 border border-white/80 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] hover:bg-white transition-all cursor-pointer"
            onClick={() => setIsLogOpen(true)}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">🥗</span>
              <span className={`text-xs font-black ${cardStyle.aiText}`}>Try Plant-Based Meal</span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-bold leading-relaxed">
              Save ~2.5 kg CO₂ vs beef. Sky stays clear blue! ☀️
            </p>
          </motion.div>
        </StaggerContainer>
      </AnimatedCard>

      {/* Quick Category Action Pills */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3" staggerDelay={0.05}>
        {quickCategories.map((qc) => (
          <motion.button
            key={qc.category}
            onClick={() => setIsLogOpen(true)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`py-3.5 px-4 rounded-2xl bg-white border border-[#edf2eb] text-xs font-bold font-display text-[#3d4f3b] transition-all text-center shadow-[4px_4px_8px_rgba(165,180,160,0.1),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(165,180,160,0.06)] hover:bg-[#fbfcfb] ${qc.color}`}
          >
            <span className="text-lg mb-1 block">{qc.icon}</span>
            {qc.label}
          </motion.button>
        ))}
      </StaggerContainer>

      {/* Impact Summary Banner */}
      <div ref={statsRef}>
        <AnimatedCard
          direction="up"
          delay={0.4}
          className={`rounded-3xl p-6 border ${cardStyle.card} relative overflow-hidden`}
        >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          <div className="md:col-span-1">
            <h3 className={`text-xs font-black uppercase tracking-widest font-display ${cardStyle.text} mb-3`}>
              📊 Your Impact Today
            </h3>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={statsInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.6, type: "spring" }}
              className={`text-3xl font-black font-display ${cardStyle.text}`}
            >
              {emissionsFormattedCount}
              <span className="text-sm font-bold opacity-70 ml-1">kg CO₂</span>
            </motion.div>
            <p className={`text-[10px] font-bold mt-1 ${cardStyle.textMuted}`}>
              Daily target: {(weeklyGoal / 7).toFixed(1)} kg
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-black uppercase tracking-wider ${cardStyle.textMuted}`}>
                Progress to 1.5°C Climate Goal
              </span>
              <CountingBadge
                value={todayEmissions <= weeklyGoal / 7 ? 100 : (todayEmissions / (weeklyGoal / 7)) * 100}
                suffix="%"
                decimals={0}
                emissionLevel={cardStyle.emissionLevel}
                className="text-xs"
              />
            </div>
            
            <AnimatedProgress
              value={todayEmissions}
              max={weeklyGoal / 7}
              height="h-3"
              emissionLevel={cardStyle.emissionLevel}
            />

            <div className="grid grid-cols-3 gap-3 mt-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className={`text-lg font-black font-display ${cardStyle.text}`}>
                  {streakFormattedCount}
                </div>
                <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Days Active</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className={`text-lg font-black font-display ${cardStyle.text}`}>{activities.length}</div>
                <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Logs Today</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className={`text-lg font-black font-display text-emerald-600`}>
                  {Math.max(0, ((weeklyGoal / 7) - todayEmissions)).toFixed(1)}
                </div>
                <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">kg Saved</div>
              </motion.div>
            </div>
          </div>
        </div>
        </AnimatedCard>
      </div>

      {/* Multi-Column Layout for Orb, Charts, and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Carbon Orb & Weekly Chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Today's Carbon Orb */}
            <AnimatedCard
              direction="scale"
              delay={0.5}
              className={`md:col-span-5 rounded-3xl p-6 flex items-center justify-center relative overflow-hidden group border ${cardStyle.card}`}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-all" />
              <CarbonOrb co2Kg={todayEmissions} weeklyGoalKg={weeklyGoal} />
            </AnimatedCard>

            {/* Weekly Trend Chart */}
            <AnimatedCard
              direction="left"
              delay={0.6}
              className={`md:col-span-7 rounded-3xl p-6 relative overflow-hidden border ${cardStyle.card}`}
            >
              <div className={`pb-3 mb-4 flex justify-between items-center border-b ${cardStyle.border}`}>
                <h2 className={`text-xs font-black uppercase tracking-widest font-display ${cardStyle.text}`}>
                  Weekly Carbon Trend
                </h2>
              </div>
              <WeeklyChart data={weeklyData} dailyGoalKg={weeklyGoal / 7} />
            </AnimatedCard>

          </div>

          {/* Today's logged activities */}
          <AnimatedCard
            direction="up"
            delay={0.7}
            className={`rounded-3xl p-6 border ${cardStyle.card}`}
          >
            <div className={`pb-3 mb-4 flex justify-between items-center border-b ${cardStyle.border}`}>
              <h2 className={`text-xs font-black uppercase tracking-widest font-display ${cardStyle.text}`}>
                Today's Activity Logs
              </h2>
              <span className={`text-[9px] border px-3 py-1 rounded-full font-black ${cardStyle.badge}`}>
                {activities.length} entries
              </span>
            </div>

            {activities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 flex flex-col items-center justify-center gap-2"
              >
                <PlusCircle className="w-8 h-8 text-on-surface-variant opacity-60" />
                <p className={`text-xs font-bold ${cardStyle.textMuted}`}>
                  No activities logged today yet.
                </p>
                <AnimatedButton
                  onClick={() => setIsLogOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="mt-1"
                >
                  Log your first activity
                </AnimatedButton>
              </motion.div>
            ) : (
              <StaggerContainer className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                {activities.map((act) => (
                  <motion.div
                    key={act.id}
                    whileHover={{ x: 4 }}
                    className={`flex justify-between items-center p-3.5 rounded-2xl border bg-white/70 hover:bg-white transition-all duration-200 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_2px_4px_rgba(165,180,160,0.04)] group ${cardStyle.border}`}
                  >
                    <div className="flex items-center gap-3">
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="text-xl"
                      >
                        {act.category === "transport" ? "🚗" : act.category === "food" ? "🍽" : act.category === "energy" ? "⚡" : "🛍"}
                      </motion.span>
                      <div>
                        <h4 className={`text-xs font-black capitalize ${cardStyle.text}`}>
                          {act.subType.replace("_", " ")}
                        </h4>
                        <span className={`text-[9px] uppercase tracking-wider font-extrabold block mt-0.5 ${cardStyle.textMuted}`}>
                          {act.quantity} {act.unit} {act.nudgeAccepted && "• ✦ AI Green Alternative"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-black ${cardStyle.text}`}>
                        {act.co2Kg.toFixed(1)} kg
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteActivity(act.id)}
                        aria-label="Delete activity"
                        className="p-1.5 text-on-surface-variant hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </StaggerContainer>
            )}
          </AnimatedCard>

        </div>

        {/* Right: AI Coach Insights & Challenges */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Coach Insight Card */}
          <AnimatedCard
            direction="right"
            delay={0.8}
            className={`${cardStyle.aiCard} p-6 relative overflow-hidden group border border-white/70 shadow-md`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all" />
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className={`p-2 ${cardStyle.aiIconBg} rounded-xl border ${cardStyle.aiIconBorder} ${cardStyle.aiIconColor}`}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <div>
                <h3 className={`text-xs font-black uppercase tracking-widest font-display ${cardStyle.aiText}`}>
                  AI Coach Insight
                </h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className={`text-xs leading-relaxed mt-2.5 font-bold ${cardStyle.aiTextMuted}`}
                >
                  "{insight}"
                </motion.p>
                <motion.div
                  whileHover={{ x: 4 }}
                  onClick={() => router.push("/insights")}
                  className={`flex items-center gap-1.5 mt-4 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:underline font-display ${cardStyle.aiText}`}
                >
                  <span>Ask Coach details</span>
                  <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                </motion.div>
              </div>
            </div>
          </AnimatedCard>

          {/* Weekly Challenges Card */}
          <AnimatedCard
            direction="right"
            delay={0.9}
            className={`rounded-3xl p-6 border ${cardStyle.card}`}
          >
            <h3 className={`text-xs font-black uppercase tracking-widest font-display pb-3 mb-4 flex items-center gap-2 border-b ${cardStyle.border} ${cardStyle.text}`}>
              <Award className="w-4.5 h-4.5 text-amber-600" />
              Active Challenges
            </h3>
            
            <StaggerContainer className="flex flex-col gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-2xl border bg-white/70 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_2px_6px_rgba(165,180,160,0.03)] flex flex-col gap-2 ${cardStyle.border}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold ${cardStyle.text}`}>Meatless Monday</span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#e3f2e4] text-[#1e4620] border border-white/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] px-2 py-0.5 rounded-full font-display">
                    Active
                  </span>
                </div>
                <p className={`text-[10px] leading-relaxed font-bold ${cardStyle.textMuted}`}>
                  Log at least 3 vegan or vegetarian meals today. Saves ~3.5kg CO₂ compared to meat.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-2xl border bg-white/70 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_2px_6px_rgba(165,180,160,0.03)] flex flex-col gap-2 ${cardStyle.border}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold ${cardStyle.text}`}>Transit Champion</span>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[9px] font-black uppercase tracking-wider bg-white text-[#3d4f3b] border border-[#edf2eb] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] px-2 py-0.5 rounded-full font-display cursor-pointer"
                  >
                    Join
                  </motion.span>
                </div>
                <p className={`text-[10px] leading-relaxed font-bold ${cardStyle.textMuted}`}>
                  Log at least 15km of metro or bus transport this week.
                </p>
              </motion.div>
            </StaggerContainer>
          </AnimatedCard>

          {/* Community milestone */}
          <AnimatedCard
            direction="scale"
            delay={1}
            className="glass-panel-l1 rounded-3xl p-6 border border-white bg-white/95 shadow-md"
          >
            <h3 className="text-[10px] font-black text-[#1b261a] uppercase tracking-widest font-display mb-3">
              Community Savings
            </h3>
            <div className="flex justify-between text-[9px] text-[#3d4f3b] font-black mb-1.5 uppercase">
              <span>This Week's Goal</span>
              <span className="text-primary font-black">85% Completed</span>
            </div>
            <AnimatedProgress
              value={85}
              max={100}
              height="h-2.5"
              emissionLevel="thriving"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-[9px] text-on-surface-variant leading-relaxed mt-2.5 font-bold"
            >
              🌱 CarbonCoach users saved 1,020 kg CO₂ this week — equivalent to planting 42 new forest trees!
            </motion.p>
          </AnimatedCard>

        </div>

      </div>

      {/* Activity Logger Modal */}
      <AnimatePresence>
        {isLogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              className="absolute inset-0"
              onClick={handleCloseModal}
            />
            
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full sm:max-w-lg glass-panel-l2 bg-white border border-[#edf2eb] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative z-10 overflow-hidden flex flex-col gap-4"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-[#326295]" />

              <div className="flex justify-between items-center border-b border-[#edf2eb] pb-3">
                <h2 className="text-md font-black text-[#1b261a] font-display flex items-center gap-1.5">
                  ✦ Log Activity
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                  className="p-1.5 rounded-full hover:bg-[#edf2eb] text-[#3d4f3b] hover:text-[#1b261a] transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <ActivityForm userId={userId} onSuccess={handleLogSuccess} onCancel={handleCloseModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-[#1b261a]">
        <div className="text-center flex flex-col items-center gap-3">
          <motion.div
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xs font-bold">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </React.Suspense>
  );
}

// Made with Bob
