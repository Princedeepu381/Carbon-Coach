// src/lib/animations/hooks.ts
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Hook for scroll-based reveal animations
 */
export function useScrollReveal(options?: {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}) {
  const { ref, inView } = useInView({
    threshold: options?.threshold ?? 0.2,
    triggerOnce: options?.triggerOnce ?? true,
  });

  return { ref, inView, delay: options?.delay ?? 0 };
}

/**
 * Hook for smooth number counting animation
 */
export function useCountUp(
  end: number,
  options?: {
    duration?: number;
    decimals?: number;
    start?: number;
    delay?: number;
  }
) {
  const [count, setCount] = useState(options?.start ?? 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = useCallback(() => {
    setIsAnimating(true);
    const duration = options?.duration ?? 2000;
    const startValue = options?.start ?? 0;
    const startTime = Date.now();

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = startValue + (end - startValue) * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
        setIsAnimating(false);
      }
    };

    if (options?.delay) {
      setTimeout(() => requestAnimationFrame(updateCount), options.delay);
    } else {
      requestAnimationFrame(updateCount);
    }
  }, [end, options?.duration, options?.start, options?.delay]);

  return {
    count,
    isAnimating,
    start: animate,
    formattedCount: count.toFixed(options?.decimals ?? 0),
  };
}

/**
 * Hook for staggered child animations
 */
export function useStagger(childCount: number, delay: number = 0.1) {
  return Array.from({ length: childCount }, (_, i) => ({
    delay: i * delay,
  }));
}

/**
 * Hook for parallax scroll effects
 */
export function useParallax(speed: number = 0.5) {
  const [mounted, setMounted] = useState(false);
  const scrollY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    const updateScrollY = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener("scroll", updateScrollY, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollY);
  }, [scrollY]);

  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);

  return { y, mounted };
}

/**
 * Hook for smooth spring animations
 */
export function useSpringValue(value: number, config?: { stiffness?: number; damping?: number }) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, {
    stiffness: config?.stiffness ?? 100,
    damping: config?.damping ?? 30,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return spring;
}

/**
 * Hook for detecting reduced motion preference
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for page transition animations
 */
export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return { isTransitioning, startTransition, endTransition };
}

/**
 * Hook for hover state with delay
 */
export function useHoverDelay(delay: number = 200) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const onMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, delay);
  }, [delay]);

  const onMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isHovered, onMouseEnter, onMouseLeave };
}

/**
 * Hook for intersection-based animations with custom callback
 */
export function useIntersectionAnimation(
  callback: (inView: boolean) => void,
  options?: {
    threshold?: number;
    triggerOnce?: boolean;
  }
) {
  const { ref, inView } = useInView({
    threshold: options?.threshold ?? 0.2,
    triggerOnce: options?.triggerOnce ?? false,
  });

  useEffect(() => {
    callback(inView);
  }, [inView, callback]);

  return ref;
}

/**
 * Hook for emission-based color transitions
 */
export function useEmissionColor(emission: number) {
  // Thresholds based on daily CO2 in kg
  const getColorScheme = (value: number) => {
    if (value < 3) return "thriving"; // Low emission
    if (value < 6) return "moderate"; // Moderate
    if (value < 10) return "warning"; // Warning
    return "critical"; // Critical
  };

  const [colorScheme, setColorScheme] = useState(getColorScheme(emission));

  useEffect(() => {
    setColorScheme(getColorScheme(emission));
  }, [emission]);

  return colorScheme;
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Made with Bob
