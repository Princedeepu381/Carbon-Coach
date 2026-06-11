// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.aiNudge.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.worldSnapshot.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create User 1: Priya Sharma (Eco-Guardian - Low Emissions)
  const priya = await prisma.user.create({
    data: {
      id: "demo-user-id",
      name: "Priya Sharma",
      avatarSeed: "priya",
      weeklyGoalKg: 42,
      notificationPref: JSON.stringify({ email: true, push: true }),
    },
  });

  console.log("✅ Created user: Priya Sharma (Eco-Guardian)");

  // Create User 2: Vikram Malhotra (High Emissions)
  const vikram = await prisma.user.create({
    data: {
      id: "vikram-user-id",
      name: "Vikram Malhotra",
      avatarSeed: "vikram",
      weeklyGoalKg: 42,
      notificationPref: JSON.stringify({ email: false, push: true }),
    },
  });

  console.log("✅ Created user: Vikram Malhotra (High Emissions)");

  // Generate activities for the past 7 days for Priya (Low emissions)
  const now = new Date();
  const priyaActivities = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);

    // Morning commute - Metro (eco-friendly)
    priyaActivities.push({
      userId: priya.id,
      category: "transport",
      subType: "metro",
      quantity: 15,
      unit: "km",
      co2Kg: 0.615, // 15 * 0.041
      loggedAt: new Date(date),
      nudgeShown: false,
      nudgeAccepted: false,
    });

    // Lunch - Vegan meal
    const lunchDate = new Date(date);
    lunchDate.setHours(13, 0, 0, 0);
    priyaActivities.push({
      userId: priya.id,
      category: "food",
      subType: "vegan_meal",
      quantity: 1,
      unit: "meals",
      co2Kg: 0.28,
      loggedAt: lunchDate,
      nudgeShown: false,
      nudgeAccepted: false,
    });

    // Evening - LED bulbs usage
    const eveningDate = new Date(date);
    eveningDate.setHours(19, 0, 0, 0);
    priyaActivities.push({
      userId: priya.id,
      category: "energy",
      subType: "led_bulb_per_hour",
      quantity: 4,
      unit: "hours",
      co2Kg: 0.036, // 4 * 0.009
      loggedAt: eveningDate,
      nudgeShown: false,
      nudgeAccepted: false,
    });

    // Occasional bicycle ride
    if (i % 2 === 0) {
      const bikeDate = new Date(date);
      bikeDate.setHours(17, 30, 0, 0);
      priyaActivities.push({
        userId: priya.id,
        category: "transport",
        subType: "bicycle",
        quantity: 5,
        unit: "km",
        co2Kg: 0.0,
        loggedAt: bikeDate,
        nudgeShown: false,
        nudgeAccepted: false,
      });
    }
  }

  await prisma.activity.createMany({ data: priyaActivities });
  console.log(`✅ Created ${priyaActivities.length} activities for Priya`);

  // Generate activities for the past 7 days for Vikram (High emissions)
  const vikramActivities = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(7 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);

    // Morning commute - Petrol car (high emissions)
    vikramActivities.push({
      userId: vikram.id,
      category: "transport",
      subType: "car_petrol",
      quantity: 25,
      unit: "km",
      co2Kg: 5.25, // 25 * 0.21
      loggedAt: new Date(date),
      nudgeShown: true,
      nudgeAccepted: false,
    });

    // Lunch - Beef meal
    const lunchDate = new Date(date);
    lunchDate.setHours(13, 30, 0, 0);
    vikramActivities.push({
      userId: vikram.id,
      category: "food",
      subType: "beef_meal",
      quantity: 1,
      unit: "meals",
      co2Kg: 3.0,
      loggedAt: lunchDate,
      nudgeShown: true,
      nudgeAccepted: false,
    });

    // Dinner - Chicken meal
    const dinnerDate = new Date(date);
    dinnerDate.setHours(20, 0, 0, 0);
    vikramActivities.push({
      userId: vikram.id,
      category: "food",
      subType: "chicken_meal",
      quantity: 1,
      unit: "meals",
      co2Kg: 0.9,
      loggedAt: dinnerDate,
      nudgeShown: false,
      nudgeAccepted: false,
    });

    // AC usage (high energy)
    const acDate = new Date(date);
    acDate.setHours(22, 0, 0, 0);
    vikramActivities.push({
      userId: vikram.id,
      category: "energy",
      subType: "ac_per_hour",
      quantity: 8,
      unit: "hours",
      co2Kg: 9.84, // 8 * 1.23
      loggedAt: acDate,
      nudgeShown: true,
      nudgeAccepted: false,
    });

    // Online shopping
    if (i % 3 === 0) {
      const shopDate = new Date(date);
      shopDate.setHours(21, 0, 0, 0);
      vikramActivities.push({
        userId: vikram.id,
        category: "shopping",
        subType: "online_delivery",
        quantity: 2,
        unit: "packages",
        co2Kg: 1.0, // 2 * 0.5
        loggedAt: shopDate,
        nudgeShown: false,
        nudgeAccepted: false,
      });
    }

    // New clothing purchase
    if (i === 2) {
      const clothingDate = new Date(date);
      clothingDate.setHours(16, 0, 0, 0);
      vikramActivities.push({
        userId: vikram.id,
        category: "shopping",
        subType: "clothing_item",
        quantity: 1,
        unit: "items",
        co2Kg: 10.0,
        loggedAt: clothingDate,
        nudgeShown: false,
        nudgeAccepted: false,
      });
    }
  }

  await prisma.activity.createMany({ data: vikramActivities });
  console.log(`✅ Created ${vikramActivities.length} activities for Vikram`);

  // Create streaks for both users
  await prisma.streak.create({
    data: {
      userId: priya.id,
      type: "daily_log",
      currentStreak: 4,
      longestStreak: 12,
      lastUpdated: new Date(),
    },
  });

  await prisma.streak.create({
    data: {
      userId: vikram.id,
      type: "daily_log",
      currentStreak: 5,
      longestStreak: 7,
      lastUpdated: new Date(),
    },
  });

  console.log("✅ Created streaks for both users");

  // Create world snapshots for the past 7 days for Priya
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dayActivities = priyaActivities.filter((act) => {
      const actDate = new Date(act.loggedAt);
      return actDate >= startOfDay && actDate <= endOfDay;
    });

    const totalCo2 = dayActivities.reduce((sum, act) => sum + act.co2Kg, 0);

    // Priya's world is thriving (low emissions)
    await prisma.worldSnapshot.create({
      data: {
        userId: priya.id,
        snapshotDate: date,
        totalCo2Kg: totalCo2,
        treeCount: 18,
        skyPollution: 0.05,
        worldMood: "thriving",
      },
    });
  }

  console.log("✅ Created world snapshots for Priya");

  // Create world snapshots for the past 7 days for Vikram
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dayActivities = vikramActivities.filter((act) => {
      const actDate = new Date(act.loggedAt);
      return actDate >= startOfDay && actDate <= endOfDay;
    });

    const totalCo2 = dayActivities.reduce((sum, act) => sum + act.co2Kg, 0);

    // Vikram's world is critical (high emissions)
    await prisma.worldSnapshot.create({
      data: {
        userId: vikram.id,
        snapshotDate: date,
        totalCo2Kg: totalCo2,
        treeCount: 1,
        skyPollution: 0.90,
        worldMood: "critical",
      },
    });
  }

  console.log("✅ Created world snapshots for Vikram");

  // Create sample AI nudges
  const recentPriyaActivity = priyaActivities[priyaActivities.length - 1];
  const recentVikramActivity = vikramActivities[vikramActivities.length - 1];

  if (recentPriyaActivity) {
    const priyaActivity = await prisma.activity.findFirst({
      where: {
        userId: priya.id,
        category: recentPriyaActivity.category,
        subType: recentPriyaActivity.subType,
      },
      orderBy: { loggedAt: "desc" },
    });

    if (priyaActivity) {
      await prisma.aiNudge.create({
        data: {
          activityId: priyaActivity.id,
          triggerPhase: "pre-log",
          currentCo2: 0.615,
          altCo2: 0.0,
          altLabel: "bicycle",
          message: "Great choice! Metro is already eco-friendly. Consider cycling for even lower emissions!",
        },
      });
    }
  }

  if (recentVikramActivity) {
    const vikramActivity = await prisma.activity.findFirst({
      where: {
        userId: vikram.id,
        category: "transport",
        subType: "car_petrol",
      },
      orderBy: { loggedAt: "desc" },
    });

    if (vikramActivity) {
      await prisma.aiNudge.create({
        data: {
          activityId: vikramActivity.id,
          triggerPhase: "pre-log",
          currentCo2: 5.25,
          altCo2: 1.025,
          altLabel: "metro",
          message: "Taking the metro instead of driving saves 4.2 kg CO₂. Switch to metro?",
        },
      });
    }
  }

  console.log("✅ Created sample AI nudges");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: 2 (Priya & Vikram)`);
  console.log(`   - Activities: ${priyaActivities.length + vikramActivities.length}`);
  console.log(`   - World Snapshots: 14 (7 days × 2 users)`);
  console.log(`   - Streaks: 2`);
  console.log(`   - AI Nudges: 2`);
  console.log("\n🚀 Ready to start! Run: npm run dev");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Made with Bob
