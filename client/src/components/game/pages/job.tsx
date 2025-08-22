import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useGameState } from "@/hooks/use-game-state";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@shared/schema";

export default function JobPage() {
  const { profile, currentUserId, setProfile } = useGameState();
  const { toast } = useToast();

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/game/jobs"],
  });

  const workMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiRequest("POST", "/api/game/work", {
        userId: currentUserId,
        jobId,
      });
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      toast({
        title: "Work completed!",
        description: "You earned money and energy!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete job",
        variant: "destructive",
      });
    },
  });

  if (!profile) return null;

  const entryJobs = jobs?.filter(job => job.category === "entry") || [];
  const midJobs = jobs?.filter(job => job.category === "mid") || [];

  const canWorkJob = (job: Job) => {
    return profile.energy >= job.energyCost && profile.fame >= (job.requiredFame || 0);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold gradient-text text-center">Find Work</h2>
      
      {/* Entry Level Jobs */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Entry Level Jobs</h3>
        {isLoading ? (
          <div className="text-gray-400 text-center py-4">Loading jobs...</div>
        ) : (
          <div className="space-y-3">
            {entryJobs.map((job) => (
              <div key={job.id} className="bg-game-dark rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">{job.title}</h4>
                  <p className="text-gray-400 text-sm">{job.description}</p>
                  <p className="text-game-gold text-sm">
                    +${job.moneyReward}, +{job.energyReward} Energy
                    {job.fameReward ? `, +${job.fameReward} Fame` : ""}
                  </p>
                </div>
                <Button
                  onClick={() => workMutation.mutate(job.id)}
                  disabled={!canWorkJob(job) || workMutation.isPending}
                  className="game-green-gradient px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50"
                  data-testid={`button-work-${job.id}`}
                >
                  {workMutation.isPending ? "Working..." : `Work (${job.energyCost} Energy)`}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mid Level Jobs */}
      <div className={`bg-game-card rounded-xl p-6 ${midJobs.length === 0 ? 'opacity-60' : ''}`}>
        <h3 className="text-lg font-bold text-white mb-4">
          {midJobs.length === 0 ? 'Mid-Level Jobs (Locked)' : 'Mid-Level Jobs'}
        </h3>
        <div className="space-y-3">
          {midJobs.length === 0 ? (
            <div className="bg-game-dark rounded-lg p-4 flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold">🔒 Studio Assistant</h4>
                <p className="text-gray-400 text-sm">Requires Fame: 10</p>
                <p className="text-game-gold text-sm">+$75, +Fame</p>
              </div>
            </div>
          ) : (
            midJobs.map((job) => (
              <div key={job.id} className="bg-game-dark rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">
                    {canWorkJob(job) ? job.title : `🔒 ${job.title}`}
                  </h4>
                  <p className="text-gray-400 text-sm">{job.description}</p>
                  {!canWorkJob(job) && job.requiredFame && (
                    <p className="text-red-400 text-sm">Requires Fame: {job.requiredFame}</p>
                  )}
                  <p className="text-game-gold text-sm">
                    +${job.moneyReward}
                    {job.energyReward ? `, +${job.energyReward} Energy` : ""}
                    {job.fameReward ? `, +${job.fameReward} Fame` : ""}
                  </p>
                </div>
                {canWorkJob(job) && (
                  <Button
                    onClick={() => workMutation.mutate(job.id)}
                    disabled={workMutation.isPending}
                    className="game-green-gradient px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90"
                    data-testid={`button-work-${job.id}`}
                  >
                    {workMutation.isPending ? "Working..." : `Work (${job.energyCost} Energy)`}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
