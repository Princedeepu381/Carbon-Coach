// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, UserCheck, AlertCircle } from "lucide-react";

// Demo users for authentication
const DEMO_USERS = {
  "priya@carboncoach.com": { password: "priya123", name: "Priya Sharma", id: "demo-user-id" },
  "vikram@carboncoach.com": { password: "vikram123", name: "Vikram Malhotra", id: "vikram-user-id" },
  "demo@carboncoach.com": { password: "demo123", name: "Demo User", id: "demo-user-id" },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleDemoLogin = () => {
    setSubmitting(true);
    setError("");
    // Quick demo login
    localStorage.setItem("carboncoach_user_name", "Priya Sharma");
    localStorage.setItem("carboncoach_user_id", "demo-user-id");
    localStorage.setItem("carboncoach_weekly_goal", "42");
    
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    // Check credentials
    const user = DEMO_USERS[email.toLowerCase() as keyof typeof DEMO_USERS];
    
    if (!user || user.password !== password) {
      setError("Invalid email or password");
      return;
    }

    setSubmitting(true);
    localStorage.setItem("carboncoach_user_name", user.name);
    localStorage.setItem("carboncoach_user_id", user.id);
    localStorage.setItem("carboncoach_weekly_goal", "42");
    
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel-l2 bg-white/95 border border-[#edf2eb] rounded-4xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-[#326295]" />

        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl text-primary font-extrabold tracking-tight prismatic-text">
            🌱 CarbonCoach
          </Link>
          <h2 className="text-xl font-extrabold text-[#1b261a] mt-4 font-display">Welcome Back</h2>
          <p className="text-xs text-on-surface-variant mt-1.5 font-bold">
            Watch your choices shape a living world
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email-input" className="text-[10px] uppercase tracking-widest text-[#3d4f3b] font-black block mb-2 font-display">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@carboncoach.com"
              required
              className="w-full clay-input px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password-input" className="text-[10px] uppercase tracking-widest text-[#3d4f3b] font-black block mb-2 font-display">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full clay-input px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 text-xs uppercase tracking-wider font-display flex items-center justify-center gap-1.5 clay-btn clay-btn-primary active:scale-95 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4 shrink-0 stroke-[2.5]" />
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          {/* Demo Credentials Info */}
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-[10px] font-black text-blue-900 uppercase tracking-wider mb-2">Demo Credentials:</p>
            <div className="text-[10px] text-blue-700 font-bold space-y-1">
              <p>📧 priya@carboncoach.com | 🔑 priya123</p>
              <p>📧 vikram@carboncoach.com | 🔑 vikram123</p>
              <p>📧 demo@carboncoach.com | 🔑 demo123</p>
            </div>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#edf2eb]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="px-3 bg-[#f5f8f4] text-on-surface-variant font-black">
                Or Quick Access
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={submitting}
            className="w-full py-3.5 text-xs uppercase tracking-wider font-display flex items-center justify-center gap-1.5 clay-btn clay-btn-secondary active:scale-95 disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4 shrink-0 stroke-[2.5]" />
            Log In as Priya (Demo User)
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#edf2eb]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="px-3 bg-white/95 text-on-surface-variant font-black font-sans">
                Or Log In With
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="py-2.5 text-xs font-bold clay-btn clay-btn-secondary flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.012c1.49 0 2.858.543 3.92 1.438l3.1-3.1A10.15 10.15 0 0 0 13.99 2 10.2 0 0 0 3.8 12.2c0 5.63 4.56 10.2 10.19 10.2 9.07 0 10.36-7.37 9.87-12.115H12.24z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="py-2.5 text-xs font-bold clay-btn clay-btn-secondary flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.27.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-on-surface-variant font-semibold">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-extrabold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
