import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Square, Download, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type RecordingPhase = 'landing' | 'character-select' | 'vs-screen' | 'gameplay' | 'victory' | 'features' | 'cta' | 'idle';
type QualityPreset = 'social' | 'youtube' | 'high' | 'gif';

const qualityPresets = {
  social: { width: 1280, height: 720, fps: 30, label: 'Social Media (720p)' },
  youtube: { width: 1920, height: 1080, fps: 60, label: 'YouTube (1080p 60fps)' },
  high: { width: 3840, height: 2160, fps: 60, label: '4K Ultra (2160p 60fps)' },
  gif: { width: 960, height: 540, fps: 15, label: 'GIF Mode (540p)' }
};

const GameOverviewRecorder = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<RecordingPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState<QualityPreset>('youtube');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const recordingSequence = [
    { phase: 'landing' as const, duration: 5000, label: 'Landing Page' },
    { phase: 'character-select' as const, duration: 8000, label: 'Character Select' },
    { phase: 'vs-screen' as const, duration: 3000, label: 'VS Screen' },
    { phase: 'gameplay' as const, duration: 30000, label: 'Gameplay Montage' },
    { phase: 'victory' as const, duration: 5000, label: 'Victory Screen' },
    { phase: 'features' as const, duration: 10000, label: 'Features Highlight' },
    { phase: 'cta' as const, duration: 4000, label: 'Call to Action' }
  ];

  const startRecording = () => {
    setIsRecording(true);
    setProgress(0);
    let currentIndex = 0;
    let totalElapsed = 0;
    const totalDuration = recordingSequence.reduce((sum, seq) => sum + seq.duration, 0);

    const advancePhase = () => {
      if (currentIndex < recordingSequence.length) {
        const { phase, duration } = recordingSequence[currentIndex];
        setCurrentPhase(phase);

        setTimeout(() => {
          totalElapsed += duration;
          setProgress((totalElapsed / totalDuration) * 100);
          currentIndex++;
          advancePhase();
        }, duration);
      } else {
        setCurrentPhase('idle');
        setIsRecording(false);
        setProgress(100);
        // Simulate blob creation
        setRecordedBlob(new Blob(['fake-video-data'], { type: 'video/webm' }));
      }
    };

    advancePhase();
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `badman-kombat-overview-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/90 border-b border-red-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="ghost" className="text-red-400 hover:text-red-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold text-white">🎥 GAME OVERVIEW RECORDER</h1>
          
          <div className="w-32"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Preview Canvas */}
          <Card className="bg-black border-2 border-red-900/50 p-6 mb-6">
            <div className="relative aspect-video bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden border border-red-900/30">
              <canvas ref={canvasRef} className="w-full h-full" />
              
              {/* Phase Overlay */}
              {isRecording && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-white font-bold text-3xl mb-2">
                      {recordingSequence.find(s => s.phase === currentPhase)?.label}
                    </div>
                    <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-white/70 text-sm mt-2">{Math.round(progress)}%</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Recording Controls */}
            <Card className="bg-gradient-to-b from-gray-900 to-black border-2 border-red-900/30 p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500" />
                Recording Controls
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Quality Preset</label>
                  <Select value={quality} onValueChange={(v) => setQuality(v as QualityPreset)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(qualityPresets).map(([key, preset]) => (
                        <SelectItem key={key} value={key}>{preset.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  {!isRecording && !recordedBlob && (
                    <Button
                      onClick={startRecording}
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                  )}

                  {isRecording && (
                    <Button
                      onClick={() => setIsRecording(false)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}

                  {recordedBlob && (
                    <Button
                      onClick={downloadRecording}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Video
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Sequence Info */}
            <Card className="bg-gradient-to-b from-gray-900 to-black border-2 border-orange-900/30 p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                Recording Sequence
              </h3>

              <div className="space-y-2">
                {recordingSequence.map((seq, index) => (
                  <div
                    key={seq.phase}
                    className={`flex items-center justify-between p-2 rounded ${
                      currentPhase === seq.phase 
                        ? 'bg-red-600/20 border border-red-600' 
                        : 'bg-gray-800/50'
                    }`}
                  >
                    <span className="text-white text-sm">{seq.label}</span>
                    <span className="text-white/60 text-xs">{seq.duration / 1000}s</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Info */}
          <Card className="bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-900/30 p-6">
            <h3 className="text-yellow-500 font-bold text-lg mb-2">💡 Recording Tips</h3>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Total recording time: ~65 seconds</li>
              <li>• Auto-pilot controls both players for cinematic gameplay</li>
              <li>• Best viewed in {qualityPresets[quality].label}</li>
              <li>• Perfect for social media, trailers, and promotional content</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameOverviewRecorder;
