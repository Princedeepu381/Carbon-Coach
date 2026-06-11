// src/lib/validation.ts
import { z } from "zod";

/**
 * Validation schemas for API requests using Zod
 */

// Activity logging schema
export const activitySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  category: z.enum(["transport", "food", "energy", "shopping"], {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  subType: z.string().min(1, "Activity subtype is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  nudgeShown: z.boolean().optional(),
  nudgeAccepted: z.boolean().optional(),
});

export type ActivityInput = z.infer<typeof activitySchema>;

// AI nudge request schema
export const nudgeRequestSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  category: z.enum(["transport", "food", "energy", "shopping"], {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  subType: z.string().min(1, "Activity subtype is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
});

export type NudgeRequestInput = z.infer<typeof nudgeRequestSchema>;

// User creation schema
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  weeklyGoalKg: z.number().positive().min(10).max(200).optional(),
});

export type UserInput = z.infer<typeof userSchema>;

// Streak update schema
export const streakSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.string().min(1, "Streak type is required"),
});

export type StreakInput = z.infer<typeof streakSchema>;

// Query parameter schemas
export const userIdQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const activityIdQuerySchema = z.object({
  id: z.string().min(1, "Activity ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

/**
 * Helper function to validate and parse request body
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}

/**
 * Format Zod errors for API responses
 */
export function formatZodError(error: z.ZodError): {
  message: string;
  errors: Array<{ field: string; message: string }>;
} {
  return {
    message: "Validation failed",
    errors: error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    })),
  };
}

// Made with Bob
