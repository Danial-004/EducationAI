// app/page.tsx
import { auth } from "@/auth";
import { LandingPageClient } from "@/components/landing-page-client"; // Жаңа файлды шақырамыз

export default async function Home() {
  const session = await auth();

  // Тексеру: қолданушы кірген бе?
  const isLoggedIn = !!session?.user;

  return <LandingPageClient isLoggedIn={isLoggedIn} />;
}