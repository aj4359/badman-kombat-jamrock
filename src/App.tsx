import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BadManKombatLandingPage />} />
          <Route path="/original-home" element={<Index />} />
          <Route path="/character-select" element={<CharacterSelect />} />
          <Route path="/vs-screen" element={<EnhancedVSScreen />} />
          <Route path="/game" element={<Game />} />
          <Route path="/arcade" element={<ArcadeMode />} />
          <Route path="/teaser" element={<Teaser />} />
          <Route path="/trailer-generator" element={<TrailerGenerator />} />
          <Route path="/3d-ultimate" element={<BadManKombatUltimate3D />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
