// tests/unit/validation.test.ts
import {
  activitySchema,
  nudgeRequestSchema,
  userSchema,
  streakSchema,
  userIdQuerySchema,
  activityIdQuerySchema,
  validateRequest,
  formatZodError,
} from "../../src/lib/validation";
import { z } from "zod";

describe("Zod Validation Schemas and Utilities", () => {
  describe("activitySchema", () => {
    test("validates correct activity inputs", () => {
      const validActivity = {
        userId: "user-123",
        category: "transport",
        subType: "car_petrol",
        quantity: 12.5,
        unit: "km",
        nudgeShown: true,
        nudgeAccepted: false,
      };
      const res = activitySchema.safeParse(validActivity);
      expect(res.success).toBe(true);
    });

    test("fails on invalid category or non-positive quantity", () => {
      const invalidActivity = {
        userId: "user-123",
        category: "invalid_category",
        subType: "car_petrol",
        quantity: -5,
        unit: "km",
      };
      const res = activitySchema.safeParse(invalidActivity);
      expect(res.success).toBe(false);
    });
  });

  describe("nudgeRequestSchema", () => {
    test("validates correct nudge request inputs", () => {
      const validNudge = {
        userId: "user-123",
        category: "food",
        subType: "beef",
        quantity: 0.5,
        unit: "kg",
      };
      const res = nudgeRequestSchema.safeParse(validNudge);
      expect(res.success).toBe(true);
    });
  });

  describe("userSchema", () => {
    test("validates user inputs", () => {
      const validUser = {
        name: "Alice",
        email: "alice@example.com",
        weeklyGoalKg: 45,
      };
      const res = userSchema.safeParse(validUser);
      expect(res.success).toBe(true);
    });
  });

  describe("streakSchema", () => {
    test("validates streak inputs", () => {
      const validStreak = {
        userId: "user-123",
        type: "daily_log",
      };
      const res = streakSchema.safeParse(validStreak);
      expect(res.success).toBe(true);
    });
  });

  describe("query schemas", () => {
    test("validates query inputs", () => {
      expect(userIdQuerySchema.safeParse({ userId: "user-123" }).success).toBe(true);
      expect(activityIdQuerySchema.safeParse({ id: "activity-123", userId: "user-123" }).success).toBe(true);
    });
  });

  describe("utility functions", () => {
    test("validateRequest helper", () => {
      const schema = z.object({ name: z.string() });
      const valid = validateRequest(schema, { name: "test" });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.name).toBe("test");
      }

      const invalid = validateRequest(schema, { name: 123 });
      expect(invalid.success).toBe(false);
    });

    test("formatZodError helper", () => {
      const schema = z.object({ email: z.string().email() });
      const res = schema.safeParse({ email: "not-an-email" });
      expect(res.success).toBe(false);
      if (!res.success) {
        const formatted = formatZodError(res.error);
        expect(formatted.message).toBe("Validation failed");
        expect(formatted.errors.length).toBe(1);
        expect(formatted.errors[0].field).toBe("email");
      }
    });
  });
});
