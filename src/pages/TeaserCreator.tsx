import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Download, Film, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const TeaserCreator = () => {
  const navigate = useNavigate();
  const [selectedClips, setSelectedClips] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState<6 | 15 | 30 | 60>(6);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      toast.error('Maximum 3 clips allowed');
      return;
    }
    setSelectedClips(files.slice(0, 3));
    toast.success(`${files.length} clip(s) selected`);
  };

  const generateTeaser = async () => {
    if (selectedClips.length === 0) {
      toast.error('Please select at least one video clip');
      return;
    }

    setIsProcessing(true);
    toast.info(`Generating ${duration}s teaser...`);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set 1080p resolution
      canvas.width = 1920;
      canvas.height = 1080;

      // Load videos
      const videos = await Promise.all(
        selectedClips.map((clip) => {
          return new Promise<HTMLVideoElement>((resolve) => {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(clip);
            video.onloadedmetadata = () => resolve(video);
          });
        })
      );

      videoRefs.current = videos;

      // Calculate clip duration per segment
      const clipDuration = duration / videos.length;

      // Create MediaRecorder for output
      const stream = canvas.captureStream(24);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BMK_tease_${duration}s_${Date.now()}.webm`;
        a.click();
        toast.success('Teaser downloaded!');
        setIsProcessing(false);
      };

      mediaRecorder.start();

      // Render each video segment
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        video.currentTime = 2; // Start at 2s like batch script
        await new Promise(resolve => setTimeout(resolve, 100));

        const endTime = video.currentTime + clipDuration;
        video.play();

        await new Promise<void>((resolve) => {
          const renderFrame = () => {
            if (video.currentTime >= endTime || video.ended) {
              video.pause();
              resolve();
              return;
            }

            // Apply filters like batch script: unsharp, contrast, saturation
            ctx.filter = 'contrast(1.1) saturate(1.15) brightness(1.05)';
            
            // Scale to 1920x1080 maintaining aspect ratio
            const scale = Math.min(1920 / video.videoWidth, 1080 / video.videoHeight);
            const w = video.videoWidth * scale;
            const h = video.videoHeight * scale;
            const x = (1920 - w) / 2;
            const y = (1080 - h) / 2;

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, 1920, 1080);
            ctx.drawImage(video, x, y, w, h);

            // Add BMK branding overlay
            ctx.filter = 'none';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 950, 1920, 130);
            
            ctx.font = 'bold 60px Arial';
            ctx.fillStyle = '#00d4ff';
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 20;
            ctx.fillText('BADMAN KOMBAT', 60, 1030);
            ctx.shadowBlur = 0;

            requestAnimationFrame(renderFrame);
          };
          renderFrame();
        });
      }

      mediaRecorder.stop();

    } catch (error) {
      console.error('Teaser generation failed:', error);
      toast.error('Failed to generate teaser');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="bg-black/80 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          BACK
        </Button>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <Film className="w-20 h-20 mx-auto text-cyan-400 animate-pulse" />
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              TEASER CREATOR
            </h1>
            <p className="text-xl text-gray-400">Generate epic combat teasers from your gameplay clips</p>
          </div>

          {/* File Upload */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-cyan-400/30">
            <label className="block cursor-pointer">
              <div className="border-4 border-dashed border-cyan-400/50 rounded-xl p-12 text-center hover:border-cyan-400 transition-all hover:bg-cyan-400/5">
                <Upload className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                <p className="text-xl font-bold mb-2">Select Video Clips (Max 3)</p>
                <p className="text-gray-400">MP4, WebM, or MOV files</p>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </label>

            {selectedClips.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="font-bold text-cyan-400">Selected Clips:</p>
                {selectedClips.map((clip, i) => (
                  <div key={i} className="bg-black/50 rounded-lg p-3 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">{clip.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Duration Selection */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-purple-400/30">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Teaser Duration</h3>
            <div className="grid grid-cols-4 gap-4">
              {[6, 15, 30, 60].map((d) => (
                <Button
                  key={d}
                  onClick={() => setDuration(d as 6 | 15 | 30 | 60)}
                  className={`text-lg font-bold ${
                    duration === d
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 border-2 border-yellow-400'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {d}s
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateTeaser}
            disabled={selectedClips.length === 0 || isProcessing}
            className="w-full text-2xl py-8 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border-4 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.6)] disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Film className="mr-3 h-6 w-6 animate-spin" />
                RENDERING...
              </>
            ) : (
              <>
                <Download className="mr-3 h-6 w-6" />
                GENERATE TEASER
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="bg-black/40 rounded-xl p-6 border border-gray-700">
            <h3 className="font-bold text-yellow-400 mb-3">How It Works:</h3>
            <ol className="space-y-2 text-gray-300 text-sm list-decimal list-inside">
              <li>Upload 1-3 gameplay clips (or any videos)</li>
              <li>Select desired teaser duration (6s, 15s, 30s, or 60s)</li>
              <li>Click Generate - clips will be scaled to 1080p, enhanced with contrast/saturation filters</li>
              <li>Download your professional-looking teaser with BMK branding</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeaserCreator;
