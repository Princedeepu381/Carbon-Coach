// src/app/api/activities/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateEmission, CategoryType } from "@/lib/emissionFactors";
import { computeWorldState } from "@/lib/computeWorld";
import { getWeeklyInsight } from "@/lib/gemini";
import { rateLimit } from "@/lib/rateLimit";
import { activitySchema } from "@/lib/validation";

// GET activities, weekly totals, streaks, and AI insight
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // 1. Fetch today's activities
    const todayActivities = await prisma.activity.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
        },
      },
      orderBy: {
        loggedAt: "desc",
      },
    });

    const todayTotal = todayActivities.reduce((sum, act) => sum + act.co2Kg, 0);

    // 2. Fetch User parameters to calculate goals
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const weeklyGoalKg = user?.weeklyGoalKg || 50.0;

    // 3. Compile last 7 days of daily carbon totals for Recharts
    const weeklyData = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayName = weekdays[d.getDay()];

      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      const dayActs = await prisma.activity.findMany({
        where: {
          userId,
          loggedAt: {
            gte: start,
            lte: end,
          },
        },
      });

      const categoryTotals: Record<string, number> = {
        transport: 0,
        food: 0,
        energy: 0,
        shopping: 0,
      };

      dayActs.forEach((act) => {
        const cat = act.category;
        if (cat in categoryTotals) {
          categoryTotals[cat] = parseFloat((categoryTotals[cat] + act.co2Kg).toFixed(2));
        }
      });

      weeklyData.push({
        date: dayName,
        transport: categoryTotals.transport,
        food: categoryTotals.food,
        energy: categoryTotals.energy,
        shopping: categoryTotals.shopping,
      });
    }

    // 4. Fetch last 7 days of logs to pass to Gemini
    const startOf7Days = new Date();
    startOf7Days.setDate(now.getDate() - 7);
    const weeklyActivities = await prisma.activity.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOf7Days,
        },
      },
    });

    // Generate AI Insight
    const insight = await getWeeklyInsight(weeklyActivities);

    // 5. Fetch Active Streak
    const streak = await prisma.streak.findFirst({
      where: { userId, type: "daily_log" },
    });

    return NextResponse.json({
      activities: todayActivities,
      todayTotal,
      weeklyData,
      insight,
      streak: streak?.currentStreak || 4,
    });
  } catch (error) {
    console.error("GET activities error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

// POST log activity
export async function POST(req: Request) {
  // Rate Limiting
  const ip = req.headers.get("x-forwarded-for")?.split(',')[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const limitResult = rateLimit(ip, 30, 60000); // 30 requests per minute
  if (!limitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid or empty JSON body" }, { status: 400 });
    }

    // Input Validation
    const validationResult = activitySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { userId, category, subType, quantity, unit, nudgeShown, nudgeAccepted } = validationResult.data;

    // Calculate CO2 equivalent in real time
    const co2 = calculateEmission(category as CategoryType, subType, quantity);

    // 1. Insert activity log
    const activity = await prisma.activity.create({
      data: {
        userId,
        category,
        subType,
        quantity,
        unit,
        co2Kg: co2,
        nudgeShown: !!nudgeShown,
        nudgeAccepted: !!nudgeAccepted,
      },
    });

    // 2. Fetch User parameters for World calculation
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const weeklyGoalKg = user?.weeklyGoalKg || 50.0;

    // 3. Compute today's updated World Snapshot
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayActivities = await prisma.activity.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
        },
      },
    });

    const newTodayTotal = todayActivities.reduce((sum, act) => sum + act.co2Kg, 0);
    const worldProps = computeWorldState(newTodayTotal, weeklyGoalKg);

    // Upsert snapshot for today
    await prisma.worldSnapshot.upsert({
      where: {
        userId_snapshotDate: {
          userId,
          snapshotDate: startOfDay,
        },
      },
      update: {
        totalCo2Kg: newTodayTotal,
        treeCount: worldProps.trees,
        skyPollution: worldProps.skyPollution,
        worldMood: worldProps.mood,
        computedAt: new Date(),
      },
      create: {
        userId,
        snapshotDate: startOfDay,
        totalCo2Kg: newTodayTotal,
        treeCount: worldProps.trees,
        skyPollution: worldProps.skyPollution,
        worldMood: worldProps.mood,
      },
    });

    // 4. Update Daily Log Streak (if first log today, increment streak)
    const activeStreak = await prisma.streak.findFirst({
      where: { userId, type: "daily_log" },
    });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (activeStreak) {
      const lastUpdateDate = new Date(activeStreak.lastUpdated);
      lastUpdateDate.setHours(0, 0, 0, 0);

      if (lastUpdateDate.getTime() === yesterday.getTime()) {
        // Logged yesterday, increment
        await prisma.streak.update({
          where: { id: activeStreak.id },
          data: {
            currentStreak: activeStreak.currentStreak + 1,
            longestStreak: Math.max(activeStreak.currentStreak + 1, activeStreak.longestStreak),
            lastUpdated: new Date(),
          },
        });
      } else if (lastUpdateDate.getTime() !== startOfDay.getTime()) {
        // Streak broken, reset to 1
        await prisma.streak.update({
          where: { id: activeStreak.id },
          data: {
            currentStreak: 1,
            lastUpdated: new Date(),
          },
        });
      }
    } else {
      // Initialize streak
      await prisma.streak.create({
        data: {
          userId,
          type: "daily_log",
          currentStreak: 1,
          longestStreak: 1,
          lastUpdated: new Date(),
        },
      });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("POST activity error:", error);
    return NextResponse.json({ error: "Failed to record activity" }, { status: 500 });
  }
}

// DELETE log activity
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (!id || !userId) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }

  try {
    // 1. Delete the activity log
    await prisma.activity.delete({
      where: { id },
    });

    // 2. Recompute today's World Snapshot
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayActivities = await prisma.activity.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
        },
      },
    });

    const newTodayTotal = todayActivities.reduce((sum, act) => sum + act.co2Kg, 0);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const weeklyGoalKg = user?.weeklyGoalKg || 50.0;
    const worldProps = computeWorldState(newTodayTotal, weeklyGoalKg);

    // Update the snapshot
    await prisma.worldSnapshot.update({
      where: {
        userId_snapshotDate: {
          userId,
          snapshotDate: startOfDay,
        },
      },
      data: {
        totalCo2Kg: newTodayTotal,
        treeCount: worldProps.trees,
        skyPollution: worldProps.skyPollution,
        worldMood: worldProps.mood,
        computedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE activity error:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
