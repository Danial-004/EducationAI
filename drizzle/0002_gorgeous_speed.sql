ALTER TABLE "certifications" DROP CONSTRAINT "certifications_examId_course_exams_id_fk";
--> statement-breakpoint
ALTER TABLE "course_exams" ALTER COLUMN "questions" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "certifications" DROP COLUMN "examId";--> statement-breakpoint
ALTER TABLE "certifications" DROP COLUMN "score";