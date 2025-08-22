import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useGameState } from "@/hooks/use-game-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Music } from "lucide-react";
import type { Track } from "@shared/schema";

export default function StudioPage() {
  const { profile, currentUserId, setProfile } = useGameState();
  const { toast } = useToast();
  const [trackTitle, setTrackTitle] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");

  const createTrackMutation = useMutation({
    mutationFn: async (trackData: { title: string; beat: string }) => {
      const response = await apiRequest("POST", "/api/game/track", {
        userId: currentUserId,
        ...trackData,
      });
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      setTrackTitle("");
      setSelectedBeat("");
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      toast({
        title: "Track created!",
        description: "Your new track is ready to release!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create track",
        variant: "destructive",
      });
    },
  });

  if (!profile) return null;

  const tracks = Array.isArray(profile.tracks) ? profile.tracks as Track[] : [];
  const unreleasedTracks = tracks.filter(track => !track.isReleased);

  const beatOptions = [
    { value: "free_beat_1", label: "Free Beat #1 (Basic Quality)" },
    { value: "free_beat_2", label: "Free Beat #2 (Basic Quality)" },
    { value: "premium_beat_1", label: "🔒 Premium Beat #1 (High Quality)", premium: true },
  ];

  const canCreateTrack = profile.energy >= 20 && trackTitle.trim() && selectedBeat;

  const handleCreateTrack = () => {
    if (!canCreateTrack) return;
    
    createTrackMutation.mutate({
      title: trackTitle.trim(),
      beat: selectedBeat,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold gradient-text text-center">Music Studio</h2>

      {/* Create Track Section */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Create New Track</h3>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Track title..."
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            className="w-full bg-game-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-game-electric focus:outline-none"
            data-testid="input-track-title"
          />
          
          <div>
            <label className="text-white text-sm block mb-2">Select Beat</label>
            <Select value={selectedBeat} onValueChange={setSelectedBeat}>
              <SelectTrigger 
                className="w-full bg-game-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-game-electric"
                data-testid="select-beat"
              >
                <SelectValue placeholder="Choose a beat..." />
              </SelectTrigger>
              <SelectContent className="bg-game-dark border-gray-600">
                {beatOptions.map((beat) => (
                  <SelectItem 
                    key={beat.value} 
                    value={beat.value}
                    disabled={beat.premium}
                    className="text-white hover:bg-game-card"
                  >
                    {beat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleCreateTrack}
            disabled={!canCreateTrack || createTrackMutation.isPending}
            className="w-full game-electric-gradient hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            data-testid="button-record-track"
          >
            <Music className="mr-2 h-5 w-5" />
            {createTrackMutation.isPending ? "Recording..." : "Record Track (20 Energy)"}
          </Button>
        </div>
      </div>

      {/* Unreleased Tracks */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Unreleased Tracks</h3>
        {unreleasedTracks.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No tracks yet. Create your first track!</p>
        ) : (
          <div className="space-y-3">
            {unreleasedTracks.map((track) => (
              <div key={track.id} className="bg-game-dark rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">{track.title}</h4>
                  <p className="text-gray-400 text-sm">Beat: {track.beat}</p>
                  <p className="text-game-gold text-sm">Quality: {track.quality}/100</p>
                </div>
                <Button
                  className="game-green-gradient px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90"
                  data-testid={`button-release-${track.id}`}
                >
                  Release
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
