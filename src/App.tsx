import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import MarvelRivalsLanding from "./components/MarvelRivalsLanding";
import BadManKombatLandingPage from "./components/BadManKombatLandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CharacterSelect from "./pages/CharacterSelect";
import Game from "./pages/Game";
import { EnhancedVSScreen } from "./components/EnhancedVSScreen";
import ArcadeMode from "./pages/ArcadeMode";
import Teaser from "./pages/Teaser";
import TrailerGenerator from "./pages/TrailerGenerator";
import BadManKombatUltimate3D from "./components/BadManKombatUltimate3D";
import TeaserCreator from "./pages/TeaserCreator";
import JohnWickTrailer from "./pages/JohnWickTrailer";
import GameOverviewRecorder from "./pages/GameOverviewRecorder";

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
            <Route path="/3d-ultimate" element={<BadManKombatUltimate3D />} />
            <Route path="/teaser-creator" element={<TeaserCreator />} />
            <Route path="/john-wick-trailer" element={<JohnWickTrailer />} />
            <Route path="/game-overview" element={<GameOverviewRecorder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
