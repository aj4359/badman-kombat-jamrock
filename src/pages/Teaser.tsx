import React from 'react';
import { CinematicTeaser } from '@/components/CinematicTeaser';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Teaser = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-cyber">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Game
        </Button>
      </div>

      <CinematicTeaser />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-neon-pink/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-neon-cyan/20 blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-neon-green/20 blur-2xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default Teaser;