import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useGameState } from "@/hooks/use-game-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Music, Play, Video, Upload, Eye, Heart, TrendingUp } from "lucide-react";
import type { Track } from "@shared/schema";

export default function StudioPage() {
  const { profile, currentUserId, setProfile } = useGameState();
  const { toast } = useToast();
  const [trackTitle, setTrackTitle] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");
  const [activeTab, setActiveTab] = useState<'create' | 'unreleased' | 'released' | 'videos'>('create');
  const [selectedTrackForVideo, setSelectedTrackForVideo] = useState("");

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

  const releaseTrackMutation = useMutation({
    mutationFn: async (trackId: string) => {
      const response = await apiRequest("POST", "/api/game/track/release", {
        userId: currentUserId,
        trackId,
      });
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      toast({
        title: "Track Released!",
        description: "Your track is now live and earning streams!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to release track",
        variant: "destructive",
      });
    },
  });

  const createVideoMutation = useMutation({
    mutationFn: async (data: { trackId: string; budget: number }) => {
      const response = await apiRequest("POST", "/api/game/music-video", {
        userId: currentUserId,
        ...data,
      });
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      setSelectedTrackForVideo("");
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      toast({
        title: "Music Video Created!",
        description: "Your music video is now boosting your track!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create music video",
        variant: "destructive",
      });
    },
  });

  if (!profile) return null;

  const tracks = Array.isArray(profile.tracks) ? profile.tracks as Track[] : [];
  const unreleasedTracks = tracks.filter(track => !track.isReleased);
  const releasedTracks = tracks.filter(track => track.isReleased);
  const tracksWithoutVideos = releasedTracks.filter(track => !track.hasVideo);

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

  const handleReleaseTrack = (trackId: string) => {
    releaseTrackMutation.mutate(trackId);
  };

  const handleCreateVideo = (trackId: string, budget: number) => {
    if (profile.money < budget) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${budget} to create this music video`,
        variant: "destructive",
      });
      return;
    }
    createVideoMutation.mutate({ trackId, budget });
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold gradient-text text-center">Music Studio</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-2 overflow-x-auto">
        {[
          { id: 'create', label: 'Create', icon: Music },
          { id: 'unreleased', label: 'Unreleased', icon: Upload },
          { id: 'released', label: 'Released', icon: Play },
          { id: 'videos', label: 'Videos', icon: Video }
        ].map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'create' | 'unreleased' | 'released' | 'videos')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center ${
              activeTab === tab.id 
                ? 'game-electric-gradient text-white' 
                : 'bg-gray-600 text-white hover:bg-gray-500'
            }`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Create Track Section */}
      {activeTab === 'create' && (
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
      )}

      {/* Unreleased Tracks */}
      {activeTab === 'unreleased' && (
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
                    onClick={() => handleReleaseTrack(track.id)}
                    disabled={releaseTrackMutation.isPending}
                    className="game-green-gradient px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 flex items-center"
                    data-testid={`button-release-${track.id}`}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {releaseTrackMutation.isPending ? "Releasing..." : "Release"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Released Tracks */}
      {activeTab === 'released' && (
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Released Tracks</h3>
          {releasedTracks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No released tracks yet.</p>
          ) : (
            <div className="space-y-3">
              {releasedTracks.map((track) => (
                <div key={track.id} className="bg-game-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{track.title}</h4>
                    <div className="flex items-center text-game-gold text-sm">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      ${track.earnings || 0}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Released: {track.releaseDate}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Eye className="mr-1 h-4 w-4 text-blue-400" />
                      <span className="text-white">{track.views?.toLocaleString() || 0} views</span>
                    </div>
                    <div className="flex items-center">
                      <Play className="mr-1 h-4 w-4 text-green-400" />
                      <span className="text-white">{track.streams?.toLocaleString() || 0} streams</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="mr-1 h-4 w-4 text-red-400" />
                      <span className="text-white">{track.likes?.toLocaleString() || 0} likes</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="mr-1 h-4 w-4 text-purple-400" />
                      <span className="text-white">{track.hasVideo ? 'Has Video' : 'No Video'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Music Videos */}
      {activeTab === 'videos' && (
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Music Video Studio</h3>
          
          {/* Create Video Section */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">Create Music Video</h4>
            {tracksWithoutVideos.length === 0 ? (
              <p className="text-gray-400 text-sm">No tracks available for music videos.</p>
            ) : (
              <div className="space-y-4">
                <Select value={selectedTrackForVideo} onValueChange={setSelectedTrackForVideo}>
                  <SelectTrigger className="w-full bg-game-dark border border-gray-600 rounded-lg px-4 py-3 text-white">
                    <SelectValue placeholder="Select a track..." />
                  </SelectTrigger>
                  <SelectContent className="bg-game-dark border-gray-600">
                    {tracksWithoutVideos.map((track) => (
                      <SelectItem key={track.id} value={track.id} className="text-white hover:bg-game-card">
                        {track.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: "Low Budget ($500)", budget: 500, quality: "Basic" },
                    { label: "Medium Budget ($2000)", budget: 2000, quality: "Professional" },
                    { label: "High Budget ($5000)", budget: 5000, quality: "Premium" }
                  ].map((option) => (
                    <Button
                      key={option.budget}
                      onClick={() => handleCreateVideo(selectedTrackForVideo, option.budget)}
                      disabled={!selectedTrackForVideo || profile.money < option.budget || createVideoMutation.isPending}
                      className="game-electric-gradient px-4 py-3 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Video className="mr-2 h-4 w-4" />
                        {option.label}
                      </div>
                      <span className="text-xs bg-black bg-opacity-30 px-2 py-1 rounded">
                        {option.quality} Quality
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Videos */}
          <div>
            <h4 className="text-white font-semibold mb-3">Your Music Videos</h4>
            {releasedTracks.filter(track => track.hasVideo).length === 0 ? (
              <p className="text-gray-400 text-sm">No music videos created yet.</p>
            ) : (
              <div className="space-y-3">
                {releasedTracks.filter(track => track.hasVideo).map((track) => (
                  <div key={track.id} className="bg-game-dark rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-white font-semibold">{track.title} - Music Video</h5>
                      <div className="flex items-center text-game-gold text-sm">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        +{Math.floor((track.videoViews || 0) * 0.001)} Fame
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Eye className="mr-1 h-4 w-4 text-blue-400" />
                        <span className="text-white">{track.videoViews?.toLocaleString() || 0} views</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="mr-1 h-4 w-4 text-red-400" />
                        <span className="text-white">{Math.floor((track.videoViews || 0) * 0.05)} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}