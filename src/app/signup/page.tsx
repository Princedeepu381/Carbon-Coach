// src/app/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, User, Lock, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    // For demo purposes, create a new user session
    const userId = `user-${Date.now()}`;
    localStorage.setItem("carboncoach_user_id", userId);
    localStorage.setItem("carboncoach_user_name", formData.name.trim());
    localStorage.setItem("carboncoach_user_email", formData.email.trim());
    localStorage.setItem("carboncoach_weekly_goal", "42");

    setTimeout(() => {
      router.push("/onboarding");
    }, 800);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Signup Card */}
      <div className="w-full max-w-md glass-panel-l2 bg-white/95 border border-[#edf2eb] rounded-4xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-[#326295]" />

        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl text-primary font-extrabold tracking-tight prismatic-text">
            🌱 CarbonCoach
          </Link>
          <h2 className="text-xl font-extrabold text-[#1b261a] mt-4 font-display">Create Your Account</h2>
          <p className="text-xs text-on-surface-variant mt-1.5 font-bold">
            Start your journey to a greener lifestyle
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name-input" className="text-[10px] uppercase tracking-widest text-[#3d4f3b] font-black block mb-2 font-display">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                id="name-input"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Priya Sharma"
                className={`w-full clay-input pl-10 pr-4 py-3 text-sm focus:ring-1 ${
                  errors.name ? "border-red-400 focus:ring-red-400" : "focus:ring-primary"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-600 mt-1 font-semibold">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email-input" className="text-[10px] uppercase tracking-widest text-[#3d4f3b] font-black block mb-2 font-display">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                id="email-input"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="priya@example.com"
                className={`w-full clay-input pl-10 pr-4 py-3 text-sm focus:ring-1 ${
                  errors.email ? "border-red-400 focus:ring-red-400" : "focus:ring-primary"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 font-semibold">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password-input" className="text-[10px] uppercase tracking-widest text-[#3d4f3b] font-black block mb-2 font-display">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                className={`w-full clay-input pl-10 pr-10 py-3 text-sm focus:ring-1 ${
                  errors.password ? "border-red-400 focus:ring-red-400" : "focus:ring-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1 font-semibold">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirm-password-input" className="text-[10px] uppercase tracking-widest text-[#3d4f3b] font-black block mb-2 font-display">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                id="confirm-password-input"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="••••••••"
                className={`w-full clay-input pl-10 pr-10 py-3 text-sm focus:ring-1 ${
                  errors.confirmPassword ? "border-red-400 focus:ring-red-400" : "focus:ring-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1 font-semibold">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 text-xs uppercase tracking-wider font-display flex items-center justify-center gap-1.5 clay-btn clay-btn-primary active:scale-95 disabled:opacity-50 mt-2"
          >
            <UserPlus className="w-4 h-4 shrink-0 stroke-[2.5]" />
            {submitting ? "Creating Account..." : "Create Account"}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#edf2eb]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="px-3 bg-white/95 text-on-surface-variant font-black font-sans">
                Or Sign Up With
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
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.012c1.49 0 2.858.543 3.92 1.438l3.1-3.1A10.15 10.15 0 0 0 13.99 2 10.2 10.2 0 0 0 3.8 12.2c0 5.63 4.56 10.2 10.19 10.2 9.07 0 10.36-7.37 9.87-12.115H12.24z"
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
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-extrabold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
