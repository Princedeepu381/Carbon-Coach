// src/components/Dashboard/WeeklyChart.tsx
"use client";

import React, { useEffect, useState, memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface WeeklyChartProps {
  data: {
    date: string;
    transport: number;
    food: number;
    energy: number;
    shopping: number;
  }[];
  dailyGoalKg: number;
}

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = memo(({ data, dailyGoalKg }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-64 bg-[#edf2eb] rounded-2xl flex items-center justify-center border border-white/80 shadow-[inset_2px_2px_4px_rgba(165,180,160,0.1)] animate-pulse">
        <span className="text-xs font-bold text-on-surface-variant">Loading Carbon Trends...</span>
      </div>
    );
  }

  // Custom tooltips inside the chart
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: TooltipPayload) => sum + entry.value, 0);
      return (
        <div className="glass-panel-l2 bg-white/95 p-4 rounded-2xl shadow-lg border border-[#edf2eb] text-[#1b261a] text-xs select-none">
          <p className="font-black mb-2 text-[#1b261a] font-display">{label}</p>
          <div className="flex flex-col gap-1.5 mb-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between gap-6 items-center">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="capitalize text-[#3d4f3b] font-bold">{entry.name}</span>
                </span>
                <span className="font-extrabold text-[#1b261a]">
                  {entry.value.toFixed(1)} kg
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#edf2eb] pt-2 flex justify-between gap-6 items-center font-semibold text-sm">
            <span className="text-[#366a32] font-black font-display">Total CO₂</span>
            <span className="text-[#1b261a] font-black">{total.toFixed(1)} kg</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 relative mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fef08a" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#fef08a" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorShopping" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbcfe8" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#fbcfe8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          
          <CartesianGrid stroke="#edf2eb" vertical={false} />
          
          <XAxis
            dataKey="date"
            stroke="#a5b4a0"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            style={{ fontWeight: "bold" }}
          />
          <YAxis
            stroke="#a5b4a0"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            style={{ fontWeight: "bold" }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(165,180,160,0.05)" }} />
          
          {/* Target Line */}
          <ReferenceLine
            y={dailyGoalKg}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: "Goal Limit",
              fill: "#dc2626",
              fontSize: 9,
              position: "top",
              fontWeight: "black",
            }}
          />

          <Area
            type="monotone"
            dataKey="transport"
            stackId="1"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorTransport)"
            name="transport"
          />
          <Area
            type="monotone"
            dataKey="food"
            stackId="1"
            stroke="#d97706"
            fillOpacity={1}
            fill="url(#colorFood)"
            name="food"
          />
          <Area
            type="monotone"
            dataKey="energy"
            stackId="1"
            stroke="#0284c7"
            fillOpacity={1}
            fill="url(#colorEnergy)"
            name="energy"
          />
          <Area
            type="monotone"
            dataKey="shopping"
            stackId="1"
            stroke="#db2777"
            fillOpacity={1}
            fill="url(#colorShopping)"
            name="shopping"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

WeeklyChart.displayName = 'WeeklyChart';
