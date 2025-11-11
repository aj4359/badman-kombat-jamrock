import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";

const SpriteGenerator = () => {
  const [characterName, setCharacterName] = useState("");
  const [style, setStyle] = useState("classic 90s Street Fighter II pixel art, vibrant 16-bit colors");
  const [fighterType, setFighterType] = useState("balanced martial artist");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSprite = async () => {
    if (!characterName.trim()) {
      toast.error("Please enter a character name");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-fighter-sprite-ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            characterName,
            style,
            fighterType,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate sprite");
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      toast.success("Fighter sprite generated!");
    } catch (error) {
      console.error("Error generating sprite:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate sprite");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSprite = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${characterName.toLowerCase().replace(/\s+/g, '-')}-sprite.png`;
    link.click();
  };

  const presetFighters = [
    { name: "Leroy", type: "Jamaican street fighter with dreadlocks", style: "classic 90s arcade pixel art" },
    { name: "Jordan", type: "Basketball player martial artist", style: "Street Fighter III pixel art style" },
    { name: "Razor", type: "Quick striking boxer", style: "16-bit fighting game pixel art" },
    { name: "Sifu", type: "Traditional kung fu master", style: "classic arcade fighter pixel art" },
    { name: "Rootsman", type: "Jamaican reggae warrior", style: "vibrant Street Fighter style" },
    { name: "John Wick", type: "Tactical assassin fighter", style: "modern pixel art fighting game" },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Street Fighter Sprite Generator</h1>
          <p className="text-muted-foreground">Generate professional pixel art fighters using AI</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Character Details</CardTitle>
              <CardDescription>Describe your fighter to generate a sprite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="characterName">Character Name</Label>
                <Input
                  id="characterName"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="e.g., Thunder Fist"
                />
              </div>

              <div>
                <Label htmlFor="fighterType">Fighter Type & Description</Label>
                <Textarea
                  id="fighterType"
                  value={fighterType}
                  onChange={(e) => setFighterType(e.target.value)}
                  placeholder="e.g., muscular karate master with spiky hair"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="style">Art Style</Label>
                <Textarea
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="e.g., classic 90s Street Fighter II pixel art"
                  rows={2}
                />
              </div>

              <Button 
                onClick={generateSprite} 
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Sprite...
                  </>
                ) : (
                  "Generate Fighter Sprite"
                )}
              </Button>

              <div className="pt-4 border-t">
                <Label className="mb-2 block">Quick Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presetFighters.map((fighter) => (
                    <Button
                      key={fighter.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCharacterName(fighter.name);
                        setFighterType(fighter.type);
                        setStyle(fighter.style);
                      }}
                    >
                      {fighter.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Sprite</CardTitle>
              <CardDescription>Your AI-generated fighter sprite will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="bg-secondary/20 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                    <img
                      src={generatedImage}
                      alt={characterName}
                      className="max-w-full max-h-[400px] object-contain pixelated"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <Button onClick={downloadSprite} className="w-full" variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
                    Download Sprite
                  </Button>
                </div>
              ) : (
                <div className="bg-secondary/20 rounded-lg p-8 flex items-center justify-center min-h-[400px] text-muted-foreground">
                  <div className="text-center">
                    <p className="text-lg mb-2">No sprite generated yet</p>
                    <p className="text-sm">Fill in the character details and click Generate</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Pro Tips for Better Sprites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Be specific about clothing, hairstyle, and fighting stance</li>
              <li>Mention color schemes for better results (e.g., "red gi, black belt")</li>
              <li>Reference classic fighters for style consistency (e.g., "like Ryu" or "like Chun-Li")</li>
              <li>Keep descriptions focused on visual appearance, not abilities</li>
              <li>Use terms like "muscular", "lean", "athletic" to define body type</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpriteGenerator;
