import { useEffect } from "react";
import { useLocation } from "wouter";
import rapMasterLogo from "@assets/RapMasterIcon_1755893268109.png";

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/menu");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  const handleSkip = () => {
    setLocation("/menu");
  };

  return (
    <div 
      className="fixed inset-0 game-bg-gradient flex flex-col items-center justify-center z-50 cursor-pointer"
      onClick={handleSkip}
      data-testid="splash-screen"
    >
      {/* Animated particles background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-game-gold rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-game-green rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-game-electric rounded-full animate-bounce"></div>
      </div>
      
      {/* Game Logo */}
      <div className="text-center animate-pulse-glow" data-testid="game-logo">
        <div className="mb-6">
          <img 
            src={rapMasterLogo} 
            alt="RapMaster Simulator"
            className="w-32 h-32 mx-auto mb-4 drop-shadow-2xl"
          />
        </div>
        <h1 className="text-5xl font-black gradient-text mb-2">RapMaster</h1>
        <h2 className="text-3xl font-bold text-white mb-8">Simulator</h2>
        <div className="w-32 h-1 game-gold-gradient mx-auto rounded-full"></div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-300 text-sm">Powered by FHX STUDIOS</p>
        <p className="text-gray-400 text-xs mt-2">Tap anywhere to continue</p>
      </div>
    </div>
  );
}
