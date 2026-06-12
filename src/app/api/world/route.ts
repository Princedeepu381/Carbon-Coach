// src/app/api/world/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeWorldState } from "@/lib/computeWorld";
import { rateLimit } from "@/lib/rateLimit";
import { userIdQuerySchema } from "@/lib/validation";

export async function GET(req: Request) {
  // Rate Limiting
  const ip = req.headers.get("x-forwarded-for")?.split(',')[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const limitResult = rateLimit(ip, 30, 60000); // 30 requests per minute
  if (!limitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  // Input Validation
  const validationResult = userIdQuerySchema.safeParse({ userId });
  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validationResult.error.errors },
      { status: 400 }
    );
  }

  try {
    const { userId } = validationResult.data;
    // Fetch user's weekly goal
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const weeklyGoalKg = user?.weeklyGoalKg || 50.0;

    // Fetch last 7 days of world snapshots
    const now = new Date();
    const startOf7Days = new Date();
    startOf7Days.setDate(now.getDate() - 6);
    startOf7Days.setHours(0, 0, 0, 0);

    // Get or create snapshots for the last 7 days
    const snapshots = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOf7Days);
      date.setDate(startOf7Days.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get activities for this day
      const dayActivities = await prisma.activity.findMany({
        where: {
          userId,
          loggedAt: {
            gte: date,
            lte: endOfDay,
          },
        },
      });

      const totalCo2 = dayActivities.reduce((sum, act) => sum + act.co2Kg, 0);
      const worldState = computeWorldState(totalCo2, weeklyGoalKg);

      // Try to find existing snapshot
      let snapshot = await prisma.worldSnapshot.findUnique({
        where: {
          userId_snapshotDate: {
            userId,
            snapshotDate: date,
          },
        },
      });

      // Create or update snapshot
      if (!snapshot) {
        snapshot = await prisma.worldSnapshot.create({
          data: {
            userId,
            snapshotDate: date,
            totalCo2Kg: totalCo2,
            treeCount: worldState.trees,
            skyPollution: worldState.skyPollution,
            worldMood: worldState.mood,
          },
        });
      } else {
        // Update if data has changed
        snapshot = await prisma.worldSnapshot.update({
          where: {
            userId_snapshotDate: {
              userId,
              snapshotDate: date,
            },
          },
          data: {
            totalCo2Kg: totalCo2,
            treeCount: worldState.trees,
            skyPollution: worldState.skyPollution,
            worldMood: worldState.mood,
            computedAt: new Date(),
          },
        });
      }

      snapshots.push(snapshot);
    }

    return NextResponse.json({ snapshots });
  } catch (error) {
    console.error("GET world error:", error);
    return NextResponse.json(
      { error: "Failed to fetch world data" },
      { status: 500 }
    );
  }
}

// Made with Bob
