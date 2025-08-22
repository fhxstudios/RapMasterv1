import { useMutation } from "@tanstack/react-query";
import { useGameState } from "@/hooks/use-game-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { GameEngine } from "@/lib/game-engine";

export default function SkillsPage() {
  const { profile, currentUserId, setProfile } = useGameState();
  const { toast } = useToast();

  const upgradeSkillMutation = useMutation({
    mutationFn: async (skillName: string) => {
      const response = await apiRequest("POST", "/api/game/skill/upgrade", {
        userId: currentUserId,
        skillName,
      });
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      toast({
        title: "Skill upgraded!",
        description: "Your skill level has increased!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upgrade skill",
        variant: "destructive",
      });
    },
  });

  if (!profile) return null;

  const skills = profile.skills as any;

  const skillList = [
    {
      id: "rapping",
      name: "🎤 Rapping",
      level: skills.rapping || 1,
      color: "game-gold",
      description: "Improves track quality and performance"
    },
    {
      id: "production",
      name: "🎵 Music Production",
      level: skills.production || 1,
      color: "game-electric",
      description: "Enhances beat creation and mixing"
    },
    {
      id: "socialMedia",
      name: "📱 Social Media",
      level: skills.socialMedia || 1,
      color: "game-green",
      description: "Increases fan engagement and growth"
    },
    {
      id: "performance",
      name: "🎭 Performance",
      level: skills.performance || 1,
      color: "purple-500",
      description: "Boosts live show success and stage presence"
    },
    {
      id: "business",
      name: "💼 Business",
      level: skills.business || 1,
      color: "orange-500",
      description: "Improves contract negotiations and deals"
    },
  ];

  const getUpgradeCost = (currentLevel: number) => {
    return GameEngine.calculateSkillUpgradeCost(currentLevel);
  };

  const canUpgradeSkill = (skill: any) => {
    const cost = getUpgradeCost(skill.level);
    return profile.energy >= cost && skill.level < 100;
  };

  const getProgressPercentage = (level: number) => {
    return Math.min((level / 100) * 100, 100);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold gradient-text text-center">Skills</h2>

      {/* Available Energy */}
      <div className="game-green-gradient rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-white" data-testid="available-energy">
          {profile.energy} ⚡
        </div>
        <div className="text-white text-sm opacity-90">Available Energy</div>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {skillList.map((skill) => {
          const upgradeCost = getUpgradeCost(skill.level);
          const canUpgrade = canUpgradeSkill(skill);
          
          return (
            <div key={skill.id} className="bg-game-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">{skill.name}</span>
                <span className="text-game-gold" data-testid={`skill-level-${skill.id}`}>
                  Level {skill.level}
                </span>
              </div>
              
              <p className="text-gray-400 text-xs mb-3">{skill.description}</p>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <Progress 
                  value={getProgressPercentage(skill.level)} 
                  className="h-2"
                  data-testid={`skill-progress-${skill.id}`}
                />
              </div>
              
              <Button
                onClick={() => upgradeSkillMutation.mutate(skill.id)}
                disabled={!canUpgrade || upgradeSkillMutation.isPending}
                className={`game-electric-gradient px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
                data-testid={`button-upgrade-${skill.id}`}
              >
                {upgradeSkillMutation.isPending ? "Upgrading..." : 
                 skill.level >= 100 ? "Max Level" :
                 canUpgrade ? `Upgrade (${upgradeCost} Energy)` : 
                 `Need ${upgradeCost - profile.energy} Energy`}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Skill Bonuses Info */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Skill Bonuses</h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-300">
            <span className="text-game-gold">Rapping:</span> +2 track quality per level
          </p>
          <p className="text-gray-300">
            <span className="text-game-electric">Production:</span> +2 track quality per level
          </p>
          <p className="text-gray-300">
            <span className="text-game-green">Social Media:</span> +10% fan growth per level
          </p>
          <p className="text-gray-300">
            <span className="text-purple-400">Performance:</span> +5% concert earnings per level
          </p>
          <p className="text-gray-300">
            <span className="text-orange-400">Business:</span> +3% deal value per level
          </p>
        </div>
      </div>
    </div>
  );
}
