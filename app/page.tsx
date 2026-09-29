import { HeroSection } from "@/components/home/hero-section";
import { HomeContent } from "@/components/home/home-content";
import { TodayFortuneSection } from "@/components/home/today-fortune-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TodayFortuneSection />
      <HomeContent />
    </>
  );
}