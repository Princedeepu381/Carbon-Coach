// src/app/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Cpu, Globe, ArrowRight, ChevronDown } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { ScrollSection } from "@/components/Landing/ScrollSection";
import { CountingNumber } from "@/components/Landing/CountingNumber";
import { ParallaxBackground } from "@/components/Landing/ParallaxBackground";
import {
  AnimatedClouds,
  GrowingTree,
  FlowingRiver,
  FloatingLeaves,
  SunRays,
  Butterflies,
} from "@/components/Landing/NatureElements";
import {
  MorphingNumberToNature,
  ParticleTransition,
  WaveTransition,
} from "@/components/Landing/MorphingEffect";

export default function LandingPage() {
  const [previewType, setPreviewType] = useState<"thriving" | "critical">("thriving");
  const { ref: problemRef, inView: problemInView } = useInView({ threshold: 0.3 });
  const { ref: solutionRef, inView: solutionInView } = useInView({ threshold: 0.3 });
  const { ref: understandRef, inView: understandInView } = useInView({ threshold: 0.3 });

  return (
    <div className="min-h-screen text-[#1b261a] relative overflow-x-hidden bg-gradient-to-br from-[#e4eee1] via-[#f1f6f0] to-[#d0dfcd]">
      {/* Parallax Background */}
      <ParallaxBackground />

      {/* Top Navbar */}
      <nav className="w-full flex justify-between items-center px-6 md:px-16 py-5 sticky top-0 z-50 bg-[#e4eee1]/80 backdrop-blur-md border-b border-[#dbe7d7] shadow-[0_2px_12px_rgba(45,90,40,0.04)]">
        <div className="font-display text-xl text-primary flex items-center gap-2 prismatic-text font-extrabold tracking-tight">
          🌱 CarbonCoach
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 clay-btn clay-btn-secondary text-xs uppercase tracking-wider font-display"
          >
            Start for free
          </Link>
        </div>
      </nav>

      {/* Section 1: Hero - Journey Begins */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-16 pt-12 pb-16 relative z-10">
        <AnimatedClouds />
        <FloatingLeaves />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Call to Action */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold font-display tracking-tight text-[#1b261a] leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              🌍 Your Choices <br />
              <span className="prismatic-text">Shape the World</span>
            </motion.h1>

            <motion.p
              className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed font-semibold max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Understand, Track & Reduce Your Carbon Footprint
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-center mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 text-sm font-black clay-btn clay-btn-primary flex items-center justify-center gap-2 active:scale-95"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </Link>
              <Link
                href="#story"
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold clay-btn clay-btn-secondary active:scale-95 flex items-center justify-center gap-2"
              >
                See How It Works
                <ChevronDown className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="lg:col-span-6 w-full flex justify-center items-center"
          >
            <div className="glass-panel-l2 rounded-[32px] p-4 shadow-[8px_8px_24px_rgba(165,180,160,0.2)] bg-white border border-white/80 overflow-hidden relative group max-w-lg">
              <img
                src="/images/landing_hero_clay.png"
                alt="Claymorphic Eco World Preview"
                className="w-full h-auto rounded-2xl object-cover shadow-md transition-all duration-500 group-hover:scale-[1.02] pointer-events-none select-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-primary opacity-60" />
        </motion.div>
      </section>

      {/* Section 2: The Problem */}
      <ScrollSection
        fullHeight
        className="flex flex-col items-center justify-center px-6 md:px-16 py-20 relative z-10 bg-gradient-to-b from-transparent via-gray-100/50 to-transparent"
        id="story"
      >
        <div ref={problemRef} className="max-w-4xl mx-auto text-center relative">
          {/* Dark particles effect */}
          <ParticleTransition inView={problemInView} />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={problemInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="text-6xl mb-4 block">💨</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1b261a] font-display mb-6">
              The Average Person Emits{" "}
              <CountingNumber
                end={12}
                duration={2}
                decimals={0}
                suffix=" Tons"
                className="text-red-600"
              />{" "}
              of CO₂ Yearly
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-on-surface-variant font-bold mb-4"
          >
            But what does that really mean?
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-on-surface-variant font-semibold mb-8"
          >
            Numbers are abstract. <span className="text-primary font-black">Emotions are real.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link
              href="#solution"
              className="inline-flex items-center gap-2 px-6 py-3 clay-btn clay-btn-primary text-sm font-black"
            >
              Discover the Solution
              <ChevronDown className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <WaveTransition inView={problemInView} color="#2d5e29" />
      </ScrollSection>

      {/* Section 3: The Solution - Living World */}
      <ScrollSection
        fullHeight
        className="flex flex-col items-center justify-center px-6 md:px-16 py-20 relative z-10 bg-gradient-to-b from-[#e3f2e4]/30 to-transparent"
        id="solution"
      >
        <div ref={solutionRef} className="max-w-5xl mx-auto relative">
          <SunRays inView={solutionInView} />
          <Butterflies />

          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={solutionInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-6xl mb-4 block"
            >
              🌱
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={solutionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-extrabold text-[#1b261a] font-display mb-4"
            >
              Meet Your Living World
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={solutionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-on-surface-variant font-bold max-w-2xl mx-auto"
            >
              Your carbon footprint becomes a breathing ecosystem.
              <br />
              <span className="text-green-600">Low emissions = Thriving forest 🌲</span>
              <br />
              <span className="text-orange-600">High emissions = Withered landscape 🍂</span>
            </motion.p>
          </div>

          {/* Interactive World Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-panel-l2 bg-[#f1f6f0] rounded-[32px] p-6 md:p-8 border border-white/80 shadow-lg"
          >
            {/* Profile Selection Tabs */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setPreviewType("thriving")}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 select-none ${
                  previewType === "thriving"
                    ? "bg-[#e3f2e4] text-[#1e4620] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] border border-[#366a32]/30 scale-105"
                    : "bg-white/80 text-[#3d4f3b] border border-white/60 hover:bg-[#e3f2e4]/40"
                }`}
              >
                🌱 Low Emission
              </button>
              <button
                onClick={() => setPreviewType("critical")}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 select-none ${
                  previewType === "critical"
                    ? "bg-[#fee2e2] text-[#7f1d1d] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] border border-[#c22e2e]/30 scale-105"
                    : "bg-white/80 text-[#3d4f3b] border border-white/60 hover:bg-[#fee2e2]/40"
                }`}
              >
                ⚠️ High Emission
              </button>
            </div>

            {/* World Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 rounded-[20px] overflow-hidden border border-white/60 shadow-inner relative group h-64 md:h-80">
                <motion.img
                  key={previewType}
                  src={
                    previewType === "thriving"
                      ? "/images/thriving_forest_clay.png"
                      : "/images/critical_forest_clay.png"
                  }
                  alt={previewType === "thriving" ? "Thriving Forest" : "Critical Forest"}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div
                  className={`p-4 rounded-2xl ${
                    previewType === "thriving"
                      ? "bg-[#e3f2e4]/60 text-[#1e4620]"
                      : "bg-[#fee2e2]/60 text-[#7f1d1d]"
                  } border border-white/60`}
                >
                  <div className="text-xs uppercase tracking-widest font-black font-display mb-1.5">
                    Carbon Output
                  </div>
                  <div className="text-3xl font-black font-display flex items-baseline gap-1.5">
                    {previewType === "thriving" ? "0.8" : "8.4"}
                    <span className="text-xs font-semibold uppercase opacity-80">
                      tons CO₂e/yr
                    </span>
                  </div>
                </div>

                <div className="text-xs font-extrabold text-[#1b261a]">
                  {previewType === "thriving"
                    ? "Mindful living creates a thriving ecosystem with lush forests, clean rivers, and bright skies."
                    : "High emissions stress the ecosystem: barren landscapes, dried rivers, and polluted skies."}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </ScrollSection>

      {/* Section 4: Understand - Morphing Numbers */}
      <ScrollSection
        fullHeight
        className="flex flex-col items-center justify-center px-6 md:px-16 py-20 relative z-10"
      >
        <div ref={understandRef} className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={understandInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold text-[#1b261a] font-display mb-4"
            >
              📊 UNDERSTAND Your Impact
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={understandInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-on-surface-variant font-bold"
            >
              Real IPCC data. Emotional visualization.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MorphingNumberToNature
              number={2.5}
              unit="kg CO₂"
              natureElement="tree"
              description="1 tree lost"
            />
            <MorphingNumberToNature
              number={10}
              unit="kg CO₂"
              natureElement="sky"
              description="Sky turns gray"
            />
            <MorphingNumberToNature
              number={20}
              unit="kg CO₂"
              natureElement="river"
              description="River dries up"
            />
          </div>
        </div>
      </ScrollSection>

      {/* Section 5: Track */}
      <ScrollSection
        className="px-6 md:px-16 py-20 relative z-10 bg-gradient-to-b from-[#e0f2fe]/30 to-transparent"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-5xl mb-4 block">📈</span>
              <h2 className="text-4xl font-extrabold text-[#1b261a] font-display mb-4">
                TRACK Daily Progress
              </h2>
              <ul className="space-y-3 text-base font-bold text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>3-tap logging (Transport, Food, Energy, Shopping)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>Weekly trends & insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>Streak counter & challenges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>Historical timeline</span>
                </li>
              </ul>
              <p className="mt-6 text-lg font-black text-primary">Simple. Fast. Addictive.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="glass-panel-l2 rounded-[24px] p-6 bg-white border border-white/80 shadow-lg max-w-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-on-surface-variant">Today</span>
                    <span className="text-2xl font-black text-green-600">2.1 kg</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      initial={{ width: 0 }}
                      whileInView={{ width: "35%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className="text-xs font-bold text-on-surface-variant">
                    🔥 7-day streak • 65% below average
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </ScrollSection>

      {/* Section 6: Reduce with AI */}
      <ScrollSection
        className="px-6 md:px-16 py-20 relative z-10 bg-gradient-to-b from-[#fef3c7]/30 to-transparent"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="glass-panel-l2 rounded-[24px] p-6 bg-white border border-white/80 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b56c07] to-[#78350f] flex items-center justify-center text-white font-black">
                    AI
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#1b261a] mb-3">
                      "Take metro instead of car?"
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black text-green-600">Save 4.2 kg CO₂</span>
                      <span className="text-xs">=</span>
                      <span className="text-xs font-bold">2 trees saved 🌲🌲</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-xs font-black bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Accept
                      </button>
                      <button className="px-4 py-2 text-xs font-bold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <span className="text-5xl mb-4 block">🎯</span>
              <h2 className="text-4xl font-extrabold text-[#1b261a] font-display mb-4">
                REDUCE with AI Guidance
              </h2>
              <p className="text-base font-bold text-on-surface-variant mb-4">
                Google Gemini suggests greener alternatives BEFORE you act.
              </p>
              <p className="text-lg font-black text-primary">
                One-click switches. Instant impact.
              </p>
            </motion.div>
          </div>
        </div>
      </ScrollSection>

      {/* Section 7: Feature Cards */}
      <ScrollSection className="px-6 md:px-16 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel-l2 bg-[#e3f2e4] rounded-[24px] p-6 flex flex-col items-start gap-4 hover:-translate-y-1.5 transition-all duration-300 group border border-white/60 shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-[#366a32]/20 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),2px_2px_4px_rgba(165,180,160,0.1)]">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1e4620] font-display">
              📊 Understand Your Impact
            </h3>
            <p className="text-xs text-[#1e4620]/80 leading-relaxed font-bold">
              See your carbon footprint visualized as a living world. Real IPCC emission factors
              translate transport, food, energy & shopping into kg CO₂. Numbers become emotions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel-l2 bg-[#e0f2fe] rounded-[24px] p-6 flex flex-col items-start gap-4 hover:-translate-y-1.5 transition-all duration-300 group border border-white/60 shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-[#326295]/20 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),2px_2px_4px_rgba(165,180,160,0.1)]">
              <Globe className="w-5 h-5 text-[#326295]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1e3a8a] font-display">
              📈 Track Daily Progress
            </h3>
            <p className="text-xs text-[#1e3a8a]/80 leading-relaxed font-bold">
              Simple 3-tap logging. Weekly trends, streak counters, and historical timeline. Watch
              your digital forest thrive or struggle based on your choices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel-l2 bg-[#fef3c7] rounded-[24px] p-6 flex flex-col items-start gap-4 hover:-translate-y-1.5 transition-all duration-300 group border border-white/60 shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-[#b56c07]/20 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),2px_2px_4px_rgba(165,180,160,0.1)]">
              <Cpu className="w-5 h-5 text-[#b56c07]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#78350f] font-display">
              🎯 Reduce with AI Guidance
            </h3>
            <p className="text-xs text-[#78350f]/80 leading-relaxed font-bold">
              Google Gemini suggests greener alternatives BEFORE you log. "Take metro instead of
              car? Save 4.2kg CO₂!" One-click switches make reduction effortless.
            </p>
          </motion.div>
        </div>
      </ScrollSection>

      {/* Section 8: Final CTA */}
      <ScrollSection
        fullHeight
        className="flex flex-col items-center justify-center px-6 md:px-16 py-20 relative z-10 bg-gradient-to-b from-[#e3f2e4]/50 to-[#e4eee1]"
      >
        <SunRays inView={true} />
        <Butterflies />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center relative"
        >
          <span className="text-6xl mb-6 block">🌍</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1b261a] font-display mb-6">
            Ready to Shape Your World?
          </h2>
          <p className="text-lg text-on-surface-variant font-bold mb-8">
            Join thousands of users reducing their carbon footprint.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/signup"
              className="px-8 py-4 text-base font-black clay-btn clay-btn-primary flex items-center justify-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 text-base font-bold clay-btn clay-btn-secondary"
            >
              Log In As Demo
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass-panel-l2 bg-white/80 rounded-2xl p-6 border border-white/60"
          >
            <p className="text-sm font-bold text-on-surface-variant italic mb-2">
              "CarbonCoach made sustainability personal and fun!"
            </p>
            <p className="text-xs font-bold text-primary">- Eco-Guardian User</p>
          </motion.div>
        </motion.div>
      </ScrollSection>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-[10px] text-[#2d5e29]/70 border-t border-[#dbe7d7] bg-[#cfdfca]/40 backdrop-blur-md font-bold relative z-10">
        © 2026 CarbonCoach. Developed with passion for sustainability.
      </footer>
    </div>
  );
}

// Made with Bob
