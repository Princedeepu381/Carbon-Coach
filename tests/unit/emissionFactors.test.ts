// tests/unit/emissionFactors.test.ts
import { calculateEmission } from "../../src/lib/emissionFactors";

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
});
