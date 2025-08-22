import { useLocation } from "wouter";
import { useGameState } from "@/hooks/use-game-state";
import { Button } from "@/components/ui/button";
import { Play, FolderOpen, ShoppingCart, Settings } from "lucide-react";
import rapMasterLogo from "@assets/RapMasterIcon_1755893268109.png";

export default function MainMenu() {
  const [, setLocation] = useLocation();
  const { profile } = useGameState();

  const handleStartCareer = () => {
    setLocation("/create");
  };

  const handleLoadGame = () => {
    if (profile) {
      setLocation("/game");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background Music Visualization */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="flex items-end justify-center h-full space-x-1">
          <div className="w-2 bg-game-electric animate-pulse h-[20%]"></div>
          <div className="w-2 bg-game-gold animate-pulse h-[60%]"></div>
          <div className="w-2 bg-game-green animate-pulse h-[40%]"></div>
          <div className="w-2 bg-game-electric animate-pulse h-[80%]"></div>
          <div className="w-2 bg-game-gold animate-pulse h-[30%]"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12" data-testid="main-menu-logo">
          <img 
            src={rapMasterLogo} 
            alt="RapMaster Simulator"
            className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl"
          />
          <h1 className="text-4xl font-black gradient-text mb-2">RapMaster</h1>
          <h2 className="text-xl font-bold text-white">Simulator</h2>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleStartCareer}
            className="w-full game-electric-gradient hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 glow-effect"
            data-testid="button-start-career"
          >
            <Play className="mr-3 h-5 w-5" />
            Start Career
          </Button>
          
          <Button 
            onClick={handleLoadGame}
            disabled={!profile}
            className="w-full bg-gradient-to-r from-game-card to-gray-700 hover:from-gray-700 hover:to-game-card text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-load-game"
          >
            <FolderOpen className="mr-3 h-5 w-5" />
            Load Game
          </Button>
          
          <Button 
            className="w-full game-gold-gradient hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            data-testid="button-shop"
          >
            <ShoppingCart className="mr-3 h-5 w-5" />
            Shop
          </Button>
          
          <Button 
            className="w-full bg-gradient-to-r from-game-card to-gray-700 hover:from-gray-700 hover:to-game-card text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            data-testid="button-settings"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
