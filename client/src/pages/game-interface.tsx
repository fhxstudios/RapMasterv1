import { useState, useEffect } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { useLocation } from "wouter";
import Header from "@/components/game/header";
import Navigation from "@/components/game/navigation";
import HomePage from "@/components/game/pages/home";
import JobPage from "@/components/game/pages/job";
import StudioPage from "@/components/game/pages/studio";
import SocialPage from "@/components/game/pages/social";
import ShopPage from "@/components/game/pages/shop";
import StatsPage from "@/components/game/pages/stats";
import SkillsPage from "@/components/game/pages/skills";

export default function GameInterface() {
  const { profile } = useGameState();
  const [, setLocation] = useLocation();
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    if (!profile) {
      setLocation("/menu");
    }
  }, [profile, setLocation]);

  if (!profile) {
    return null;
  }

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <HomePage />;
      case "job":
        return <JobPage />;
      case "studio":
        return <StudioPage />;
      case "social":
        return <SocialPage />;
      case "shop":
        return <ShopPage />;
      case "stats":
        return <StatsPage />;
      case "skills":
        return <SkillsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" data-testid="game-interface">
      <Header />
      
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
      
      <Navigation activePage={activePage} onPageChange={setActivePage} />
    </div>
  );
}
