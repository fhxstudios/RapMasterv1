import { useState } from "react";
import { useLocation } from "wouter";
import { useGameState } from "@/hooks/use-game-state";
import { GameEngine } from "@/lib/game-engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Rocket } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import avatar1 from "@assets/Memoji-03_1755893074221.png";
import avatar2 from "@assets/Memoji-04_1755893074302.png";
import avatar3 from "@assets/Memoji-09_1755893074360.png";

export default function CharacterCreation() {
  const [, setLocation] = useLocation();
  const { setProfile, setCurrentUserId } = useGameState();
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [stageName, setStageName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const avatarOptions = [
    { id: 1, name: "Glasses Guy", image: avatar1 },
    { id: 2, name: "Clean Cut", image: avatar2 },
    { id: 3, name: "Beard Boss", image: avatar3 },
  ];

  const cityOptions = [
    { value: "los_angeles", name: "Los Angeles", bonus: "+Fame Boost" },
    { value: "new_york", name: "New York", bonus: "+Collaboration Chance" },
    { value: "chicago", name: "Chicago", bonus: "+Street Cred" },
  ];

  const handleGenerateRandomName = () => {
    setStageName(GameEngine.generateRandomStageName());
  };

  const handleStartCareer = async () => {
    if (!stageName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stage name",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCity) {
      toast({
        title: "Error", 
        description: "Please select a starting city",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create temporary user ID for demo
      const userId = `user-${Date.now()}`;
      
      const profileData = {
        userId,
        stageName: stageName.trim(),
        avatar: selectedAvatar,
        city: selectedCity,
        age: 20,
        year: 2020,
        money: 100,
        energy: 50,
        fame: 0,
        reputation: 0,
        fans: 0,
        netWorth: 100,
        skills: {
          rapping: 1,
          production: 1,
          socialMedia: 1,
          performance: 1,
          business: 1
        },
        inventory: [],
        tracks: [],
        albums: [],
        socialStats: {
          rapGramFollowers: 0,
          rapTubeSubscribers: 0,
          totalStreams: 0,
          verified: false,
          premiumVerified: false
        }
      };

      const response = await apiRequest("POST", "/api/game/profile", profileData);
      const profile = await response.json();
      
      setProfile(profile);
      setCurrentUserId(userId);
      setLocation("/game");
      
      toast({
        title: "Success!",
        description: "Your rap career has begun!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create character",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={() => setLocation("/menu")}
          variant="ghost"
          size="icon"
          className="p-2 bg-game-card rounded-lg text-white hover:bg-game-card/80"
          data-testid="button-back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold gradient-text">Create Your Artist</h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Avatar Selection */}
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Choose Your Avatar</h3>
          <div className="grid grid-cols-3 gap-4">
            {avatarOptions.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`bg-game-card rounded-xl p-4 cursor-pointer transform hover:scale-105 transition-all border-2 ${
                  selectedAvatar === avatar.id ? 'border-game-gold' : 'border-transparent'
                }`}
                data-testid={`avatar-option-${avatar.id}`}
              >
                <div className="w-full h-20 rounded-lg flex items-center justify-center bg-white">
                  <img 
                    src={avatar.image} 
                    alt={avatar.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <p className="text-xs text-center mt-2 text-white">{avatar.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Name Input */}
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Stage Name</h3>
          <Input 
            type="text" 
            placeholder="Enter your stage name..."
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
            className="w-full bg-game-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-game-electric focus:outline-none"
            data-testid="input-stage-name"
          />
          <Button 
            onClick={handleGenerateRandomName}
            variant="ghost"
            className="mt-3 text-sm text-game-gold hover:text-yellow-300 transition-colors p-0 h-auto"
            data-testid="button-generate-name"
          >
            Generate Random Name
          </Button>
        </div>

        {/* City Selection */}
        <div className="bg-game-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Starting City</h3>
          <RadioGroup value={selectedCity} onValueChange={setSelectedCity}>
            <div className="space-y-3">
              {cityOptions.map((city) => (
                <div key={city.value} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={city.value} 
                    id={city.value}
                    className="text-game-electric"
                    data-testid={`radio-city-${city.value}`}
                  />
                  <Label htmlFor={city.value} className="text-white cursor-pointer">
                    {city.name} <span className="text-game-gold text-sm">({city.bonus})</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Profile Preview */}
        <div className="game-electric-gradient rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Profile Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-200">Age:</span>
              <span className="text-white font-semibold">20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-200">Year:</span>
              <span className="text-white font-semibold">2020</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-200">Fame ⭐:</span>
              <span className="text-white font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-200">Reputation 🎭:</span>
              <span className="text-white font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-200">Fans 👥:</span>
              <span className="text-white font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-200">Net Worth 💵:</span>
              <span className="text-white font-semibold">$0</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button 
          onClick={handleStartCareer}
          disabled={isLoading}
          className="w-full game-gold-gradient hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 glow-effect"
          data-testid="button-start-career"
        >
          <Rocket className="mr-3 h-5 w-5" />
          {isLoading ? "Creating..." : "Start Career"}
        </Button>
      </div>
    </div>
  );
}
