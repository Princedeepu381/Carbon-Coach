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

    // Fetch last 7 days of world snapshots
    const now = new Date();
    const startOf7Days = new Date();
    startOf7Days.setDate(now.getDate() - 6);
    startOf7Days.setHours(0, 0, 0, 0);

    const endOf7Days = new Date();
    endOf7Days.setHours(23, 59, 59, 999);

    // Fetch user, activities, and existing snapshots in parallel
    const [user, allActivities, existingSnapshots] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
      }),
      prisma.activity.findMany({
        where: {
          userId,
          loggedAt: {
            gte: startOf7Days,
            lte: endOf7Days,
          },
        },
        select: {
          co2Kg: true,
          loggedAt: true,
        },
      }),
      prisma.worldSnapshot.findMany({
        where: {
          userId,
          snapshotDate: {
            gte: startOf7Days,
          },
        },
      }),
    ]);

    const weeklyGoalKg = user?.weeklyGoalKg || 50.0;

    const snapshotMap = new Map(
      existingSnapshots.map(s => [s.snapshotDate.getTime(), s])
    );

    // Process each day and batch upsert operations
    const snapshots = [];
    const upsertOperations = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOf7Days);
      date.setDate(startOf7Days.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Filter activities for this day from the already fetched data
      const dayActivities = allActivities.filter(act => {
        const actDate = new Date(act.loggedAt);
        return actDate >= date && actDate <= endOfDay;
      });

      const totalCo2 = dayActivities.reduce((sum, act) => sum + act.co2Kg, 0);
      const worldState = computeWorldState(totalCo2, weeklyGoalKg);

      // Check if snapshot exists
      const existingSnapshot = snapshotMap.get(date.getTime());

      if (!existingSnapshot) {
        upsertOperations.push(
          prisma.worldSnapshot.create({
            data: {
              userId,
              snapshotDate: date,
              totalCo2Kg: totalCo2,
              treeCount: worldState.trees,
              skyPollution: worldState.skyPollution,
              worldMood: worldState.mood,
            },
          })
        );
      } else {
        upsertOperations.push(
          prisma.worldSnapshot.update({
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
          })
        );
      }
    }

    // Execute all upsert operations in parallel
    const results = await Promise.all(upsertOperations);
    snapshots.push(...results);

    return NextResponse.json({ snapshots });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch world data" },
      { status: 500 }
    );
  }
}

// Made with Bob
