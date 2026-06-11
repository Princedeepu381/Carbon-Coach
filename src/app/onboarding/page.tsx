// src/app/onboarding/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Target, Leaf, Globe } from "lucide-react";
import confetti from "canvas-confetti";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    weeklyGoal: 42,
    transportMode: "car_petrol",
    dietType: "vegetarian_meal",
    energySource: "electricity_kwh",
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem("carboncoach_weekly_goal", formData.weeklyGoal.toString());
    localStorage.setItem("carboncoach_onboarding_complete", "true");

    // Celebration confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#10b981", "#7dd3fc", "#fbbf24"],
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const steps = [
    {
      id: 1,
      title: "Set Your Weekly Goal",
      subtitle: "Choose a realistic carbon budget to start your journey",
      icon: Target,
    },
    {
      id: 2,
      title: "Tell Us About Your Lifestyle",
      subtitle: "Help us personalize your experience",
      icon: Leaf,
    },
    {
      id: 3,
      title: "Preview Your Living World",
      subtitle: "See how your choices will shape your digital ecosystem",
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between items-center mb-3">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  step >= s.id
                    ? "bg-primary text-white shadow-lg scale-110"
                    : "bg-white border-2 border-[#edf2eb] text-on-surface-variant"
                }`}
              >
                {step > s.id ? <Check className="w-5 h-5" /> : s.id}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                    step > s.id ? "bg-primary" : "bg-[#edf2eb]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-xs text-on-surface-variant font-bold">
            Step {step} of {steps.length}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl glass-panel-l2 bg-white/95 border border-[#edf2eb] rounded-4xl p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-[#326295]" />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b261a] font-display mb-2">
                  {steps[0].title}
                </h2>
                <p className="text-sm text-on-surface-variant font-bold">
                  {steps[0].subtitle}
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-6">
                  <label className="text-sm font-black text-[#1b261a] block mb-4 font-display">
                    Weekly Carbon Budget (kg CO₂)
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={formData.weeklyGoal}
                    onChange={(e) =>
                      setFormData({ ...formData, weeklyGoal: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-[#edf2eb] rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-on-surface-variant font-bold mt-2">
                    <span>20 kg</span>
                    <span className="text-primary font-black text-2xl font-display">
                      {formData.weeklyGoal} kg
                    </span>
                    <span>100 kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="clay-card-green p-4 text-center">
                    <div className="text-2xl font-black text-[#1e4620] font-display mb-1">
                      {(formData.weeklyGoal / 7).toFixed(1)}
                    </div>
                    <div className="text-[10px] text-[#1e4620]/70 font-bold uppercase tracking-wider">
                      kg per day
                    </div>
                  </div>
                  <div className="clay-card-blue p-4 text-center">
                    <div className="text-2xl font-black text-[#1e3a8a] font-display mb-1">
                      {((formData.weeklyGoal / 52) * 12).toFixed(0)}
                    </div>
                    <div className="text-[10px] text-[#1e3a8a]/70 font-bold uppercase tracking-wider">
                      kg per year
                    </div>
                  </div>
                  <div className="clay-card-amber p-4 text-center">
                    <div className="text-2xl font-black text-[#78350f] font-display mb-1">
                      {formData.weeklyGoal < 42 ? "🌟" : formData.weeklyGoal < 60 ? "👍" : "⚠️"}
                    </div>
                    <div className="text-[10px] text-[#78350f]/70 font-bold uppercase tracking-wider">
                      {formData.weeklyGoal < 42
                        ? "Ambitious"
                        : formData.weeklyGoal < 60
                        ? "Balanced"
                        : "Challenging"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#e3f2e4] rounded-2xl border border-[#366a32]/25">
                  <p className="text-xs text-[#1e4620] font-bold leading-relaxed">
                    💡 <strong>Tip:</strong> The global average is ~50 kg/week. To meet the 1.5°C
                    climate target, aim for ~35 kg/week or less.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b261a] font-display mb-2">
                  {steps[1].title}
                </h2>
                <p className="text-sm text-on-surface-variant font-bold">
                  {steps[1].subtitle}
                </p>
              </div>

              <div className="flex-1 space-y-6">
                {/* Transport */}
                <div>
                  <label className="text-sm font-black text-[#1b261a] block mb-3 font-display">
                    Primary Transport Mode
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "car_petrol", label: "🚗 Car", color: "hover:border-red-400" },
                      { value: "metro", label: "🚇 Metro", color: "hover:border-green-400" },
                      { value: "bicycle", label: "🚴 Bike", color: "hover:border-emerald-400" },
                      { value: "bus", label: "🚌 Bus", color: "hover:border-blue-400" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, transportMode: option.value })}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border-2 ${
                          formData.transportMode === option.value
                            ? "bg-[#e3f2e4] border-primary text-[#1e4620] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8)]"
                            : `bg-white border-[#edf2eb] text-[#3d4f3b] ${option.color}`
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diet */}
                <div>
                  <label className="text-sm font-black text-[#1b261a] block mb-3 font-display">
                    Typical Diet
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { value: "vegan_meal", label: "🌱 Vegan" },
                      { value: "vegetarian_meal", label: "🥗 Vegetarian" },
                      { value: "chicken_meal", label: "🍗 Meat" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, dietType: option.value })}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border-2 ${
                          formData.dietType === option.value
                            ? "bg-[#e3f2e4] border-primary text-[#1e4620] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8)]"
                            : "bg-white border-[#edf2eb] text-[#3d4f3b] hover:border-primary/40"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy */}
                <div>
                  <label className="text-sm font-black text-[#1b261a] block mb-3 font-display">
                    Home Energy Source
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "electricity_kwh", label: "⚡ Grid Electricity" },
                      { value: "gas_kwh", label: "🔥 Natural Gas" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, energySource: option.value })}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border-2 ${
                          formData.energySource === option.value
                            ? "bg-[#e3f2e4] border-primary text-[#1e4620] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8)]"
                            : "bg-white border-[#edf2eb] text-[#3d4f3b] hover:border-primary/40"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b261a] font-display mb-2">
                  {steps[2].title}
                </h2>
                <p className="text-sm text-on-surface-variant font-bold">
                  {steps[2].subtitle}
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="w-full max-w-md mb-6 relative h-64 md:h-72">
                  <Image
                    src="/images/thriving_forest_clay.png"
                    alt="Living World Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="rounded-3xl border-2 border-[#edf2eb] shadow-lg object-cover"
                  />
                </div>

                <div className="space-y-4 w-full">
                  <div className="flex items-start gap-3 p-4 bg-[#e3f2e4] rounded-2xl border border-[#366a32]/25">
                    <div className="text-2xl">🌳</div>
                    <div>
                      <h4 className="text-xs font-black text-[#1e4620] mb-1">Dynamic Forest</h4>
                      <p className="text-[10px] text-[#1e4620]/80 font-bold leading-relaxed">
                        Trees grow when you make green transport choices
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[#e0f2fe] rounded-2xl border border-[#326295]/25">
                    <div className="text-2xl">🌊</div>
                    <div>
                      <h4 className="text-xs font-black text-[#1e3a8a] mb-1">Crystal River</h4>
                      <p className="text-[10px] text-[#1e3a8a]/80 font-bold leading-relaxed">
                        Water clarity reflects your energy efficiency
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[#fef3c7] rounded-2xl border border-[#b56c07]/25">
                    <div className="text-2xl">☀️</div>
                    <div>
                      <h4 className="text-xs font-black text-[#78350f] mb-1">Living Sky</h4>
                      <p className="text-[10px] text-[#78350f]/80 font-bold leading-relaxed">
                        Sky color changes based on your food and shopping impact
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#edf2eb]">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-3 text-sm font-bold clay-btn clay-btn-secondary flex items-center gap-2 ${
              step === 1 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-2">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  step === s.id ? "bg-primary w-6" : "bg-[#edf2eb]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 text-sm font-black clay-btn clay-btn-primary flex items-center gap-2"
          >
            {step === 3 ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                Complete Setup
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
