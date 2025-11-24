'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { userProgress } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { awardXP } from './update-progress';

interface SubmitAnswerParams {
    questionId: string;
    isCorrect: boolean;
    timeTaken: number; // in seconds
}

export async function submitAnswer({ questionId, isCorrect, timeTaken }: SubmitAnswerParams) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // Check if progress record already exists
        const existing = await db.query.userProgress.findFirst({
            where: and(
                eq(userProgress.userId, session.user.id),
                eq(userProgress.targetId, questionId)
            ),
        });

        if (existing) {
            // Update existing record
            await db
                .update(userProgress)
                .set({
                    isCompleted: true,
                    score: isCorrect ? 1 : 0,
                    timeTaken: Math.round(timeTaken),
                    updatedAt: new Date(),
                })
                .where(eq(userProgress.id, existing.id));
        } else {
            // Create new record
            await db.insert(userProgress).values({
                userId: session.user.id,
                targetId: questionId,
                isCompleted: true,
                score: isCorrect ? 1 : 0,
                timeTaken: Math.round(timeTaken),
            });
        }

        // Calculate next difficulty based on speed + accuracy
        let difficultyAdjustment = 0;

        // Award XP for correct answers
        let xpGained = 0;
        let leveledUp = false;

        if (isCorrect) {
            // Flow State: Fast and correct
            if (timeTaken < 10) {
                difficultyAdjustment = 2;
                xpGained = 20; // Bonus XP for flow state!
            } else {
                // Solid: Correct but slower
                difficultyAdjustment = 1;
                xpGained = 10; // Standard XP
            }

            // Award XP to user
            const xpResult = await awardXP(session.user.id, xpGained);
            if (xpResult.success) {
                leveledUp = xpResult.leveledUp || false;
            }
        } else {
            // Struggle: Incorrect answer
            difficultyAdjustment = -1;
        }

        return {
            success: true,
            difficultyAdjustment,
            timeTaken: Math.round(timeTaken),
            xpGained,
            leveledUp,
        };
    } catch (error) {
        console.error('Error submitting answer:', error);
        return { error: 'Failed to submit answer' };
    }
}
