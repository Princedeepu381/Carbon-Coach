// src/app/api/streaks/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const streaks = await prisma.streak.findMany({
      where: { userId },
      orderBy: { lastUpdated: "desc" },
    });

    return NextResponse.json({ streaks });
  } catch (error) {
    console.error("GET streaks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch streaks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid or empty JSON body" }, { status: 400 });
    }

    const { userId, type } = body;

    if (!userId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if streak exists
    const existingStreak = await prisma.streak.findFirst({
      where: { userId, type },
    });

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (existingStreak) {
      const lastUpdateDate = new Date(existingStreak.lastUpdated);
      lastUpdateDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // If already updated today, return existing
      if (lastUpdateDate.getTime() === today.getTime()) {
        return NextResponse.json(existingStreak);
      }

      // If updated yesterday, increment
      if (lastUpdateDate.getTime() === yesterday.getTime()) {
        const updatedStreak = await prisma.streak.update({
          where: { id: existingStreak.id },
          data: {
            currentStreak: existingStreak.currentStreak + 1,
            longestStreak: Math.max(
              existingStreak.currentStreak + 1,
              existingStreak.longestStreak
            ),
            lastUpdated: now,
          },
        });
        return NextResponse.json(updatedStreak);
      }

      // Streak broken, reset to 1
      const resetStreak = await prisma.streak.update({
        where: { id: existingStreak.id },
        data: {
          currentStreak: 1,
          lastUpdated: now,
        },
      });
      return NextResponse.json(resetStreak);
    }

    // Create new streak
    const newStreak = await prisma.streak.create({
      data: {
        userId,
        type,
        currentStreak: 1,
        longestStreak: 1,
        lastUpdated: now,
      },
    });

    return NextResponse.json(newStreak);
  } catch (error) {
    console.error("POST streak error:", error);
    return NextResponse.json(
      { error: "Failed to update streak" },
      { status: 500 }
    );
  }
}

// Made with Bob
