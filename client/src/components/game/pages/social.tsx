import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useGameState } from "@/hooks/use-game-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, MessageCircle, Share, Eye, TrendingUp, 
  Camera, Video, Music, Send, Clock, Star,
  Users, Play, Award
} from "lucide-react";
import type { Track, SocialMediaPost } from "@shared/schema";

export default function SocialPage() {
  const { profile, currentUserId, setProfile } = useGameState();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'feed' | 'post' | 'stats' | 'promote'>('feed');
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<'text' | 'photo' | 'track_announcement' | 'video_announcement'>('text');
  const [selectedTrack, setSelectedTrack] = useState("");
  const [engagementTimer, setEngagementTimer] = useState(0);

  // Real-time engagement simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setEngagementTimer(prev => prev + 1);
      // Simulate organic engagement growth every 10 seconds
      if (engagementTimer % 10 === 0 && profile) {
        simulateEngagement();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [engagementTimer, profile]);

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; type: string; trackId?: string }) => {
      const response = await apiRequest("POST", "/api/game/social/post", {
        userId: currentUserId,
        ...postData,
      });
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      setPostContent("");
      setSelectedTrack("");
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      toast({
        title: "Post Published!",
        description: "Your post is now live on social media!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const promoteTrackMutation = useMutation({
    mutationFn: async (data: { trackId: string; budget: number }) => {
      const response = await apiRequest("POST", "/api/game/social/promote", {
        userId: currentUserId,
        ...data,
      });
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      toast({
        title: "Promotion Started!",
        description: "Your track is now being promoted across social media!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to promote track",
        variant: "destructive",
      });
    },
  });

  const simulateEngagement = () => {
    // Simulate real-time engagement growth (this would be server-side in production)
    if (profile && profile.socialPosts) {
      const posts = profile.socialPosts as SocialMediaPost[];
      posts.forEach(post => {
        const growthRate = Math.random() * 0.1; // 0-10% growth
        post.likes += Math.floor(post.likes * growthRate);
        post.views += Math.floor(post.views * growthRate * 2);
        post.comments += Math.floor(post.comments * growthRate * 0.5);
      });
    }
  };

  if (!profile) return null;

  const socialStats = profile.socialStats as any;
  const socialPosts = Array.isArray(profile.socialPosts) ? profile.socialPosts as SocialMediaPost[] : [];
  const tracks = Array.isArray(profile.tracks) ? profile.tracks as Track[] : [];
  const releasedTracks = tracks.filter(track => track.isReleased);

  const handleCreatePost = () => {
    if (!postContent.trim() && postType === 'text') return;
    
    const postData: any = {
      content: postContent.trim(),
      type: postType,
    };

    if ((postType === 'track_announcement' || postType === 'video_announcement') && selectedTrack) {
      postData.trackId = selectedTrack;
    }

    createPostMutation.mutate(postData);
  };

  const handlePromoteTrack = (trackId: string, budget: number) => {
    if (profile.money < budget) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${budget} for this promotion`,
        variant: "destructive",
      });
      return;
    }
    promoteTrackMutation.mutate({ trackId, budget });
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'track_announcement': return <Music className="h-4 w-4" />;
      case 'video_announcement': return <Play className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold gradient-text text-center">Social Media Manager</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-2 overflow-x-auto">
        {[
          { id: 'feed', label: 'Feed', icon: Eye },
          { id: 'post', label: 'Create Post', icon: Send },
          { id: 'stats', label: 'Analytics', icon: TrendingUp },
          { id: 'promote', label: 'Promote', icon: Star }
        ].map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

      {/* Social Feed */}
      {activeTab === 'feed' && (
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Posts</h3>
          {socialPosts.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">No posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {socialPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="bg-game-dark rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-game-electric rounded-full flex items-center justify-center">
                      {getPostIcon(post.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-white font-semibold">{profile.stageName}</h4>
                        <span className="text-gray-400 text-xs">{post.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{post.content}</p>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center text-red-400">
                          <Heart className="mr-1 h-4 w-4" />
                          <span>{post.likes?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center text-blue-400">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          <span>{post.comments?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center text-green-400">
                          <Share className="mr-1 h-4 w-4" />
                          <span>{post.shares?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center text-purple-400">
                          <Eye className="mr-1 h-4 w-4" />
                          <span>{post.views?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Post */}
      {activeTab === 'post' && (
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Create New Post</h3>
          <div className="space-y-4">
            <Select value={postType} onValueChange={(value: any) => setPostType(value)}>
              <SelectTrigger className="w-full bg-game-dark border border-gray-600 rounded-lg px-4 py-3 text-white">
                <SelectValue placeholder="Select post type..." />
              </SelectTrigger>
              <SelectContent className="bg-game-dark border-gray-600">
                <SelectItem value="text" className="text-white hover:bg-game-card">
                  📝 Text Post
                </SelectItem>
                <SelectItem value="photo" className="text-white hover:bg-game-card">
                  📷 Photo Post
                </SelectItem>
                <SelectItem value="track_announcement" className="text-white hover:bg-game-card">
                  🎵 Track Announcement
                </SelectItem>
                <SelectItem value="video_announcement" className="text-white hover:bg-game-card">
                  🎬 Music Video Announcement
                </SelectItem>
              </SelectContent>
            </Select>

            {(postType === 'track_announcement' || postType === 'video_announcement') && (
              <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                <SelectTrigger className="w-full bg-game-dark border border-gray-600 rounded-lg px-4 py-3 text-white">
                  <SelectValue placeholder="Select track..." />
                </SelectTrigger>
                <SelectContent className="bg-game-dark border-gray-600">
                  {releasedTracks.map((track) => (
                    <SelectItem key={track.id} value={track.id} className="text-white hover:bg-game-card">
                      {track.title} {postType === 'video_announcement' && !track.hasVideo && "(No Video)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Textarea
              placeholder={
                postType === 'text' ? "What's on your mind?" :
                postType === 'photo' ? "Share what's happening..." :
                postType === 'track_announcement' ? "Announce your new track..." :
                "Share your music video..."
              }
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full bg-game-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-game-electric focus:outline-none min-h-[100px]"
            />

            <Button
              onClick={handleCreatePost}
              disabled={(!postContent.trim() && postType === 'text') || 
                       ((postType === 'track_announcement' || postType === 'video_announcement') && !selectedTrack) ||
                       createPostMutation.isPending}
              className="w-full game-electric-gradient hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center"
            >
              <Send className="mr-2 h-5 w-5" />
              {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="bg-game-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Social Media Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-game-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">RapGram Followers</span>
                  <Users className="h-4 w-4 text-pink-400" />
                </div>
                <p className="text-white text-2xl font-bold">{socialStats?.rapGramFollowers?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-game-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">RapTube Subscribers</span>
                  <Play className="h-4 w-4 text-red-400" />
                </div>
                <p className="text-white text-2xl font-bold">{socialStats?.rapTubeSubscribers?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-game-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Total Streams</span>
                  <Music className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-white text-2xl font-bold">{socialStats?.totalStreams?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-game-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Verification</span>
                  <Award className="h-4 w-4 text-yellow-400" />
                </div>
                <p className="text-white text-lg font-bold">
                  {socialStats?.premiumVerified ? 'Premium ⭐' : socialStats?.verified ? 'Verified ✅' : 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* Engagement Overview */}
          <div className="bg-game-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Engagement</h3>
            {socialPosts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No posts to analyze yet.</p>
            ) : (
              <div className="space-y-3">
                {socialPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="bg-game-dark rounded-lg p-3">
                    <p className="text-white text-sm font-semibold mb-2">{post.content.substring(0, 50)}...</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-red-400">{post.likes} ❤️</span>
                      <span className="text-blue-400">{post.comments} 💬</span>
                      <span className="text-green-400">{post.shares} 🔄</span>
                      <span className="text-purple-400">{post.views} 👁️</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promote Tracks */}
      {activeTab === 'promote' && (
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Promote Your Music</h3>
          {releasedTracks.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">No released tracks to promote yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {releasedTracks.map((track) => (
                <div key={track.id} className="bg-game-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">{track.title}</h4>
                    <div className="text-game-gold text-sm">
                      {track.views?.toLocaleString() || 0} views
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "Basic Promotion ($100)", budget: 100, boost: "2x reach for 24h" },
                      { label: "Premium Promotion ($500)", budget: 500, boost: "5x reach for 1 week" },
                      { label: "Viral Campaign ($2000)", budget: 2000, boost: "10x reach for 1 month" }
                    ].map((option) => (
                      <Button
                        key={option.budget}
                        onClick={() => handlePromoteTrack(track.id, option.budget)}
                        disabled={profile.money < option.budget || promoteTrackMutation.isPending}
                        className="game-electric-gradient px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          {option.label}
                        </div>
                        <span className="text-xs bg-black bg-opacity-30 px-2 py-1 rounded">
                          {option.boost}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}