"use server";

import { db } from "@/lib/db";
import { purchases, users } from "@/lib/db/schema"; // users кестесі бар деп есептейміз
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Бұл функцияны админ кнопка басқанда шақырамыз
export async function grantAccess(userEmail: string, courseId: string) {
    try {
        // 1. Email арқылы адамды табамыз (ID алу үшін)
        // Ескерту: Сіздің schema-да users кестесі болуы керек
        const user = await db.query.users.findFirst({
            where: eq(users.email, userEmail)
        });

        if (!user) {
            return { error: "Бұл email-мен тіркелген адам табылмады!" };
        }

        // 2. Бұл адамда осы курс бар ма, тексереміз?
        const existingPurchase = await db.query.purchases.findFirst({
            where: and(
                eq(purchases.userId, user.id),
                eq(purchases.courseId, courseId)
            )
        });

        if (existingPurchase) {
            return { error: "Бұл адамда курсқа доступ бар!" };
        }

        // 3. Доступ береміз (Базаға жазамыз)
        await db.insert(purchases).values({
            userId: user.id,
            courseId: courseId,
        });

        revalidatePath(`/course/${courseId}`); // Сайтты жаңарту
        return { success: `Керемет! ${userEmail} курсқа қосылды.` };

    } catch (error) {
        console.error(error);
        return { error: "Қате шықты. Қайта көріңіз." };
    }
}