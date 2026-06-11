-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatarSeed" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weeklyGoalKg" REAL NOT NULL DEFAULT 50.0,
    "notificationPref" TEXT NOT NULL DEFAULT '{}'
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "co2Kg" REAL NOT NULL,
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nudgeShown" BOOLEAN NOT NULL DEFAULT false,
    "nudgeAccepted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiNudge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT NOT NULL,
    "triggerPhase" TEXT NOT NULL,
    "currentCo2" REAL NOT NULL,
    "altCo2" REAL NOT NULL,
    "altLabel" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiNudge_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Streak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorldSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "snapshotDate" DATETIME NOT NULL,
    "totalCo2Kg" REAL NOT NULL,
    "treeCount" INTEGER NOT NULL DEFAULT 5,
    "skyPollution" REAL NOT NULL DEFAULT 0.3,
    "worldMood" TEXT NOT NULL DEFAULT 'neutral',
    "computedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorldSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Activity_userId_loggedAt_idx" ON "Activity"("userId", "loggedAt");

-- CreateIndex
CREATE INDEX "Activity_category_loggedAt_idx" ON "Activity"("category", "loggedAt");

-- CreateIndex
CREATE INDEX "WorldSnapshot_userId_snapshotDate_idx" ON "WorldSnapshot"("userId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "WorldSnapshot_userId_snapshotDate_key" ON "WorldSnapshot"("userId", "snapshotDate");
