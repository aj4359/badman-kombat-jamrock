import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Download, Zap, Image as ImageIcon } from 'lucide-react';

const FIGHTERS = ['leroy', 'jordan', 'sifu', 'razor', 'rootsman', 'johnwick'];
const POSES = ['idle', 'walking', 'lightPunch', 'heavyPunch', 'kick', 'special', 'victory', 'hurt'];

const FIGHTER_NAMES: Record<string, string> = {
  leroy: 'Leroy "Rootsman" Zion',
  jordan: 'Jordan "Sound Master" Johnson',
  sifu: 'Sifu YK Leung PhD',
  razor: 'Razor "Cyber Samurai"',
  rootsman: 'Rootsman "Nature\'s Voice"',
  johnwick: 'John Wick "Baba Yaga"',
};

type GeneratedImage = {
  fighterId: string;
  pose: string;
  imageUrl: string;
};

export default function FighterGenerator() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFighter, setCurrentFighter] = useState('');
  const [currentPose, setCurrentPose] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const generateAllFighters = async () => {
    setGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    setLogs([]);
    
    const totalImages = FIGHTERS.length * POSES.length;
    let completed = 0;

    addLog(`🚀 Starting generation of ${totalImages} images...`);

    for (const fighterId of FIGHTERS) {
      addLog(`\n🥊 Generating ${FIGHTER_NAMES[fighterId]}...`);
      
      for (const pose of POSES) {
        setCurrentFighter(FIGHTER_NAMES[fighterId]);
        setCurrentPose(pose);
        
        try {
          addLog(`  🎨 Creating ${pose} pose...`);
          
          const { data, error } = await supabase.functions.invoke('generate-fighter-sprite', {
            body: { fighterId, pose }
          });

          if (error) {
            addLog(`  ❌ Error: ${error.message}`);
            toast.error(`Failed to generate ${fighterId}-${pose}`, {
              description: error.message
            });
            continue;
          }

          if (data?.imageUrl) {
            setGeneratedImages(prev => [...prev, { fighterId, pose, imageUrl: data.imageUrl }]);
            addLog(`  ✅ Generated successfully`);
          }

        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          addLog(`  ❌ Exception: ${errorMsg}`);
          toast.error(`Error generating ${fighterId}-${pose}`, {
            description: errorMsg
          });
        }

        completed++;
        setProgress((completed / totalImages) * 100);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setGenerating(false);
    addLog(`\n✨ Generation complete! ${generatedImages.length}/${totalImages} images created.`);
    toast.success('Fighter generation complete!', {
      description: `Generated ${generatedImages.length} images`
    });
  };

  const downloadAll = () => {
    generatedImages.forEach(({ fighterId, pose, imageUrl }) => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${fighterId}-${pose}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    
    toast.success('Downloading all images', {
      description: `${generatedImages.length} files`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            AI Fighter Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate photorealistic 3D renders for all 6 fighters using Lovable AI
          </p>
        </div>

        {/* Control Panel */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Generation Control
            </CardTitle>
            <CardDescription>
              This will generate 48 images (6 fighters × 8 poses each)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={generateAllFighters}
                disabled={generating}
                size="lg"
                className="flex-1"
              >
                {generating ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Generating... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Generate All Fighters
                  </>
                )}
              </Button>
              
              <Button
                onClick={downloadAll}
                disabled={generatedImages.length === 0}
                variant="outline"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All ({generatedImages.length})
              </Button>
            </div>

            {generating && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {currentFighter} - {currentPose}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Images Grid */}
        {generatedImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Images ({generatedImages.length}/48)</CardTitle>
              <CardDescription>Preview of AI-generated fighter poses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {generatedImages.map(({ fighterId, pose, imageUrl }, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden border border-primary/20">
                      <img
                        src={imageUrl}
                        alt={`${fighterId}-${pose}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground truncate">
                      {fighterId}-{pose}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Generation Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-green-400">
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-muted-foreground">
                  Click "Generate All Fighters" to start...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
