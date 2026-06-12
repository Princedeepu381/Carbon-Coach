// src/app/leaderboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Users, Globe, Link2, Check, Flame } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LeaderboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"global" | "friends">("global");
  const [userName, setUserName] = useState<string>("Priya Sharma");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const savedName = localStorage.getItem("carboncoach_user_name");
    if (savedName) setUserName(savedName);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://carboncoach.app/invite/priya-sharma");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Removed profile switching for security - users cannot switch to other profiles
  const handleRowClick = (name: string) => {
    // Only allow viewing own profile
    if (name.includes("You") || name.includes(userName)) {
      router.push("/dashboard");
    }
    // Clicking other users does nothing - proper authentication required
  };

  // Mock global leaderboard sorted by reduction %
  const globalUsers = [
    { rank: 1, name: `${userName} (You)`, avatar: userName.substring(0,1), reduction: 54, streak: 15, isSelf: true },
    { rank: 2, name: "Rahul Deshmukh", avatar: "R", reduction: 48, streak: 12, isSelf: false },
    { rank: 3, name: "Sneha Nair", avatar: "S", reduction: 41, streak: 9, isSelf: false },
    { rank: 4, name: "Amit Patel", avatar: "A", reduction: 35, streak: 15, isSelf: false },
    { rank: 5, name: "Meera Sen", avatar: "M", reduction: 28, streak: 7, isSelf: false },
    { rank: 6, name: "Vikram Malhotra", avatar: "V", reduction: 22, streak: 5, isSelf: false },
    { rank: 7, name: "Karan Johar", avatar: "K", reduction: 11, streak: 3, isSelf: false },
    { rank: 8, name: "Aditi Rao", avatar: "A", reduction: 5, streak: 2, isSelf: false },
  ];

  // Mock friends leaderboard
  const friendsUsers = [
    { rank: 1, name: `${userName} (You)`, avatar: userName.substring(0,1), reduction: 54, streak: 15, isSelf: true },
    { rank: 2, name: "Meera Sen", avatar: "M", reduction: 28, streak: 7, isSelf: false },
    { rank: 3, name: "Karan Johar", avatar: "K", reduction: 11, streak: 3, isSelf: false },
  ];

  const currentList = activeTab === "global" ? globalUsers : friendsUsers;

  return (
    <div className="flex flex-col gap-6 w-full text-[#1b261a]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b261a] font-display tracking-tight">
            Community Leaderboard
          </h1>
          <p className="text-xs text-on-surface-variant font-bold mt-1">
            Ranked by weekly footprint reduction % to keep comparisons fair.
          </p>
        </div>

        {/* Invite Friends FAB Button */}
        <button
          onClick={handleCopyLink}
          aria-label="Invite friends by copying link"
          className="px-5 py-2.5 text-xs font-black flex items-center gap-1.5 shrink-0 clay-btn clay-btn-secondary active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Link Copied!
            </>
          ) : (
            <>
              <Link2 className="w-3.5 h-3.5 stroke-[2.5]" />
              Invite Friends
            </>
          )}
        </button>
      </div>

      {/* Community milestone alert banner */}
      <div className="glass-panel-l1 bg-white border border-[#edf2eb] rounded-3xl p-5 flex items-center gap-4 relative overflow-hidden shadow-sm">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]">
          <Trophy className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <h3 className="text-xs font-black text-[#1b261a] uppercase tracking-wider">
            Community Weekly Milestone Achieved
          </h3>
          <p className="text-[10px] text-on-surface-variant leading-relaxed mt-1 font-bold">
            This week, CarbonCoach users collectively avoided <span className="text-primary font-black">4,200 kg CO₂</span> — equivalent to canceling <span className="text-[#1b261a] font-black">18 commercial flights ✈️</span>!
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 p-1 bg-[#edf2eb] border border-white/80 rounded-full w-fit shadow-[inset_1px_1px_3px_rgba(165,180,160,0.15)]">
        <button
          onClick={() => setActiveTab("global")}
          aria-label="Switch to global rankings view"
          className={`px-5 py-2 rounded-full text-xs font-black font-display transition-all flex items-center gap-1.5 ${
            activeTab === "global" ? "bg-white text-primary shadow-sm border border-white/80" : "text-[#3d4f3b] hover:text-primary"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          Global Rankings
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          aria-label="Switch to friends challenge view"
          className={`px-5 py-2 rounded-full text-xs font-black font-display transition-all flex items-center gap-1.5 ${
            activeTab === "friends" ? "bg-white text-primary shadow-sm border border-white/80" : "text-[#3d4f3b] hover:text-primary"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Friends Challenge
        </button>
      </div>

      {/* Leaderboard Table list */}
      <div className="glass-panel-l2 bg-white border border-[#edf2eb] rounded-3xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#edf2eb] text-[10px] uppercase tracking-widest text-[#3d4f3b] font-black">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6 text-center w-28">Weekly reduction</th>
                <th className="py-4 px-6 text-center w-28">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2eb] text-xs text-[#1b261a]">
              {currentList.map((user) => {
                // Only allow clicking on own profile for security
                const isInteractive = user.isSelf;
                return (
                  <tr
                    key={user.rank}
                    onClick={() => isInteractive && handleRowClick(user.name)}
                    role={isInteractive ? "button" : undefined}
                    tabIndex={isInteractive ? 0 : undefined}
                    aria-label={isInteractive ? `View your profile` : undefined}
                    onKeyDown={(e) => {
                      if (isInteractive && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        handleRowClick(user.name);
                      }
                    }}
                    className={`transition-colors ${
                      isInteractive ? "cursor-pointer hover:bg-[#edf2eb]/40" : "hover:bg-[#fbfcfb]"
                    } ${
                      user.isSelf ? "bg-[#e3f2e4] hover:bg-[#e3f2e4]/90 border-y border-[#366a32]/25" : ""
                    }`}
                  >
                    {/* Rank Column */}
                    <td className="py-4 px-6 text-center font-black font-display">
                      {user.rank === 1 ? (
                        <span className="text-yellow-500 text-sm">🥇</span>
                      ) : user.rank === 2 ? (
                        <span className="text-slate-400 text-sm">🥈</span>
                      ) : user.rank === 3 ? (
                        <span className="text-amber-700 text-sm">🥉</span>
                      ) : (
                        <span>#{user.rank}</span>
                      )}
                    </td>

                    {/* Profile Name */}
                    <td className="py-4 px-6 flex items-center gap-3 font-bold">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#edf2eb] flex items-center justify-center font-black text-xs shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] text-primary">
                        {user.avatar}
                      </div>
                      <span className={user.isSelf ? "text-[#1e4620] font-black" : "text-[#1b261a]"}>
                        {user.name}
                      </span>
                    </td>

                    {/* Reduction Value */}
                    <td className="py-4 px-6 text-center font-black text-primary font-display text-sm">
                      +{user.reduction}%
                    </td>

                    {/* Streak Count */}
                    <td className="py-4 px-6 text-center font-bold text-amber-600">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-500/10 stroke-amber-500" />
                        <span>{user.streak} days</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
