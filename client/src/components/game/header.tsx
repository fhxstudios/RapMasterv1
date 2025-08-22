import { useGameState } from "@/hooks/use-game-state";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function Header() {
  const { profile } = useGameState();
  const [, setLocation] = useLocation();

  if (!profile) return null;

  const formatDate = (year: number) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    return `${day} ${months[month]} ${year}`;
  };

  const getWeekProgress = () => {
    const dots = [];
    const progress = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < 4; i++) {
      dots.push(i < progress ? "•" : "°");
    }
    return dots.join("");
  };

  return (
    <div className="bg-gradient-to-r from-game-dark to-game-purple p-4 border-b border-gray-700 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <div className="text-game-gold font-semibold" data-testid="text-date">
              {formatDate(profile.year)}
            </div>
            <div className="text-gray-300 text-xs" data-testid="text-age">
              Age: {profile.age}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Week: <span className="text-white" data-testid="text-week-progress">{getWeekProgress()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-game-gold font-bold" data-testid="text-money">
              ${profile.money} 💵
            </div>
            <div className="text-game-green text-sm" data-testid="text-energy">
              {profile.energy} ⚡
            </div>
          </div>
          <Button 
            onClick={() => setLocation("/settings")}
            variant="ghost"
            size="icon"
            className="p-2 bg-game-card rounded-lg text-white hover:bg-game-card/80"
            data-testid="button-settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
