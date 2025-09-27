import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StreetFighterShowcase = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Card className="bg-gradient-to-br from-neon-cyan/10 to-neon-green/10 border-neon-cyan/30">
        <CardHeader>
          <CardTitle className="text-neon-cyan font-retro">
            🥊 Enhanced Fighter Design
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span>Street Fighter proportions (128x96 sprites)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span>Muscular builds with iconic stances</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span>Authentic character personalities</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span>Enhanced visual effects & auras</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-neon-pink/10 to-neon-orange/10 border-neon-pink/30">
        <CardHeader>
          <CardTitle className="text-neon-pink font-retro">
            ⚡ Combat System Upgrade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-orange rounded-full animate-pulse" />
            <span>Authentic Street Fighter projectiles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-orange rounded-full animate-pulse" />
            <span>Enhanced hit effects & screen shake</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-orange rounded-full animate-pulse" />
            <span>Character-specific special moves</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-orange rounded-full animate-pulse" />
            <span>Street Fighter-style combos</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 border-neon-purple/30">
        <CardHeader>
          <CardTitle className="text-neon-purple font-retro">
            🌟 Character Roster
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between">
              <span className="text-neon-cyan">Jordan "Sound Master"</span>
              <span className="text-muted-foreground">DJ Fighter</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neon-orange">Sifu "Kung Fu Master"</span>
              <span className="text-muted-foreground">Martial Artist</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neon-green">Leroy "Cyber Rasta"</span>
              <span className="text-muted-foreground">Tech Warrior</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neon-pink">Razor "Cyber Samurai"</span>
              <span className="text-muted-foreground">Cyber Ninja</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neon-purple">Rootsman "Mystic"</span>
              <span className="text-muted-foreground">Nature Warrior</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-neon-green/10 to-neon-yellow/10 border-neon-green/30">
        <CardHeader>
          <CardTitle className="text-neon-green font-retro">
            🎮 Street Fighter Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-yellow rounded-full animate-pulse" />
            <span>Hadoken-style energy projectiles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-yellow rounded-full animate-pulse" />
            <span>Crowd atmosphere & stadium effects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-yellow rounded-full animate-pulse" />
            <span>Super meter & special move systems</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-yellow rounded-full animate-pulse" />
            <span>Professional arcade aesthetics</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};