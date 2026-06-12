// src/lib/computeWorld.ts

/**
 * Represents the visual state of the living world based on carbon emissions
 */
export interface WorldState {
  mood: "thriving" | "neutral" | "stressed" | "critical";
  trees: number;
  skyPollution: number;
  orbColor: string;
  riverOpacity: number;
  hazeOpacity: number;
  skyColor: string;
}

/**
 * Computes the world state based on daily CO2 emissions vs weekly goal
 * @param co2Kg - Current day's CO2 emissions in kilograms
 * @param goalKg - Weekly CO2 goal in kilograms
 * @returns WorldState object with visual parameters for the living world
 */
export function computeWorldState(co2Kg: number, goalKg: number): WorldState {
  const dailyGoal = goalKg / 7;
  
  // Guard against divide by zero or negative goals
  const safeGoal = dailyGoal > 0 ? dailyGoal : 6.0;
  const ratio = co2Kg / safeGoal;

  if (ratio <= 0.5) {
    return {
      mood: "thriving",
      trees: 18,
      skyPollution: 0.05,
      orbColor: "#22c55e", // Emerald
      riverOpacity: 1.0,
      hazeOpacity: 0.0,
      skyColor: "#87CEEB", // Sky Blue
    };
  } else if (ratio <= 1.0) {
    return {
      mood: "neutral",
      trees: 10,
      skyPollution: 0.30,
      orbColor: "#fbbf24", // Warning Amber
      riverOpacity: 0.8,
      hazeOpacity: 0.2,
      skyColor: "#a8d8ea", // Lighter Blue
    };
  } else if (ratio <= 1.5) {
    return {
      mood: "stressed",
      trees: 4,
      skyPollution: 0.65,
      orbColor: "#f97316", // Stressed Orange
      riverOpacity: 0.5,
      hazeOpacity: 0.5,
      skyColor: "#78909c", // Hazy Slate Gray
    };
  } else {
    return {
      mood: "critical",
      trees: 1, // At least 1 bare tree
      skyPollution: 0.90,
      orbColor: "#f87171", // Critical Coral Red
      riverOpacity: 0.2,
      hazeOpacity: 0.8,
      skyColor: "#455a64", // Polluted Dark Gray
    };
  }
}
