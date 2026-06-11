// src/components/NavigationLayout.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home as HomeIcon,
  ClipboardList as LoggerIcon,
  Globe as WorldIcon,
  TrendingUp as InsightsIcon,
  Trophy as LeaderboardIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpIcon,
  LogOut as LogoutIcon,
  Menu as MenuIcon,
  Flame as StreakIcon,
  Plus as PlusIcon,
} from "lucide-react";

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export const NavigationLayout: React.FC<NavigationLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("Priya Sharma");
  const [streakCount, setStreakCount] = useState<number>(4);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Load user session details from client-side cookies/storage if available
  useEffect(() => {
    const savedId = localStorage.getItem("carboncoach_user_id");
    const savedName = localStorage.getItem("carboncoach_user_name");
    
    // Auto-create demo session if none exists (for demo purposes)
    if (!savedId || !savedName) {
      localStorage.setItem("carboncoach_user_id", "demo-user-id");
      localStorage.setItem("carboncoach_user_name", "Priya Sharma");
      localStorage.setItem("carboncoach_weekly_goal", "42");
      setUserName("Priya Sharma");
    } else {
      setUserName(savedName);
    }
    
    const savedGoal = localStorage.getItem("carboncoach_weekly_goal");
    if (!savedGoal) {
      localStorage.setItem("carboncoach_weekly_goal", "42");
    }

    // Fetch user details to sync streak count
    const userId = localStorage.getItem("carboncoach_user_id") || "demo-user-id";
    fetch(`/api/activities?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.streak !== undefined) {
          setStreakCount(data.streak);
        }
      })
      .catch((err) => console.error("Streak sync error:", err));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("carboncoach_user_id");
    localStorage.removeItem("carboncoach_user_name");
    localStorage.removeItem("carboncoach_weekly_goal");
    window.location.href = "/";
  };

  // Don't show navigation on landing, login, signup, or onboarding screens
  const isAuthOrOnboarding =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/onboarding";

  if (isAuthOrOnboarding) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/dashboard", label: "Home", icon: HomeIcon },
    { href: "/world", label: "World", icon: WorldIcon },
    { href: "/insights", label: "Insights", icon: InsightsIcon },
    { href: "/leaderboard", label: "Leaderboard", icon: LeaderboardIcon },
  ];

  return (
    <div className="min-h-screen relative flex">
      {/* SideNavBar (Desktop Only) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col p-4 z-[60] bg-white/95 border-r border-[#edf2eb] shadow-[6px_0_24px_rgba(165,180,160,0.1)] transition-all duration-300">
        <div className="mb-12 mt-6 px-4">
          <div className="text-xl font-extrabold tracking-tight text-primary flex items-center gap-2 prismatic-text font-display">
            <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8)]">
              🌱
            </span>
            CarbonCoach
          </div>
          <div className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-widest mt-1.5 font-display">
            Premium Tracking
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? "active-orb"
                    : "text-on-surface-variant hover:bg-[#edf2eb]/40 hover:text-primary border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "opacity-70"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {/* Quick logger action button inside sidebar */}
          <Link
            href="/dashboard?openLog=true"
            className="w-full py-3.5 rounded-xl bg-primary text-white font-extrabold text-center transition-all duration-300 clay-btn clay-btn-primary active:scale-95 text-xs uppercase tracking-wider font-display"
          >
            Log Activity
          </Link>
          <div className="border-t border-[#edf2eb] pt-3 flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-primary opacity-80 hover:opacity-100 transition-all"
            >
              <HelpIcon className="w-4 h-4" />
              <span>Help Center</span>
            </Link>
            <Link
              href="/"
              onClick={() => {
                localStorage.removeItem("carboncoach_user_name");
              }}
              className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:text-red-500 opacity-80 hover:opacity-100 transition-all"
            >
              <LogoutIcon className="w-4 h-4" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* TopAppBar (Web & Mobile Header) */}
        <header className="flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 bg-[#f5f8f4]/80 backdrop-blur-md border-b border-[#edf2eb] mb-4">
          <div className="flex items-center gap-2">
            <div className="md:hidden font-display text-lg text-primary flex items-center gap-2 prismatic-text font-extrabold tracking-tight">
              🌱 CarbonCoach
            </div>
            
            {/* Display active streak count badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 border border-amber-200 rounded-full text-xs font-bold text-amber-700 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8)]">
              <StreakIcon className="w-3.5 h-3.5 fill-amber-500 stroke-amber-600" />
              <span>{streakCount} Day Streak</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-full glass-panel-l1 hover:bg-[#edf2eb] transition-all active:scale-95 duration-200 text-on-surface relative"
              >
                <BellIcon className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 z-50 glass-panel-l2 bg-white border border-[#edf2eb] rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
                    <h3 className="text-sm font-black text-[#1b261a] mb-3 font-display">Notifications</h3>
                    <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🎉</span>
                          <div>
                            <p className="text-xs font-bold text-emerald-900">4-day streak achieved!</p>
                            <p className="text-[10px] text-emerald-700 mt-0.5">Keep logging daily to maintain your streak</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">💡</span>
                          <div>
                            <p className="text-xs font-bold text-blue-900">New AI insight available</p>
                            <p className="text-[10px] text-blue-700 mt-0.5">Check your personalized carbon reduction tips</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🏆</span>
                          <div>
                            <p className="text-xs font-bold text-amber-900">Challenge reminder</p>
                            <p className="text-[10px] text-amber-700 mt-0.5">Meatless Monday challenge ends in 6 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Settings button */}
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-2.5 rounded-full glass-panel-l1 hover:bg-[#edf2eb] transition-all active:scale-95 duration-200 text-on-surface"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
              
              {settingsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setSettingsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-72 z-50 glass-panel-l2 bg-white border border-[#edf2eb] rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
                    <h3 className="text-sm font-black text-[#1b261a] mb-3 font-display">Settings</h3>
                    <div className="flex flex-col gap-2">
                      <button className="flex items-center justify-between p-3 rounded-xl hover:bg-[#edf2eb] transition-all text-left">
                        <span className="text-xs font-bold text-[#3d4f3b]">Weekly Goal</span>
                        <span className="text-xs text-primary font-black">42 kg CO₂</span>
                      </button>
                      <button className="flex items-center justify-between p-3 rounded-xl hover:bg-[#edf2eb] transition-all text-left">
                        <span className="text-xs font-bold text-[#3d4f3b]">Notifications</span>
                        <span className="text-xs text-emerald-600 font-black">Enabled</span>
                      </button>
                      <button className="flex items-center justify-between p-3 rounded-xl hover:bg-[#edf2eb] transition-all text-left">
                        <span className="text-xs font-bold text-[#3d4f3b]">Theme</span>
                        <span className="text-xs text-[#3d4f3b] font-black">Light</span>
                      </button>
                      <button className="flex items-center justify-between p-3 rounded-xl hover:bg-[#edf2eb] transition-all text-left">
                        <span className="text-xs font-bold text-[#3d4f3b]">Language</span>
                        <span className="text-xs text-[#3d4f3b] font-black">English</span>
                      </button>
                      <div className="border-t border-[#edf2eb] my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 p-3 rounded-xl hover:bg-red-50 transition-all text-left text-red-600"
                      >
                        <LogoutIcon className="w-4 h-4" />
                        <span className="text-xs font-bold">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* User Avatar - No Profile Switching */}
            <div className="flex items-center gap-2.5 pl-2 py-0.5 pr-2.5 glass-panel-l1 border border-white/80 bg-white/90">
              <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden border border-primary/30 flex items-center justify-center text-sm font-bold text-primary shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]">
                {userName.substring(0, 1)}
              </div>
              <span className="text-xs font-bold text-[#1b261a] hidden sm:inline">
                {userName}
              </span>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 pb-28 md:pb-8">
          {children}
        </main>
      </div>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 glass-panel-l2 rounded-2xl shadow-2xl flex justify-around items-center py-2.5 px-2 border border-white/90">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            pathname === "/dashboard"
              ? "active-orb"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <HomeIcon className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-display">Home</span>
        </Link>
        <Link
          href="/world"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            pathname === "/world"
              ? "active-orb"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <WorldIcon className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-display">World</span>
        </Link>

        {/* Floating Quick Log FAB (Mobile) */}
        <Link
          href="/dashboard?openLog=true"
          className="flex items-center justify-center w-14 h-14 -mt-8 rounded-full bg-primary text-white hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 clay-btn clay-btn-primary"
        >
          <PlusIcon className="w-6 h-6 stroke-[3] text-white" />
        </Link>

        <Link
          href="/insights"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            pathname === "/insights"
              ? "active-orb"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <InsightsIcon className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-display">Insights</span>
        </Link>
        <Link
          href="/leaderboard"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            pathname === "/leaderboard"
              ? "active-orb"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <LeaderboardIcon className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-display">Board</span>
        </Link>
      </nav>
    </div>
  );
};
