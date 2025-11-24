"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Award XP to user, handle streak tracking, and level progression
 */
export async function awardXP(userId: string, amount: number) {
    try {
        // 1. Fetch current user data
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            throw new Error("User not found");
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 2. Calculate streak
        let newStreak = user.streak || 0;

        if (user.lastStudyDate) {
            const lastStudy = new Date(user.lastStudyDate);
            lastStudy.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1) {
                // Yesterday: increment streak
                newStreak = (user.streak || 0) + 1;
            } else if (daysDiff === 0) {
                // Today: keep streak
                newStreak = user.streak || 1;
            } else {
                // Older than yesterday: reset streak
                newStreak = 1;
            }
        } else {
            // First time studying
            newStreak = 1;
        }

        // 3. Calculate new XP and level
        const oldLevel = user.level || 1;
        const newXP = (user.xp || 0) + amount;
        const newLevel = Math.floor(newXP / 100) + 1; // 100 XP per level
        const leveledUp = newLevel > oldLevel;

        // 4. Update database
        await db
            .update(users)
            .set({
                xp: newXP,
                level: newLevel,
                streak: newStreak,
                lastStudyDate: new Date(),
            })
            .where(eq(users.id, userId));

        console.log(`User ${userId}: +${amount} XP → Level ${newLevel} (Streak: ${newStreak})`);

        return {
            success: true,
            newXP,
            newLevel,
            leveledUp,
            newStreak,
            xpGained: amount,
        };
    } catch (error: any) {
        console.error("Error awarding XP:", error);
        return {
            success: false,
            error: error.message || "Failed to award XP",
        };
    }
}

/**
 * Get user progress stats
 */
export async function getUserProgress(userId: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            throw new Error("User not found");
        }

        const xp = user.xp || 0;
        const level = user.level || 1;
        const xpForNextLevel = level * 100;
        const xpInCurrentLevel = xp % 100;
        const progress = (xpInCurrentLevel / 100) * 100;

        return {
            success: true,
            xp,
            level,
            streak: user.streak || 0,
            xpForNextLevel,
            xpInCurrentLevel,
            progress,
        };
    } catch (error: any) {
        console.error("Error getting user progress:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}
