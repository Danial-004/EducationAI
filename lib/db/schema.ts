import { relations } from 'drizzle-orm';
import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    uuid,
    primaryKey,
    jsonb,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';


// ============================================================================
// NextAuth v5 Standard Schema
// ============================================================================

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
    password: text('password'), // Nullable - for credentials auth (OAuth users won't have this)
    // Gamification fields
    xp: integer('xp').notNull().default(0),
    level: integer('level').notNull().default(1),
    streak: integer('streak').notNull().default(0),
    lastStudyDate: timestamp('lastStudyDate', { mode: 'date' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
});

export const accounts = pgTable(
    'accounts',
    {
        userId: uuid('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').$type<AdapterAccountType>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = pgTable('sessions', {
    sessionToken: text('sessionToken').primaryKey(),
    userId: uuid('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
    'verificationTokens',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);

// ============================================================================
// App Tables: Learning Platform Schema
// ============================================================================

export const courses = pgTable('courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    published: boolean('published').default(false).notNull(),
    language: text("language").default("Russian"),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const modules = pgTable('modules', {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('courseId')
        .notNull()
        .references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    order: integer('order').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const materials = pgTable('materials', {
    id: uuid('id').defaultRandom().primaryKey(),
    moduleId: uuid('moduleId')
        .notNull()
        .references(() => modules.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    order: integer('order').notNull(),
    type: text('type', { enum: ['video', 'text'] }).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const questions = pgTable('questions', {
    id: uuid('id').defaultRandom().primaryKey(),
    moduleId: uuid('moduleId')
        .notNull()
        .references(() => modules.id, { onDelete: 'cascade' }),
    question: text('question').notNull(),
    type: text('type', { enum: ['multiple-choice', 'code'] }).notNull(),
    difficulty: integer('difficulty').notNull(),
    explanation: text('explanation').notNull().default('Explanation not available'),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const answers = pgTable('answers', {
    id: uuid('id').defaultRandom().primaryKey(),
    questionId: uuid('questionId')
        .notNull()
        .references(() => questions.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    isCorrect: boolean('isCorrect').default(false).notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
});

export const userProgress = pgTable('user_progress', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    targetId: uuid('targetId').notNull(), // References either material.id or question.id
    isCompleted: boolean('isCompleted').default(false).notNull(),
    score: integer('score'),
    timeTaken: integer('timeTaken').notNull().default(0), // Time in seconds
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const purchases = pgTable("purchase", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("userId").notNull(),     // Кімге доступ береміз? (ID арқылы)
    courseId: uuid("courseId")            // Қай курсқа? (courseId uuid болса)
        .references(() => courses.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
});

// ============================================================================
// Relations: For Drizzle Relational Queries
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    progress: many(userProgress),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
    modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
    course: one(courses, {
        fields: [modules.courseId],
        references: [courses.id],
    }),
    materials: many(materials),
    questions: many(questions),
}));

export const materialsRelations = relations(materials, ({ one }) => ({
    module: one(modules, {
        fields: [materials.moduleId],
        references: [modules.id],
    }),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
    module: one(modules, {
        fields: [questions.moduleId],
        references: [modules.id],
    }),
    answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
    question: one(questions, {
        fields: [answers.questionId],
        references: [questions.id],
    }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    user: one(users, {
        fields: [userProgress.userId],
        references: [users.id],
    }),
}));

// ============================================================================
// Final Exam & Certification System
// ============================================================================

export const courseExams = pgTable("course_exams", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
    questions: jsonb("questions").notNull(),
    status: text("status").notNull().default("in_progress"),
    score: integer("score"),
    startedAt: timestamp("started_at").defaultNow(),
    finishedAt: timestamp("finished_at"),
});

export const certifications = pgTable("certifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
    grade: text("grade").notNull(),
    issuedAt: timestamp("issued_at").defaultNow(),
});

export const courseExamsRelations = relations(courseExams, ({ one }) => ({
    user: one(users, {
        fields: [courseExams.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [courseExams.courseId],
        references: [courses.id],
    }),
}));

export const certificationsRelations = relations(certifications, ({ one }) => ({
    user: one(users, {
        fields: [certifications.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [certifications.courseId],
        references: [courses.id],
    }),
}));
