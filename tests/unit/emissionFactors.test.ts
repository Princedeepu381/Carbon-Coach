// tests/unit/emissionFactors.test.ts
import { calculateEmission, CategoryType } from "../../src/lib/emissionFactors";

describe("Emission Factor Calculations", () => {
  test("car trip 12km petrol = 2.52kg CO2", () => {
    // 12 * 0.21 = 2.52
    expect(calculateEmission("transport", "car_petrol", 12)).toBeCloseTo(2.52, 2);
  });

  test("metro trip 12km = 0.492kg CO2", () => {
    // 12 * 0.041 = 0.492
    expect(calculateEmission("transport", "metro", 12)).toBeCloseTo(0.492, 3);
  });

  test("cycling 10km = 0kg CO2", () => {
    expect(calculateEmission("transport", "bicycle", 10)).toBe(0);
  });

  test("handles zero distance", () => {
    expect(calculateEmission("transport", "car_petrol", 0)).toBe(0);
  });

  test("throws error on negative values", () => {
    expect(() => calculateEmission("transport", "car_petrol", -5)).toThrow("Quantity cannot be negative");
  });

  test("returns 0 for unknown subtype", () => {
    expect(calculateEmission("transport", "unknown_sub", 10)).toBe(0);
  });

  test("throws error on unknown category", () => {
    expect(() => calculateEmission("invalid_cat" as CategoryType, "sub", 10)).toThrow("Unknown category: invalid_cat");
  });

  test("calculates food category emissions correctly", () => {
    // 2 beef meals = 6kg CO2
    expect(calculateEmission("food", "beef_meal", 2)).toBe(6.0);
    // 1 vegetarian meal = 0.45kg CO2
    expect(calculateEmission("food", "vegetarian_meal", 1)).toBe(0.45);
  });

  test("calculates energy category emissions correctly", () => {
    // AC for 5 hours = 5 * 1.23 = 6.15kg CO2
    expect(calculateEmission("energy", "ac_per_hour", 5)).toBeCloseTo(6.15, 2);
  });

  test("calculates shopping category emissions correctly", () => {
    // 1 laptop = 300kg CO2
    expect(calculateEmission("shopping", "electronics_laptop", 1)).toBe(300.0);
  });
});

