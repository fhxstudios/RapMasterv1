import { Button } from "@/components/ui/button";
import { 
  Home, 
  Briefcase, 
  Music, 
  Share, 
  ShoppingCart, 
  BarChart3, 
  Puzzle 
} from "lucide-react";

interface NavigationProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Navigation({ activePage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "job", icon: Briefcase, label: "Job" },
    { id: "studio", icon: Music, label: "Studio" },
    { id: "social", icon: Share, label: "Social" },
    { id: "shop", icon: ShoppingCart, label: "Shop" },
    { id: "stats", icon: BarChart3, label: "Stats" },
    { id: "skills", icon: Puzzle, label: "Skills" },
  ];

  return (
    <div className="bg-gradient-to-r from-game-dark to-game-purple border-t border-gray-700 p-2 sticky bottom-0">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <Button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center p-2 rounded-lg ${
                isActive ? 'text-game-electric' : 'text-gray-400 hover:text-white'
              }`}
              data-testid={`nav-${item.id}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
