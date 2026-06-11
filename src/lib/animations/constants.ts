// Animation duration constants (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 400,
  slow: 600,
  verySlow: 1000,
} as const;

// Animation easing functions
export const ANIMATION_EASING = {
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  linear: [0, 0, 1, 1],
} as const;

// Spring configurations for natural motion
export const SPRING_CONFIG = {
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 260, damping: 20 },
} as const;

// Micro-interaction configurations
export const MICRO_INTERACTIONS = {
  hover: {
    scale: 1.02,
    duration: 0.2,
  },
  tap: {
    scale: 0.98,
    duration: 0.1,
  },
  focus: {
    scale: 1.01,
    duration: 0.15,
  },
  card: {
    hover: {
      scale: 1.02,
      duration: 0.2,
    },
    tap: {
      scale: 0.98,
      duration: 0.1,
    },
  },
  button: {
    hover: {
      scale: 1.05,
      duration: 0.2,
    },
    tap: {
      scale: 0.95,
      duration: 0.1,
    },
  },
} as const;

// Emission level color schemes with gradient colors
export const EMISSION_COLORS = {
  thriving: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    glow: 'shadow-green-200',
    from: '#10b981',
    to: '#34d399',
  },
  moderate: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    glow: 'shadow-yellow-200',
    from: '#f59e0b',
    to: '#fbbf24',
  },
  warning: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    glow: 'shadow-orange-200',
    from: '#f97316',
    to: '#fb923c',
  },
  critical: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    glow: 'shadow-red-200',
    from: '#ef4444',
    to: '#f87171',
  },
} as const;

// Stagger delay for list animations
export const STAGGER_DELAY = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
} as const;

// Scroll reveal thresholds
export const SCROLL_THRESHOLD = {
  partial: 0.2,
  half: 0.5,
  full: 0.8,
} as const;

// Made with Bob
