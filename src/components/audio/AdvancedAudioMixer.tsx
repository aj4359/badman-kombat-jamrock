import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Music, Disc3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  name: string;
  genre: string;
  file: string;
  bpm: number;
  mood: 'action' | 'chill' | 'classic' | 'modern';
  artist: string;
}

interface AdvancedAudioMixerProps {
  onVolumeChange?: (volume: number) => void;
  onTrackChange?: (track: Track) => void;
  className?: string;
}

const JAMAICAN_TRACKS: Track[] = [
  {
    id: 'bmk-champion',
    name: 'Champion Loop',
    genre: 'Dancehall',
    file: '/assets/audio/bmk-champion-loop.mp3',
    bpm: 140,
    mood: 'action',
    artist: 'BadMan Kombat'
  },
  {
    id: 'shaw-intro',
    name: 'Shaw Brothers Intro',
    genre: 'Cinematic',
    file: '/assets/audio/shaw-brothers-intro.mp3',
    bpm: 120,
    mood: 'classic',
    artist: 'Classic Cinema'
  },
  {
    id: 'bmk-soundtrack',
    name: 'Main Theme',
    genre: 'Fusion',
    file: '/assets/bmk-soundtrack.mp3',
    bpm: 128,
    mood: 'chill',
    artist: 'BadMan Kombat'
  },
  {
    id: 'riddim-1',
    name: 'Digital Riddim',
    genre: 'Dancehall',
    file: '/assets/audio/dancehall-riddim-1.mp3',
    bpm: 145,
    mood: 'modern',
    artist: 'Sound System'
  },
  {
    id: 'riddim-2',
    name: 'Reggae Fusion',
    genre: 'Reggae',
    file: '/assets/audio/dancehall-riddim-2.mp3',
    bpm: 135,
    mood: 'chill',
    artist: 'Yard Vibes'
  },
  {
    id: 'sound-drop',
    name: 'Sound System Drop',
    genre: 'Dancehall',
    file: '/assets/audio/sound-system-drop.mp3',
    bpm: 150,
    mood: 'action',
    artist: 'DJ Selecta'
  }
];

export const AdvancedAudioMixer: React.FC<AdvancedAudioMixerProps> = ({
  onVolumeChange,
  onTrackChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(JAMAICAN_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState({
    master: 70,
    music: 80,
    effects: 90,
    voice: 85
  });
  const [isMuted, setIsMuted] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [crossfadeTime, setCrossfadeTime] = useState(2);

  const filteredTracks = selectedMood === 'all' 
    ? JAMAICAN_TRACKS 
    : JAMAICAN_TRACKS.filter(track => track.mood === selectedMood);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    onTrackChange?.(track);
  };

  const handleVolumeChange = (type: keyof typeof volumes, value: number) => {
    setVolumes(prev => {
      const newVolumes = { ...prev, [type]: value };
      if (type === 'master' || type === 'music') {
        onVolumeChange?.(newVolumes.master * newVolumes.music / 10000);
      }
      return newVolumes;
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    onVolumeChange?.(isMuted ? volumes.master * volumes.music / 10000 : 0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    handleTrackSelect(filteredTracks[nextIndex]);
  };

  const previousTrack = () => {
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length;
    handleTrackSelect(filteredTracks[prevIndex]);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'action': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'chill': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'classic': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'modern': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <>
      {/* Floating Music Control */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-gradient-jamaica hover:scale-110 transition-all duration-300 shadow-neon-green"
          size="icon"
        >
          <Music className="w-6 h-6" />
        </Button>
      )}

      {/* Advanced Audio Mixer Panel */}
      {isOpen && (
        <Card className={cn(
          'fixed bottom-6 right-6 z-50 w-96 max-h-[600px] overflow-y-auto',
          'bg-background/95 backdrop-blur border-2 border-jamaica-green/50 shadow-neon-green',
          className
        )}>
          <CardHeader className="bg-gradient-jamaica text-background p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Disc3 className="w-6 h-6 animate-spin-slow" />
                <div>
                  <CardTitle className="text-lg font-retro">🎵 Yard Mix</CardTitle>
                  <p className="text-sm opacity-90">Professional Audio Control</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-background hover:bg-background/20"
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-6">
            {/* Current Track Display */}
            <div className="bg-muted/50 rounded-lg p-4 border border-jamaica-green/30">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-retro font-bold text-sm">{currentTrack.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {currentTrack.artist} • {currentTrack.genre} • {currentTrack.bpm} BPM
                  </p>
                </div>
                <Badge className={getMoodColor(currentTrack.mood)}>
                  {currentTrack.mood.toUpperCase()}
                </Badge>
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button onClick={previousTrack} variant="outline" size="sm">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={togglePlay} 
                  className="bg-jamaica-green hover:bg-jamaica-green/80"
                  size="sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button onClick={nextTrack} variant="outline" size="sm">
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={toggleMute} 
                  variant="outline" 
                  size="sm"
                  className={isMuted ? 'text-red-500' : ''}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Volume Controls */}
            <div className="space-y-4">
              <h4 className="font-retro font-bold text-sm text-jamaica-yellow">Volume Mixing</h4>
              
              {Object.entries(volumes).map(([type, value]) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-retro uppercase">
                      {type} {type === 'master' ? '🎛️' : type === 'music' ? '🎵' : type === 'effects' ? '🔊' : '🎤'}
                    </label>
                    <span className="text-xs text-muted-foreground">{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(values) => handleVolumeChange(type as keyof typeof volumes, values[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Crossfade Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-retro uppercase">Crossfade Time ⚡</label>
                <span className="text-xs text-muted-foreground">{crossfadeTime}s</span>
              </div>
              <Slider
                value={[crossfadeTime]}
                onValueChange={(values) => setCrossfadeTime(values[0])}
                min={0.5}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Mood Filter */}
            <div className="space-y-3">
              <h4 className="font-retro font-bold text-sm text-jamaica-yellow">Vibes Filter</h4>
              <div className="flex flex-wrap gap-2">
                {['all', 'action', 'chill', 'classic', 'modern'].map(mood => (
                  <Button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    variant={selectedMood === mood ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'text-xs font-retro',
                      selectedMood === mood && 'bg-jamaica-green hover:bg-jamaica-green/80'
                    )}
                  >
                    {mood.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Track Selection */}
            <div className="space-y-3">
              <h4 className="font-retro font-bold text-sm text-jamaica-yellow">Track Selection</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredTracks.map(track => (
                  <button
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    className={cn(
                      'w-full p-3 rounded-lg border text-left transition-all duration-200',
                      'hover:bg-muted/50 hover:border-jamaica-green/50',
                      currentTrack.id === track.id 
                        ? 'bg-jamaica-green/20 border-jamaica-green/70' 
                        : 'bg-muted/20 border-muted'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-retro font-bold text-sm">{track.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {track.artist} • {track.genre}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getMoodColor(track.mood)} variant="outline">
                          {track.mood}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{track.bpm} BPM</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};