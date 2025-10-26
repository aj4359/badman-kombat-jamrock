import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Download, Zap, Image as ImageIcon } from 'lucide-react';

const FIGHTERS = ['leroy', 'jordan', 'sifu', 'razor', 'rootsman', 'johnwick'];

const FIGHTER_NAMES: Record<string, string> = {
  leroy: 'Leroy "Rootsman" Zion',
  jordan: 'Jordan "Sound Master" Johnson',
  sifu: 'Sifu YK Leung PhD',
  razor: 'Razor "Cyber Samurai"',
  rootsman: 'Rootsman "Nature\'s Voice"',
  johnwick: 'John Wick "Baba Yaga"',
};

type GeneratedSpriteSheet = {
  fighterId: string;
  imageUrl: string;
};

export default function FighterGenerator() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFighter, setCurrentFighter] = useState('');
  const [generatedSheets, setGeneratedSheets] = useState<GeneratedSpriteSheet[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Auto-start generation if ?autostart=true parameter is present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autostart') === 'true' && !generating) {
      addLog('🤖 Auto-starting generation...');
      generateAllFighters();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateAllFighters = async () => {
    setGenerating(true);
    setProgress(0);
    setGeneratedSheets([]);
    setLogs([]);
    
    const totalSheets = FIGHTERS.length;
    let completed = 0;

    addLog(`🚀 Starting generation of ${totalSheets} sprite sheets (24 frames each)...`);
    addLog(`📐 Each sprite sheet: 1200x800px (4 rows × 6 columns of 200x200px frames)`);

    for (const fighterId of FIGHTERS) {
      setCurrentFighter(FIGHTER_NAMES[fighterId]);
      addLog(`\n🥊 Generating sprite sheet for ${FIGHTER_NAMES[fighterId]}...`);
      
      try {
        addLog(`  🎨 Creating 24-frame animation sprite sheet...`);
        
        const { data, error } = await supabase.functions.invoke('generate-fighter-sprite', {
          body: { 
            fighterId, 
            type: 'spritesheet' // New parameter to indicate sprite sheet generation
          }
        });

        if (error) {
          addLog(`  ❌ Error: ${error.message}`);
          toast.error(`Failed to generate ${fighterId} sprite sheet`, {
            description: error.message
          });
          completed++;
          setProgress((completed / totalSheets) * 100);
          continue;
        }

        if (data?.imageUrl) {
          setGeneratedSheets(prev => [...prev, { fighterId, imageUrl: data.imageUrl }]);
          addLog(`  ✅ Sprite sheet generated successfully!`);
          addLog(`  📊 Contains: idle, walk, jump, crouch, punches, kicks, block, hit, special moves`);
          
          // Auto-save to assets folder
          try {
            addLog(`  💾 Saving to src/assets/${fighterId}-sprite-sheet.png...`);
            
            // Convert base64 to blob and save
            const response = await fetch(data.imageUrl);
            const blob = await response.blob();
            
            // Create a proper file URL for download
            const file = new File([blob], `${fighterId}-sprite-sheet.png`, { type: 'image/png' });
            const objectUrl = URL.createObjectURL(file);
            
            // Trigger download to save to project
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = `${fighterId}-sprite-sheet.png`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);
            
            addLog(`  ✅ Saved to downloads! Move to src/assets/${fighterId}-sprite-sheet.png`);
            toast.success(`${FIGHTER_NAMES[fighterId]} saved`, {
              description: `Move ${fighterId}-sprite-sheet.png to src/assets/`
            });
          } catch (saveError) {
            addLog(`  ⚠️ Auto-save failed, use Download button instead`);
            console.error('Save error:', saveError);
          }
        }

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        addLog(`  ❌ Exception: ${errorMsg}`);
        toast.error(`Error generating ${fighterId} sprite sheet`, {
          description: errorMsg
        });
      }

      completed++;
      setProgress((completed / totalSheets) * 100);
      
      // Longer delay for sprite sheet generation
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setGenerating(false);
    addLog(`\n✨ Generation complete! ${generatedSheets.length}/${totalSheets} sprite sheets created.`);
    toast.success('Sprite sheet generation complete!', {
      description: `Generated ${generatedSheets.length} sprite sheets`
    });
  };

  const downloadAll = () => {
    generatedSheets.forEach(({ fighterId, imageUrl }) => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${fighterId}-sprite-sheet.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    
    toast.success('Downloading all sprite sheets', {
      description: `${generatedSheets.length} files`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            AI Sprite Sheet Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate Street Fighter-style sprite sheets (24 frames, 4×6 grid) using Lovable AI
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
              This will generate 6 sprite sheets (1 per fighter, 24 frames each in 4×6 grid at 1200×800px)
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
                disabled={generatedSheets.length === 0}
                variant="outline"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All ({generatedSheets.length})
              </Button>
            </div>

            {generating && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Generating {currentFighter} sprite sheet...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Sprite Sheets Grid */}
        {generatedSheets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Sprite Sheets ({generatedSheets.length}/6)</CardTitle>
              <CardDescription>24-frame animation sheets in 4×6 grid (1200×800px)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedSheets.map(({ fighterId, imageUrl }, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-muted rounded-lg overflow-hidden border-2 border-primary/20">
                      <img
                        src={imageUrl}
                        alt={`${fighterId}-sprite-sheet`}
                        className="w-full h-auto"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                    <p className="text-sm text-center font-medium">
                      {FIGHTER_NAMES[fighterId]}
                    </p>
                    <p className="text-xs text-center text-muted-foreground">
                      {fighterId}-sprite-sheet.png
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
