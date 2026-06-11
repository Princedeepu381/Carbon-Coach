// src/app/insights/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedCard, CountingBadge, AnimatedProgress, StaggerContainer, AnimatedButton } from "@/components/Animated";
import { useCountUp } from "@/lib/animations/hooks";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Target,
  Globe,
  Leaf,
  Award,
  BookOpen,
  ExternalLink,
  Download,
} from "lucide-react";

export default function InsightsPage() {
  const [userId, setUserId] = useState<string>("demo-user-id");
  const [userName, setUserName] = useState<string>("Priya Sharma");
  const [weeklyGoal, setWeeklyGoal] = useState<number>(42);
  const [loading, setLoading] = useState<boolean>(true);
  const [insights, setInsights] = useState<any>(null);

  const weeklyCounter = useCountUp(insights?.weeklyTotal || 0, { duration: 2000, decimals: 1 });
  const dailyCounter = useCountUp(insights?.weeklyTotal ? insights.weeklyTotal / 7 : 0, { duration: 2000, decimals: 1 });
  const streakCounter = useCountUp(insights?.streak || 0, { duration: 1500, decimals: 0 });

  useEffect(() => {
    const savedId = localStorage.getItem("carboncoach_user_id") || "demo-user-id";
    const savedName = localStorage.getItem("carboncoach_user_name") || "Priya Sharma";
    const savedGoal = parseFloat(localStorage.getItem("carboncoach_weekly_goal") || "42");
    
    setUserId(savedId);
    setUserName(savedName);
    setWeeklyGoal(savedGoal);

    fetchInsights(savedId);
  }, []);

  useEffect(() => {
    if (insights) {
      weeklyCounter.start();
      dailyCounter.start();
      streakCounter.start();
    }
  }, [insights]);

  const fetchInsights = async (uid: string) => {
    try {
      const res = await fetch(`/api/activities?userId=${uid}`);
      const data = await res.json();
      
      if (res.ok) {
        const weeklyTotal = data.weeklyData?.reduce(
          (sum: number, day: any) =>
            sum + day.transport + day.food + day.energy + day.shopping,
          0
        ) || 0;

        const categoryTotals = {
          transport: data.weeklyData?.reduce((sum: number, day: any) => sum + day.transport, 0) || 0,
          food: data.weeklyData?.reduce((sum: number, day: any) => sum + day.food, 0) || 0,
          energy: data.weeklyData?.reduce((sum: number, day: any) => sum + day.energy, 0) || 0,
          shopping: data.weeklyData?.reduce((sum: number, day: any) => sum + day.shopping, 0) || 0,
        };

        setInsights({
          weeklyTotal,
          categoryTotals,
          aiInsight: data.insight,
          streak: data.streak || 4,
        });
      }
    } catch (e) {
      console.error("Failed to fetch insights:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const exportData = {
      user: userName,
      weeklyGoal,
      insights,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carboncoach-insights-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !insights) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xs font-bold text-on-surface-variant">Loading insights...</p>
        </motion.div>
      </div>
    );
  }

  const weeklyTotal = insights.weeklyTotal;
  const percentOfGoal = (weeklyTotal / weeklyGoal) * 100;
  const isOnTrack = percentOfGoal <= 100;

  const categoryData = Object.entries(insights.categoryTotals).map(([key, value]) => ({
    category: key,
    value: value as number,
    percentage: weeklyTotal > 0 ? ((value as number / weeklyTotal) * 100).toFixed(1) : "0",
  }));

  const sortedCategories = categoryData.sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-6 w-full text-[#1b261a]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b261a] font-display tracking-tight">
            Carbon Insights & Analytics
          </h1>
          <p className="text-xs text-on-surface-variant font-bold mt-1">
            AI-powered diagnostics and personalized recommendations
          </p>
        </div>
        <AnimatedButton
          onClick={handleExportData}
          variant="secondary"
          size="md"
          className="flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          Export Data
        </AnimatedButton>
      </motion.div>

      {/* AI Coach Insight Hero Card */}
      <AnimatedCard
        direction="scale"
        delay={0.1}
        className="clay-card-blue p-6 md:p-8 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-[#326295]/10 rounded-2xl border border-[#326295]/20 shrink-0"
          >
            <Sparkles className="w-6 h-6 text-[#326295]" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1e3a8a] mb-3 font-display">
              🤖 AI Weekly Diagnostic
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base leading-relaxed text-[#1e3a8a] font-bold mb-4"
            >
              "{insights.aiInsight}"
            </motion.p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/60 rounded-full text-[9px] font-black uppercase tracking-wider text-[#1e3a8a] border border-white/80">
                Powered by Google Gemini
              </span>
              <span className="px-3 py-1 bg-white/60 rounded-full text-[9px] font-black uppercase tracking-wider text-[#1e3a8a] border border-white/80">
                Updated Weekly
              </span>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Total */}
        <div className={`glass-panel-l2 p-6 border ${
          isOnTrack ? "border-[#edf2eb]" : "border-amber-200"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant font-display">
              This Week's Total
            </h3>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isOnTrack ? (
                <TrendingDown className="w-5 h-5 text-emerald-600" />
              ) : (
                <TrendingUp className="w-5 h-5 text-amber-600" />
              )}
            </motion.div>
          </div>
          <div className="text-4xl font-black text-[#1b261a] font-display mb-2">
            {weeklyCounter.formattedCount} kg
          </div>
          <AnimatedProgress
            value={weeklyTotal}
            max={weeklyGoal}
            height="h-2"
            emissionLevel={isOnTrack ? "thriving" : "warning"}
            showLabel={false}
          />
          <p className="text-[10px] text-on-surface-variant font-bold mt-2">
            Goal: {weeklyGoal} kg/week
          </p>
        </div>

        {/* Daily Average */}
        <div className="glass-panel-l2 p-6 border border-[#edf2eb]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant font-display">
              Daily Average
            </h3>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Target className="w-5 h-5 text-[#326295]" />
            </motion.div>
          </div>
          <div className="text-4xl font-black text-[#1b261a] font-display mb-2">
            {dailyCounter.formattedCount} kg
          </div>
          <p className="text-[10px] text-on-surface-variant font-bold">
            Target: {(weeklyGoal / 7).toFixed(1)} kg/day
          </p>
        </div>

        {/* Active Streak */}
        <div className="glass-panel-l2 p-6 border border-[#edf2eb]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant font-display">
              Active Streak
            </h3>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Award className="w-5 h-5 text-amber-600" />
            </motion.div>
          </div>
          <div className="text-4xl font-black text-[#1b261a] font-display mb-2">
            {streakCounter.formattedCount} days
          </div>
          <p className="text-[10px] text-on-surface-variant font-bold">
            Keep logging daily to maintain your streak!
          </p>
        </div>
      </StaggerContainer>

      {/* Category Breakdown */}
      <AnimatedCard direction="up" delay={0.3} className="glass-panel-l2 p-6 border border-[#edf2eb]">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#1b261a] mb-6 font-display">
          Category Breakdown
        </h3>
        <StaggerContainer className="space-y-4">
          {sortedCategories.map((cat) => {
            const categoryData = {
              transport: { icon: "🚗", color: "bg-emerald-500", from: "#10b981", to: "#34d399" },
              food: { icon: "🍽️", color: "bg-amber-500", from: "#f59e0b", to: "#fbbf24" },
              energy: { icon: "⚡", color: "bg-sky-500", from: "#0ea5e9", to: "#38bdf8" },
              shopping: { icon: "🛍️", color: "bg-pink-500", from: "#ec4899", to: "#f472b6" },
            };
            const data = categoryData[cat.category as keyof typeof categoryData];
            return (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-2xl flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[#edf2eb] shadow-sm"
                    >
                      {data.icon}
                    </motion.div>
                    <span className="text-sm font-bold text-[#1b261a] capitalize">
                      {cat.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#1b261a] font-display">
                      {cat.value.toFixed(1)} kg
                    </span>
                    <span className="text-xs text-on-surface-variant font-bold ml-2">
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${data.from}, ${data.to})`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </StaggerContainer>
      </AnimatedCard>

      {/* Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedCard direction="left" delay={0.4} className="glass-panel-l2 p-6 border border-[#edf2eb]">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-primary/10 rounded-xl border border-primary/20"
            >
              <Globe className="w-5 h-5 text-primary" />
            </motion.div>
            <h3 className="text-sm font-black text-[#1b261a] font-display">
              Global Comparison
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant">Your Weekly</span>
              <CountingBadge
                value={weeklyTotal}
                suffix=" kg"
                decimals={1}
                emissionLevel={weeklyTotal <= 35 ? "thriving" : weeklyTotal <= 50 ? "moderate" : "critical"}
                className="text-xs"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant">Global Average</span>
              <span className="text-sm font-black text-on-surface-variant font-display">
                ~50 kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant">1.5°C Target</span>
              <span className="text-sm font-black text-primary font-display">
                ~35 kg
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`mt-4 p-3 rounded-xl ${
              weeklyTotal <= 35
                ? "bg-[#e3f2e4] border border-[#366a32]/25"
                : weeklyTotal <= 50
                ? "bg-[#fef3c7] border border-[#b56c07]/25"
                : "bg-[#fee2e2] border border-[#c22e2e]/25"
            }`}
          >
            <p className={`text-xs font-bold ${
              weeklyTotal <= 35
                ? "text-[#1e4620]"
                : weeklyTotal <= 50
                ? "text-[#78350f]"
                : "text-[#7f1d1d]"
            }`}>
              {weeklyTotal <= 35
                ? "🌟 Excellent! You're meeting the 1.5°C climate target!"
                : weeklyTotal <= 50
                ? "👍 Good progress! You're below the global average."
                : "⚠️ Above average. Small changes can make a big difference!"}
            </p>
          </motion.div>
        </AnimatedCard>

        <AnimatedCard direction="right" delay={0.5} className="glass-panel-l2 p-6 border border-[#edf2eb]">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-2 bg-[#326295]/10 rounded-xl border border-[#326295]/20"
            >
              <Leaf className="w-5 h-5 text-[#326295]" />
            </motion.div>
            <h3 className="text-sm font-black text-[#1b261a] font-display">
              Carbon Offset Equivalent
            </h3>
          </div>
          <StaggerContainer className="space-y-3">
            <div className="flex items-start gap-2">
              <motion.span
                whileHover={{ scale: 1.3 }}
                className="text-xl"
              >
                🌳
              </motion.span>
              <div>
                <p className="text-xs font-bold text-[#1b261a]">
                  {Math.ceil(weeklyTotal / 0.5)} trees needed
                </p>
                <p className="text-[10px] text-on-surface-variant font-semibold">
                  to offset this week's emissions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <motion.span
                whileHover={{ scale: 1.3 }}
                className="text-xl"
              >
                🚗
              </motion.span>
              <div>
                <p className="text-xs font-bold text-[#1b261a]">
                  {(weeklyTotal / 0.21).toFixed(0)} km driving
                </p>
                <p className="text-[10px] text-on-surface-variant font-semibold">
                  equivalent in petrol car emissions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <motion.span
                whileHover={{ scale: 1.3 }}
                className="text-xl"
              >
                ✈️
              </motion.span>
              <div>
                <p className="text-xs font-bold text-[#1b261a]">
                  {(weeklyTotal / 0.255).toFixed(0)} km flight
                </p>
                <p className="text-[10px] text-on-surface-variant font-semibold">
                  equivalent in domestic air travel
                </p>
              </div>
            </div>
          </StaggerContainer>
        </AnimatedCard>
      </div>

      {/* Educational Resources */}
      <AnimatedCard direction="up" delay={0.6} className="glass-panel-l2 p-6 border border-[#edf2eb]">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-2 bg-amber-100 rounded-xl border border-amber-200"
          >
            <BookOpen className="w-5 h-5 text-amber-700" />
          </motion.div>
          <h3 className="text-sm font-black text-[#1b261a] font-display">
            Learn More About Carbon Offsetting
          </h3>
        </div>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "What is Carbon Offsetting?",
              desc: "Learn how carbon credits work and their impact on climate change",
              link: "#",
            },
            {
              title: "Verified Offset Programs",
              desc: "Explore certified carbon offset projects you can support",
              link: "#",
            },
            {
              title: "Calculate Your Full Footprint",
              desc: "Use advanced calculators to measure your complete carbon impact",
              link: "#",
            },
            {
              title: "Climate Action Resources",
              desc: "Discover practical ways to reduce your environmental impact",
              link: "#",
            },
          ].map((resource, idx) => (
            <motion.a
              key={idx}
              href={resource.link}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-white rounded-xl border border-[#edf2eb] hover:border-primary/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black text-[#1b261a] mb-1 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed">
                    {resource.desc}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
              </div>
            </motion.a>
          ))}
        </StaggerContainer>
      </AnimatedCard>
    </div>
  );
}

// Made with Bob
