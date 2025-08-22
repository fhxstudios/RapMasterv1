import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import fhxStudiosLogo from "@assets/Picsart_25-06-26_15-00-11-361_1755893418224.png";

export default function SettingsPage() {
  const [, setLocation] = useLocation();

  const handleBackToMenu = () => {
    setLocation("/menu");
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={handleBackToMenu}
          variant="ghost"
          size="icon"
          className="p-2 bg-game-card rounded-lg text-white hover:bg-game-card/80"
          data-testid="button-back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold gradient-text">Settings & Credits</h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Publisher */}
        <div className="bg-game-card rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-4">Publisher</h3>
          <img 
            src={fhxStudiosLogo} 
            alt="FHX Studios"
            className="h-12 mx-auto mb-2"
          />
          <p className="text-white font-semibold">FHX STUDIOS</p>
        </div>

        {/* Credits */}
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Credits</h3>
          <div className="space-y-4">
            <div>
              <p className="text-game-gold font-semibold">Concept</p>
              <p className="text-white">Fahim Muttasin Limon</p>
            </div>
            <div>
              <p className="text-game-gold font-semibold">Developer</p>
              <p className="text-white">Fhx Studio</p>
            </div>
            <div>
              <p className="text-game-gold font-semibold">UI/UX Design</p>
              <p className="text-white">Fahim Muttasin Limon</p>
            </div>
          </div>
        </div>

        {/* Support Us */}
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Support Us</h3>
          <div className="space-y-3">
            <Button
              onClick={() => openLink('https://x.com/Fhx_Studios?t=c8MULYBgZ69pYPWIHpC6gw&s=09')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center"
              data-testid="button-twitter"
            >
              <span className="mr-2">🐦</span>
              Follow us on Twitter (X)
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => openLink('https://www.patreon.com/c/FhxStudios')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center"
              data-testid="button-patreon"
            >
              <span className="mr-2">🧡</span>
              Support us on Patreon
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Game Settings */}
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Game Settings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white">Sound Effects</span>
              <Button className="bg-game-green hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center">
                <span className="mr-1">🔊</span>ON
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Music</span>
              <Button className="bg-game-green hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center">
                <span className="mr-1">🎵</span>ON
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Notifications</span>
              <Button className="bg-game-green hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center">
                <span className="mr-1">🔔</span>ON
              </Button>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="bg-game-card rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">RapMaster Simulator</h3>
          <p className="text-gray-400 text-sm">Version 1.0.0</p>
          <p className="text-gray-400 text-sm">© 2025 FHX Studios</p>
        </div>
      </div>
    </div>
  );
}