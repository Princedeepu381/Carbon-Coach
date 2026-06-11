// tests/unit/computeWorld.test.ts
import { computeWorldState } from "../../src/lib/computeWorld";

describe("Living World State Machine Calculations", () => {
  const goalKg = 42; // weekly goal, meaning 6 kg daily slice

  test("thriving state (emissions <= 50% of daily goal)", () => {
    // 2 kg is <= 3 kg (50% of 6)
    const result = computeWorldState(2.0, goalKg);
    expect(result.mood).toBe("thriving");
    expect(result.trees).toBe(18);
    expect(result.skyPollution).toBe(0.05);
    expect(result.orbColor).toBe("#22c55e");
  });

  test("neutral state (emissions <= 100% of daily goal)", () => {
    // 5.5 kg is > 3.0 kg and <= 6.0 kg
    const result = computeWorldState(5.5, goalKg);
    expect(result.mood).toBe("neutral");
    expect(result.trees).toBe(10);
    expect(result.skyPollution).toBe(0.30);
    expect(result.orbColor).toBe("#fbbf24");
  });

  test("stressed state (emissions <= 150% of daily goal)", () => {
    // 8.0 kg is > 6.0 kg and <= 9.0 kg (150% of 6)
    const result = computeWorldState(8.0, goalKg);
    expect(result.mood).toBe("stressed");
    expect(result.trees).toBe(4);
    expect(result.skyPollution).toBe(0.65);
    expect(result.orbColor).toBe("#f97316");
  });

  test("critical state (emissions > 150% of daily goal)", () => {
    // 12 kg is > 9.0 kg
    const result = computeWorldState(12.0, goalKg);
    expect(result.mood).toBe("critical");
    expect(result.trees).toBe(1);
    expect(result.skyPollution).toBe(0.90);
    expect(result.orbColor).toBe("#f87171");
  });

  test("handles zero or negative goals safely", () => {
    const result = computeWorldState(10.0, 0);
    // Should fall back to safeGoal of 6 kg, making 10 kg critical
    expect(result.mood).toBe("critical");
  });
});
