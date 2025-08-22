import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameStateProvider } from "@/hooks/use-game-state";
import SplashScreen from "@/pages/splash";
import MainMenu from "@/pages/main-menu";
import CharacterCreation from "@/pages/character-creation";
import GameInterface from "@/pages/game-interface";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/menu" component={MainMenu} />
      <Route path="/create" component={CharacterCreation} />
      <Route path="/game" component={GameInterface} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameStateProvider>
          <Toaster />
          <Router />
        </GameStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
