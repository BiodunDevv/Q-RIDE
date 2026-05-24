import { ChallengesSection } from "@/components/Landing/challenges-section";
import { ConclusionSection } from "@/components/Landing/conclusion-section";
import { HeroSection } from "@/components/Landing/hero-section";
import { HowItWorksSection } from "@/components/Landing/how-it-works-section";
import { ImageIntelligenceSection } from "@/components/Landing/image-intelligence-section";
import { LandingFooter } from "@/components/Landing/landing-footer";
import { LandingNavbar } from "@/components/Landing/landing-navbar";
import { MarketSection } from "@/components/Landing/market-section";
import { MetricsSection } from "@/components/Landing/metrics-section";
import { OperationsSection } from "@/components/Landing/operations-section";
import { ProblemSection } from "@/components/Landing/problem-section";
import { SolutionSection } from "@/components/Landing/solution-section";
import { StrategySection } from "@/components/Landing/strategy-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />

      <main>
        <HeroSection />
        <HowItWorksSection />
        <ImageIntelligenceSection />
        <ProblemSection />
        <SolutionSection />
        <MarketSection />
        <OperationsSection />
        <StrategySection />
        <MetricsSection />
        <ChallengesSection />
        <ConclusionSection />
      </main>

      <LandingFooter />
    </div>
  );
}
