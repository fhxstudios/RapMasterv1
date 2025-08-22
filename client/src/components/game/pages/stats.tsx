import { useGameState } from "@/hooks/use-game-state";
import type { Track, Album } from "@shared/schema";

export default function StatsPage() {
  const { profile } = useGameState();

  if (!profile) return null;

  const tracks = Array.isArray(profile.tracks) ? profile.tracks as Track[] : [];
  const albums = Array.isArray(profile.albums) ? profile.albums as Album[] : [];
  
  const releasedTracks = tracks.filter(track => track.isReleased);
  const careerLength = profile.year - 2020;

  const statCards = [
    { 
      value: profile.fame, 
      label: "Fame ⭐", 
      gradient: "from-game-gold to-yellow-600",
      testId: "stat-fame-card"
    },
    { 
      value: profile.reputation, 
      label: "Reputation 🎭", 
      gradient: "from-game-electric to-purple-600",
      testId: "stat-reputation-card"
    },
    { 
      value: profile.fans, 
      label: "Fans 👥", 
      gradient: "from-game-green to-green-600",
      testId: "stat-fans-card"
    },
    { 
      value: `$${profile.netWorth}`, 
      label: "Net Worth 💵", 
      gradient: "from-purple-600 to-pink-600",
      testId: "stat-networth-card"
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold gradient-text text-center">Statistics</h2>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat) => (
          <div 
            key={stat.label}
            className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-6 text-center`}
            data-testid={stat.testId}
          >
            <div className="text-3xl font-bold text-white">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-white text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Career Summary */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Career Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Tracks Released</span>
            <span className="text-white font-bold" data-testid="career-tracks-released">
              {releasedTracks.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Albums Released</span>
            <span className="text-white font-bold" data-testid="career-albums-released">
              {albums.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Music Videos</span>
            <span className="text-white font-bold" data-testid="career-music-videos">
              0
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Career Length</span>
            <span className="text-white font-bold" data-testid="career-length">
              {careerLength} years
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Current Age</span>
            <span className="text-white font-bold" data-testid="current-age">
              {profile.age} years
            </span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-game-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {profile.fame >= 100 && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-game-gold rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⭐</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Rising Star</p>
                <p className="text-gray-400 text-xs">Reached 100 Fame!</p>
              </div>
            </div>
          )}
          
          {profile.money >= 1000 && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-game-green rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💵</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Big Money</p>
                <p className="text-gray-400 text-xs">Earned $1,000!</p>
              </div>
            </div>
          )}

          {tracks.length >= 1 && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-game-electric rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🎵</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">First Track</p>
                <p className="text-gray-400 text-xs">Created your first track!</p>
              </div>
            </div>
          )}

          {profile.fame === 0 && profile.money < 1000 && tracks.length === 0 && (
            <div className="text-gray-400 text-center py-4">
              No achievements yet. Keep working on your career!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
