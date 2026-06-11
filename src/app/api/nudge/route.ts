// src/app/api/nudge/route.ts
import { NextResponse } from "next/server";
import { getAiNudge } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid or empty JSON body" }, { status: 400 });
    }

    const { userId, category, subType, quantity, unit } = body;

    if (!userId || !category || !subType || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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
