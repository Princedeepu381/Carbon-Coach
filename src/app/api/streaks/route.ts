// src/app/api/streaks/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { streakSchema, userIdQuerySchema } from "@/lib/validation";

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
    const validationResult = streakSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { userId, type } = validationResult.data;

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
