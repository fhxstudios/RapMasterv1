import { useGameState } from "@/hooks/use-game-state";

export default function SocialPage() {
  const { profile } = useGameState();

  if (!profile) return null;

  const socialStats = profile.socialStats as any;

  const socialApps = [
    { name: "RapGram", icon: "fab fa-instagram", gradient: "from-pink-500 to-purple-600" },
    { name: "RapTube", icon: "fab fa-youtube", gradient: "from-red-600 to-red-800" },
    { name: "Rapify", icon: "fab fa-spotify", gradient: "from-green-500 to-green-700" },
    { name: "RikTok", icon: "fab fa-tiktok", gradient: "from-blue-500 to-purple-600" },
    { name: "RapTube Music", icon: "fas fa-music", gradient: "from-orange-500 to-red-600" },
    { name: "RikiMedia", icon: "fab fa-wikipedia-w", gradient: "from-gray-600 to-gray-800" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Mobile Phone Frame */}
      <div className="bg-gray-900 rounded-3xl p-4 max-w-sm mx-auto shadow-2xl">
        <div className="bg-black rounded-2xl overflow-hidden">
          {/* Phone Status Bar */}
          <div className="bg-black px-4 py-2 flex justify-between items-center text-white text-xs">
            <span>9:41</span>
            <span>●●●</span>
            <span>100%</span>
          </div>
          
          {/* Social Media Apps Grid */}
          <div className="game-bg-gradient p-6">
            <div className="grid grid-cols-3 gap-6">
              {socialApps.map((app, index) => (
                <div key={app.name} className="text-center">
                  <div 
                    className={`w-14 h-14 bg-gradient-to-br ${app.gradient} rounded-xl mb-2 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
                    data-testid={`social-app-${app.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <i className={`${app.icon} text-white text-2xl`}></i>
                  </div>
                  <span className="text-white text-xs">{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Stats */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Social Media Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">RapGram Followers</span>
            <span className="text-white font-bold" data-testid="stat-rapgram-followers">
              {socialStats?.rapGramFollowers?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">RapTube Subscribers</span>
            <span className="text-white font-bold" data-testid="stat-raptube-subscribers">
              {socialStats?.rapTubeSubscribers?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total Streams</span>
            <span className="text-white font-bold" data-testid="stat-total-streams">
              {socialStats?.totalStreams?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Verified Status</span>
            <span className="text-white font-bold">
              {socialStats?.premiumVerified ? '⭐ Premium' : socialStats?.verified ? '✅ Verified' : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Preview */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Artist Profile</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Stage Name:</span>
            <span className="text-white font-bold">{profile.stageName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Age:</span>
            <span className="text-white font-bold">{profile.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Career Start:</span>
            <span className="text-white font-bold">2020</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Current Year:</span>
            <span className="text-white font-bold">{profile.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
