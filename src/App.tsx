import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CharacterSelect from "./pages/CharacterSelect";
import Game from "./pages/Game";
import ArcadeMode from "./pages/ArcadeMode";
import Teaser from "./pages/Teaser";
import TeaserCreator from "./pages/TeaserCreator";
import TrailerGenerator from "./pages/TrailerGenerator";
import GameOverviewRecorder from "./pages/GameOverviewRecorder";
import JohnWickTrailer from "./pages/JohnWickTrailer";
import DroneTrailerGenerator from "./pages/DroneTrailerGenerator";
import JohnWickDroneTrailer from "./pages/JohnWickDroneTrailer";
import Rankings from "./pages/Rankings";
import LiveStream from "./pages/LiveStream";
import NotFound from "./pages/NotFound";
import FighterGenerator from "./pages/FighterGenerator";
import Tutorial from "./pages/Tutorial";
import { EnhancedVSScreen } from "./components/EnhancedVSScreen";
import BadManKombatUltimate3D from "./components/BadManKombatUltimate3D";
import ErrorBoundary from "./components/ErrorBoundary";
import { NavigationMenu } from "./components/NavigationMenu";
import MarvelRivalsLanding from "./components/MarvelRivalsLanding";
import BadManKombatLandingPage from "./components/BadManKombatLandingPage";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <Suspense fallback={<div className="min-h-screen bg-black" />}>
                  <Index />
                </Suspense>
              } 
            />
            <Route path="/marvel" element={<MarvelRivalsLanding />} />
            <Route path="/landing" element={<BadManKombatLandingPage />} />
            <Route path="/character-select" element={<CharacterSelect />} />
            <Route path="/vs-screen" element={<EnhancedVSScreen />} />
            <Route path="/game" element={<Game />} />
            <Route path="/arcade" element={<ArcadeMode />} />
            <Route path="/teaser" element={<Teaser />} />
            <Route path="/trailer-generator" element={<TrailerGenerator />} />
            <Route path="/drone-trailer" element={<DroneTrailerGenerator />} />
            <Route path="/3d-ultimate" element={<BadManKombatUltimate3D />} />
            <Route path="/teaser-creator" element={<TeaserCreator />} />
            <Route path="/john-wick-trailer" element={<JohnWickTrailer />} />
            <Route path="/johnwick-drone" element={<JohnWickDroneTrailer />} />
            <Route path="/game-overview" element={<GameOverviewRecorder />} />
            <Route path="/live-stream" element={<LiveStream />} />
            <Route path="/fighter-generator" element={<FighterGenerator />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/rankings" element={<Rankings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <NavigationMenu />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
