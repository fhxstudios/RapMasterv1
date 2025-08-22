import { useEffect } from "react";
import { useLocation } from "wouter";
import rapMasterLogo from "@assets/RapMasterIcon_1755893268109.png";
import fhxStudiosLogo from "@assets/Picsart_25-06-26_15-00-11-361_1755893418224.png";

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
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 drop-shadow-2xl mobile-splash-logo"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-2 mobile-splash-title">RapMaster</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 mobile-splash-subtitle">Simulator</h2>
        <div className="w-32 h-1 game-gold-gradient mx-auto rounded-full"></div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <div className="flex flex-col items-center">
          <p className="text-gray-400 text-xs mb-3">Powered by</p>
          <img 
            src={fhxStudiosLogo} 
            alt="FHX Studios"
            className="h-8 mb-3 opacity-80"
          />
          <p className="text-gray-400 text-xs">Tap anywhere to continue</p>
        </div>
      </div>
    </div>
  );
}
