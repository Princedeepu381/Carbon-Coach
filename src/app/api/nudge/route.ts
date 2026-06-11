// src/app/api/nudge/route.ts
import { NextResponse } from "next/server";
import { getAiNudge } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { nudgeRequestSchema } from "@/lib/validation";

export async function POST(req: Request) {
  // Rate Limiting
  const ip = req.headers.get("x-forwarded-for")?.split(',')[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const limitResult = rateLimit(ip, 20, 60000); // 20 requests per minute
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
    const validationResult = nudgeRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { userId, category, subType, quantity, unit } = validationResult.data;

    // Fetch user's weekly pattern for context
    const now = new Date();
    const startOf7Days = new Date();
    startOf7Days.setDate(now.getDate() - 7);

    const weeklyActivities = await prisma.activity.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOf7Days,
        },
      },
      select: {
        category: true,
        subType: true,
        co2Kg: true,
      },
    });

    // Aggregate weekly pattern by category
    const weeklyPattern = weeklyActivities.reduce((acc: any, act) => {
      if (!acc[act.category]) {
        acc[act.category] = { count: 0, totalCo2: 0 };
      }
      acc[act.category].count += 1;
      acc[act.category].totalCo2 += act.co2Kg;
      return acc;
    }, {});

    // Get AI nudge from Gemini (with fallback to rule-based)
    const nudgeResult = await getAiNudge(
      category,
      subType,
      parseFloat(quantity),
      unit,
      weeklyPattern
    );

    return NextResponse.json(nudgeResult);
  } catch (error) {
    console.error("POST nudge error:", error);
    return NextResponse.json(
      { error: "Failed to generate nudge" },
      { status: 500 }
    );
  }
}

// Made with Bob
