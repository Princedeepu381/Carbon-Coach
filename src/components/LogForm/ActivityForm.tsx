// src/components/LogForm/ActivityForm.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Car, Utensils, Zap, ShoppingBag, Plus, Loader2, Check } from "lucide-react";
import { NudgeCard } from "./NudgeCard";
import confetti from "canvas-confetti";

interface ActivityFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  { id: "transport", label: "Transport", icon: Car, color: "text-emerald-600", activeBg: "bg-[#e3f2e4]", activeBorder: "border-[#366a32]", activeText: "text-[#1e4620]", activeInset: "shadow-[inset_3px_3px_6px_rgba(45,90,40,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]" },
  { id: "food", label: "Food", icon: Utensils, color: "text-amber-600", activeBg: "bg-[#fef3c7]", activeBorder: "border-[#d97706]", activeText: "text-[#78350f]", activeInset: "shadow-[inset_3px_3px_6px_rgba(180,83,9,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]" },
  { id: "energy", label: "Energy", icon: Zap, color: "text-sky-600", activeBg: "bg-[#e0f2fe]", activeBorder: "border-[#3b7ebd]", activeText: "text-[#1e3a8a]", activeInset: "shadow-[inset_3px_3px_6px_rgba(30,64,175,0.2),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, color: "text-pink-600", activeBg: "bg-[#fce7f3]", activeBorder: "border-pink-400", activeText: "text-[#701a75]", activeInset: "shadow-[inset_3px_3px_6px_rgba(112,26,117,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]" },
];

const SUBTYPES = {
  transport: [
    { value: "car_petrol", label: "Petrol Car", unit: "km" },
    { value: "car_diesel", label: "Diesel Car", unit: "km" },
    { value: "car_electric", label: "Electric Car", unit: "km" },
    { value: "bus", label: "Public Bus", unit: "km" },
    { value: "metro", label: "Metro Train", unit: "km" },
    { value: "bicycle", label: "Bicycle", unit: "km" },
    { value: "walking", label: "Walking / Running", unit: "km" },
    { value: "flight_domestic", label: "Domestic Flight", unit: "km" },
    { value: "flight_long", label: "International Flight", unit: "km" },
    { value: "auto_rickshaw", label: "Auto Rickshaw", unit: "km" },
  ],
  food: [
    { value: "beef_meal", label: "Beef-based Meal", unit: "meals" },
    { value: "chicken_meal", label: "Chicken / Meat Meal", unit: "meals" },
    { value: "fish_meal", label: "Fish / Seafood Meal", unit: "meals" },
    { value: "dairy_meal", label: "Cheese / Dairy Meal", unit: "meals" },
    { value: "vegetarian_meal", label: "Vegetarian Meal", unit: "meals" },
    { value: "vegan_meal", label: "Vegan / Plant-based Meal", unit: "meals" },
    { value: "food_delivery", label: "Delivery with Packaging", unit: "orders" },
  ],
  energy: [
    { value: "electricity_kwh", label: "Grid Electricity", unit: "kWh" },
    { value: "gas_kwh", label: "Natural Gas", unit: "kWh" },
    { value: "ac_per_hour", label: "Air Conditioning", unit: "hours" },
    { value: "led_bulb_per_hour", label: "Appliance / LED hours", unit: "hours" },
  ],
  shopping: [
    { value: "clothing_item", label: "New Clothing / Fashion", unit: "items" },
    { value: "electronics_item", label: "Small Electronics", unit: "items" },
    { value: "electronics_laptop", label: "Laptop / Computer", unit: "items" },
    { value: "online_delivery", label: "Online Shopping Package", unit: "packages" },
  ],
};

export const ActivityForm: React.FC<ActivityFormProps> = ({ userId, onSuccess, onCancel }) => {
  const [category, setCategory] = useState<string>("transport");
  const [subType, setSubType] = useState<string>("car_petrol");
  const [quantity, setQuantity] = useState<string>("10");
  
  // AI Nudge States
  const [loadingNudge, setLoadingNudge] = useState<boolean>(false);
  const [nudge, setNudge] = useState<any>(null);
  const [nudgeShown, setNudgeShown] = useState<boolean>(false);
  const [nudgeAccepted, setNudgeAccepted] = useState<boolean>(false);
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Sync subType when category changes
  useEffect(() => {
    const list = SUBTYPES[category as keyof typeof SUBTYPES] || [];
    if (list.length > 0) {
      setSubType(list[0].value);
      setNudge(null);
      setNudgeShown(false);
      setNudgeAccepted(false);
    }
  }, [category]);

  const getUnit = useCallback(() => {
    const list = SUBTYPES[category as keyof typeof SUBTYPES] || [];
    const item = list.find((i) => i.value === subType);
    return item ? item.unit : "";
  }, [category, subType]);

  const fetchNudge = useCallback(async (cat: string, sub: string, qty: number) => {
    setLoadingNudge(true);
    try {
      const res = await fetch("/api/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          category: cat,
          subType: sub,
          quantity: qty,
          unit: getUnit(),
        }),
      });
      const data = await res.json();
      if (data && data.show_nudge) {
        setNudge(data);
        setNudgeShown(true);
      } else {
        setNudge(null);
      }
    } catch (e) {
      console.error("Failed to load nudge:", e);
      setNudge(null);
    } finally {
      setLoadingNudge(false);
    }
  }, [userId, getUnit]);

  // Debounced AI Nudge Trigger
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    const qtyVal = parseFloat(quantity);
    if (!subType || isNaN(qtyVal) || qtyVal <= 0) {
      setNudge(null);
      return;
    }

    debounceTimeout.current = setTimeout(() => {
      fetchNudge(category, subType, qtyVal);
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [category, subType, quantity, fetchNudge]);

  const handleAcceptNudge = () => {
    if (!nudge) return;
    setNudgeAccepted(true);
    setSubType(nudge.alternative);
    setNudge(null);
  };

  const handleDismissNudge = () => {
    setNudge(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtyVal = parseFloat(quantity);
    if (isNaN(qtyVal) || qtyVal <= 0) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          category,
          subType,
          quantity: qtyVal,
          unit: getUnit(),
          nudgeShown,
          nudgeAccepted,
        }),
      });

      if (res.ok) {
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#22c55e", "#10b981", "#7dd3fc"],
        });

        onSuccess();
      } else {
        alert("Failed to submit log entry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting log entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeSubtypes = SUBTYPES[category as keyof typeof SUBTYPES] || [];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-[#1b261a]">
      {/* Category Grid Pills */}
      <div>
        <label className="text-xs uppercase tracking-widest text-on-surface-variant font-extrabold block mb-3 font-display">
          1. Select Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                aria-label={`Select category ${cat.label}`}
                className={`py-3.5 px-4 rounded-2xl flex flex-col items-center gap-2 border transition-all duration-300 ${
                  isSelected
                    ? `${cat.activeBg} ${cat.activeBorder} ${cat.activeText} ${cat.activeInset}`
                    : "bg-white border-[#edf2eb] text-[#3d4f3b] hover:bg-[#fbfcfb] shadow-[4px_4px_8px_rgba(165,180,160,0.1),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(165,180,160,0.06)]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? cat.color : "opacity-75"}`} />
                <span className="text-xs font-bold font-display tracking-wider">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtypes dropdown/grid */}
      <div>
        <label className="text-xs uppercase tracking-widest text-on-surface-variant font-extrabold block mb-3 font-display">
          2. Activity Details
        </label>
        <div className="relative">
          <select
            value={subType}
            onChange={(e) => setSubType(e.target.value)}
            aria-label="Select activity type"
            className="w-full clay-input px-4 py-3.5 pr-10 text-sm focus:ring-1 focus:ring-primary appearance-none font-bold"
          >
            {activeSubtypes.map((sub) => (
              <option key={sub.value} value={sub.value} className="bg-white text-[#1b261a]">
                {sub.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#3d4f3b] text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Quantity input */}
      <div>
        <label className="text-xs uppercase tracking-widest text-on-surface-variant font-extrabold block mb-3 font-display">
          3. Enter Quantity
        </label>
        <div className="flex items-center gap-3 clay-input p-1.5 focus-within:border-primary transition-all">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            aria-label="Enter quantity"
            min="0.1"
            step="any"
            required
            className="flex-grow bg-transparent border-0 text-2xl font-bold text-[#1b261a] focus:ring-0 focus:outline-none py-1.5 px-3"
            placeholder="0.0"
          />
          <span className="text-xs font-black text-[#1e4620] uppercase tracking-widest px-4 py-2 bg-[#e3f2e4] rounded-xl border border-white/60 shrink-0 font-display shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7)]">
            {getUnit()}
          </span>
        </div>
      </div>

      {/* Nudge Card Area */}
      {loadingNudge && (
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-on-surface-variant font-bold">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Analyzing impact with CarbonCoach...</span>
        </div>
      )}

      {nudge && (
        <NudgeCard
          nudgeMessage={nudge.nudge_message}
          co2Estimate={nudge.co2_estimate}
          alternative={nudge.alternative}
          alternativeCo2={nudge.alternative_co2}
          saving={nudge.saving}
          onAccept={handleAcceptNudge}
          onDismiss={handleDismissNudge}
        />
      )}

      {/* Confirmation of switch */}
      {nudgeAccepted && (
        <div className="bg-[#e3f2e4] border border-[#366a32]/40 rounded-2xl p-4 flex items-center gap-3 text-sm text-[#1e4620] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7)]">
          <Check className="w-5 h-5 shrink-0" />
          <span className="font-bold">
            Success! Switched to a greener alternative. Your footprint will be significantly lower!
          </span>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel activity logging"
            className="px-6 py-3.5 text-sm font-bold clay-btn clay-btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          aria-label="Submit activity log"
          className="flex-grow sm:flex-grow-0 px-8 py-3.5 text-sm font-black clay-btn clay-btn-primary flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 stroke-[2.5]" />
              Log Activity
            </>
          )}
        </button>
      </div>
    </form>
  );
};
