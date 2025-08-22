import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { GameProfile } from "@shared/schema";

interface GameState {
  currentUserId: string | null;
  profile: GameProfile | null;
  isLoading: boolean;
  setProfile: (profile: GameProfile | null) => void;
  setCurrentUserId: (userId: string | null) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const GameStateContext = createContext<GameState | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveToLocalStorage = () => {
    if (profile && currentUserId) {
      localStorage.setItem("rapmaster_profile", JSON.stringify(profile));
      localStorage.setItem("rapmaster_userId", currentUserId);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedProfile = localStorage.getItem("rapmaster_profile");
      const savedUserId = localStorage.getItem("rapmaster_userId");
      
      if (savedProfile && savedUserId) {
        setProfile(JSON.parse(savedProfile));
        setCurrentUserId(savedUserId);
      }
    } catch (error) {
      console.error("Failed to load game state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    if (profile && currentUserId) {
      saveToLocalStorage();
    }
  }, [profile, currentUserId]);

  const contextValue: GameState = {
    currentUserId,
    profile,
    isLoading,
    setProfile,
    setCurrentUserId,
    saveToLocalStorage,
    loadFromLocalStorage,
  };

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within GameStateProvider");
  }
  return context;
}
