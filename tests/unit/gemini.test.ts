// tests/unit/gemini.test.ts
import { getAiNudge, getWeeklyInsight } from "../../src/lib/gemini";

describe("Gemini Utility Helper Functions", () => {
  test("getAiNudge returns valid fallback nudge when Gemini client is not initialized", async () => {
    const res = await getAiNudge("transport", "car_petrol", 10, "km", {});
    expect(res).toBeDefined();
    expect(res.co2_estimate).toBeCloseTo(2.1, 1);
    expect(res.alternative).toBe("metro");
    expect(res.show_nudge).toBe(true);
  });

  test("getWeeklyInsight returns fallback insight when no activities are provided", async () => {
    const res = await getWeeklyInsight([]);
    expect(res).toContain("Welcome to CarbonCoach");
  });

  test("getWeeklyInsight returns category specific fallback insight", async () => {
    const activities = [
      { id: "1", userId: "demo-user-id", category: "transport", subType: "car_petrol", quantity: 10, unit: "km", co2Kg: 2.1, loggedAt: new Date(), nudgeShown: false, nudgeAccepted: false }
    ];
    const res = await getWeeklyInsight(activities);
    expect(res).toContain("transport");
  });
});
