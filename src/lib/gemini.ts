// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client if the API key is present
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface NudgeResult {
  co2_estimate: number;
  alternative: string | null;
  alternative_co2: number | null;
  saving: number | null;
  nudge_message: string;
  show_nudge: boolean;
}

/**
 * Gets a contextual inline AI nudge from Gemini, falling back to rule-based logic if no API key is set.
 */
export async function getAiNudge(
  category: string,
  subType: string,
  quantity: number,
  unit: string,
  weeklyPattern: any
): Promise<NudgeResult> {
  // If no API key, use fallback local generator
  if (!genAI) {
    return getMockNudge(category, subType, quantity, unit);
  }

  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-pro"];
  let lastError = null;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: `You are CarbonCoach, a warm and practical carbon footprint advisor.
                            Analyze the logged activity and recommend a greener alternative if it saves > 0.5kg CO2.
                            Maintain a non-preachy, supportive, and friendly tone.
                            If no practical greener alternative exists in this category, set show_nudge to false.`
      });

      const response = await model.generateContent({
        contents: [{
          role: "user",
          parts: [{
            text: `The user is logging: ${quantity} ${unit} of ${subType} (${category}).
                   User's weekly pattern: ${JSON.stringify(weeklyPattern)}.`
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              co2_estimate: { type: "number", description: "Estimated CO2 in kg for current activity" },
              alternative: { type: "string", description: "Greener alternative name (e.g. 'metro', 'vegan_meal') or null" },
              alternative_co2: { type: "number", description: "Estimated CO2 in kg for alternative or null" },
              saving: { type: "number", description: "CO2 saved in kg or null" },
              nudge_message: { type: "string", description: "Max 20 words, encouraging and suggesting the change" },
              show_nudge: { type: "boolean", description: "true if a viable alternative exists saving > 0.5kg CO2" }
            },
            required: ["co2_estimate", "alternative", "alternative_co2", "saving", "nudge_message", "show_nudge"]
          }
        } as any
      });

      const text = response.response.text();
      if (text) {
        return JSON.parse(text) as NudgeResult;
      }
      throw new Error("Empty response from Gemini");
    } catch (error: any) {
      lastError = error;
      const is404 = error?.status === 404 || error?.message?.includes("404") || error?.message?.includes("not found");
      if (is404) {
        continue;
      }
      break;
    }
  }

  return getMockNudge(category, subType, quantity, unit);
}

/**
 * Generates a warm weekly carbon summary and recommendation.
 */
export async function getWeeklyInsight(activities: any[]): Promise<string> {
  if (!genAI) {
    return getMockWeeklyInsight(activities);
  }

  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-pro"];
  let lastError = null;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: `You are CarbonCoach, a warm and practical carbon footprint advisor.
                            Analyze the user's activities. Give ONE specific, actionable, encouraging insight.
                            Highlight their highest impact category or day and tell them exactly how much carbon they could save with a simple adjustment.
                            Keep it under 50 words. Warm, friendly, and non-judgmental.`
      });

      const response = await model.generateContent(`Here are the user's logged activities for the past week: ${JSON.stringify(activities)}`);
      return response.response.text() || "You're doing great! Keep tracking your choices and making small steps toward a greener world.";
    } catch (error: any) {
      lastError = error;
      const is404 = error?.status === 404 || error?.message?.includes("404") || error?.message?.includes("not found");
      if (is404) {
        continue;
      }
      break;
    }
  }

  return getMockWeeklyInsight(activities);
}

// --- Fallback Mock Engines (Rule-based) ---

function getMockNudge(category: string, subType: string, quantity: number, unit: string): NudgeResult {
  // Simple calculation matching our database factors
  let currentCo2 = 0;
  let alternative: string | null = null;
  let altCo2: number | null = null;
  let nudge_message = "";
  let show_nudge = false;

  if (category === "transport") {
    if (subType === "car_petrol") {
      currentCo2 = quantity * 0.21;
      alternative = "metro";
      altCo2 = quantity * 0.041;
      show_nudge = currentCo2 - altCo2 > 0.5;
      nudge_message = `Taking the metro instead of driving saves ${(currentCo2 - altCo2).toFixed(1)} kg CO₂. Switch to metro?`;
    } else if (subType === "car_diesel") {
      currentCo2 = quantity * 0.17;
      alternative = "bus";
      altCo2 = quantity * 0.089;
      show_nudge = currentCo2 - altCo2 > 0.5;
      nudge_message = `Taking the bus instead saves ${(currentCo2 - altCo2).toFixed(1)} kg CO₂. Switch to bus?`;
    } else {
      // already green or low
      currentCo2 = quantity * 0.05;
      nudge_message = "Great choice! Electric transport is highly carbon-efficient.";
    }
  } else if (category === "food") {
    if (subType === "beef_meal") {
      currentCo2 = quantity * 3.0;
      alternative = "chicken_meal";
      altCo2 = quantity * 0.9;
      show_nudge = true;
      nudge_message = `Switching from beef to chicken saves ${(currentCo2 - altCo2).toFixed(1)} kg CO₂. Switch?`;
    } else if (subType === "chicken_meal" || subType === "dairy_meal") {
      currentCo2 = quantity * 1.0;
      alternative = "vegan_meal";
      altCo2 = quantity * 0.28;
      show_nudge = true;
      nudge_message = `Choosing a vegan meal saves ${(currentCo2 - altCo2).toFixed(1)} kg CO₂. Try a plant-powered option?`;
    }
  } else if (category === "energy") {
    if (subType === "ac_per_hour") {
      currentCo2 = quantity * 1.23;
      alternative = "fan";
      altCo2 = quantity * 0.1;
      show_nudge = true;
      nudge_message = `Using a fan instead of AC for some hours can save ${(currentCo2 - altCo2).toFixed(1)} kg CO₂.`;
    }
  }

  const saving = show_nudge ? parseFloat((currentCo2 - (altCo2 || 0)).toFixed(2)) : null;

  return {
    co2_estimate: parseFloat(currentCo2.toFixed(2)),
    alternative,
    alternative_co2: altCo2 ? parseFloat(altCo2.toFixed(2)) : null,
    saving,
    nudge_message: nudge_message || "This look like a great, low-carbon option!",
    show_nudge,
  };
}

function getMockWeeklyInsight(activities: any[]): string {
  if (!activities || activities.length === 0) {
    return "Welcome to CarbonCoach! Start logging your daily transport, meals, and energy usage to see personalized carbon insights here.";
  }

  // Calculate highest category emissions
  const totals = { transport: 0, food: 0, energy: 0, shopping: 0 };
  activities.forEach((act) => {
    const cat = act.category as keyof typeof totals;
    if (totals[cat] !== undefined) {
      totals[cat] += act.co2Kg;
    }
  });

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const highestCategory = sorted[0][0];
  const highestVal = sorted[0][1];

  if (highestVal === 0) {
    return "Great job keeping your carbon footprint clean! Log your daily activities to track your impact.";
  }

  if (highestCategory === "transport") {
    return "Your transport emissions make up the largest slice of your footprint this week. Replacing just one car journey with the metro will keep your sky blue!";
  } else if (highestCategory === "food") {
    return "Food emissions are your primary footprint source this week. Choosing vegetarian or vegan options for lunch could save you up to 5kg CO₂.";
  } else if (highestCategory === "energy") {
    return "Energy usage is driving your impact right now. Setting your air conditioning to 24°C and powering down unused appliances will help grow your forest.";
  } else {
    return "Shopping deliveries added substantial carbon to your world this week. Consolidating orders online saves significant packaging and shipping emissions.";
  }
}
