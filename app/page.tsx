import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, LineChart, Sparkles } from "lucide-react";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle Background Decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        <div className="container relative mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Headline */}
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              Master Any Subject{" "}
              <span className="text-blue-600">
                with AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 text-lg text-gray-600 sm:text-xl">
              Experience adaptive learning powered by cutting-edge AI. Get personalized quizzes,
              instant help from your AI tutor, and track your progress in real-time.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={session?.user ? "/dashboard" : "/auth"}>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto"
                  size="lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!session?.user && (
                <Link href="/auth">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg h-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to excel
            </h2>

            {/* Features Grid */}
            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1: Adaptive Tests */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Adaptive Tests
                </h3>
                <p className="text-gray-600">
                  AI-generated quizzes that adapt to your skill level. Get questions tailored
                  to challenge and improve your understanding.
                </p>
              </div>

              {/* Feature 2: AI Tutor */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  AI Tutor
                </h3>
                <p className="text-gray-600">
                  Get instant help powered by Google Gemini. Ask questions, receive explanations,
                  and learn at your own pace with 24/7 AI assistance.
                </p>
              </div>

              {/* Feature 3: Progress Tracking */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-600">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Progress Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor your learning journey with detailed analytics. Track completed lessons,
                  quiz scores, and identify areas for improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
