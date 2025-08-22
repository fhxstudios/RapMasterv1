import { useGameState } from "@/hooks/use-game-state";
import { useMutation } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { profile, setProfile, currentUserId } = useGameState();
  const { toast } = useToast();

  const advanceWeekMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/game/advance-week", {
        userId: currentUserId,
      });
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      toast({
        title: "Week Advanced!",
        description: "Time has passed and you gained energy!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to advance week",
        variant: "destructive",
      });
    },
  });

  if (!profile) return null;

  const maxValues = {
    fame: 1000,
    reputation: 1000,
    fans: 1000000,
    netWorth: 1000000,
  };

  const getProgressPercentage = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Banner */}
      <div className="game-electric-gradient rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to the Game!</h2>
        <p className="text-gray-200 text-sm mb-4">Start your journey to become the #1 Rap Icon</p>
        <div className="bg-black bg-opacity-30 rounded-lg p-3">
          <p className="text-xs text-game-gold">💡 Tutorial: Go to Job to earn money, then try Music Studio!</p>
        </div>
      </div>

      {/* Week Progress */}
      <div className="bg-game-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Week Progress</h3>
          <div className="flex items-center text-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">Year {profile.year}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-300">
            Current week is in progress...
          </div>
          <Button
            onClick={() => advanceWeekMutation.mutate()}
            disabled={advanceWeekMutation.isPending}
            className="game-gold-gradient px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 flex items-center"
            data-testid="button-advance-week"
          >
            <Clock className="mr-2 h-4 w-4" />
            {advanceWeekMutation.isPending ? "Advancing..." : "Advance Week"}
          </Button>
        </div>
        <div className="text-xs text-gray-400">
          Advancing a week gives you +10 Energy and ages your character
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-game-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Fame ⭐</span>
            <span className="text-white font-bold" data-testid="stat-fame">{profile.fame}</span>
          </div>
          <Progress 
            value={getProgressPercentage(profile.fame, maxValues.fame)} 
            className="h-2"
          />
        </div>
        
        <div className="bg-game-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Reputation 🎭</span>
            <span className="text-white font-bold" data-testid="stat-reputation">{profile.reputation}</span>
          </div>
          <Progress 
            value={getProgressPercentage(profile.reputation, maxValues.reputation)} 
            className="h-2"
          />
        </div>
        
        <div className="bg-game-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Fans 👥</span>
            <span className="text-white font-bold" data-testid="stat-fans">{profile.fans.toLocaleString()}</span>
          </div>
          <Progress 
            value={getProgressPercentage(profile.fans, maxValues.fans)} 
            className="h-2"
          />
        </div>
        
        <div className="bg-game-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Net Worth 💵</span>
            <span className="text-white font-bold" data-testid="stat-networth">${profile.netWorth.toLocaleString()}</span>
          </div>
          <Progress 
            value={getProgressPercentage(profile.netWorth, maxValues.netWorth)} 
            className="h-2"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-game-green rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <div>
              <p className="text-white text-sm">Character created</p>
              <p className="text-gray-400 text-xs">Just now</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-game-gold rounded-full flex items-center justify-center">
              <i className="fas fa-gift text-white text-sm"></i>
            </div>
            <div>
              <p className="text-white text-sm">Starter bonus received: $100 + 50 Energy</p>
              <p className="text-gray-400 text-xs">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
