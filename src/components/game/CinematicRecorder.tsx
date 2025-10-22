import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Video, Download, StopCircle, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecordingConfig {
  resolution: { width: number; height: number };
  frameRate: number;
  duration: number;
  format: string;
  codec: string;
  bitrate: number;
}

const DEFAULT_CONFIG: RecordingConfig = {
  resolution: { width: 1920, height: 1080 },
  frameRate: 30, // Lowered to 30fps for stability
  duration: 30000, // 30 seconds
  format: 'webm',
  codec: 'vp9',
  bitrate: 5000000 // Reduced bitrate for smoother recording
};

interface CinematicRecorderProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  config?: Partial<RecordingConfig>;
}

export const CinematicRecorder: React.FC<CinematicRecorderProps> = ({
  canvasRef,
  onRecordingStart,
  onRecordingStop,
  config = {}
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const startRecording = useCallback(async () => {
    if (!canvasRef.current) {
      toast({
        title: 'Error',
        description: 'Canvas not ready',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Get canvas stream
      const stream = canvasRef.current.captureStream(finalConfig.frameRate);
      
      // Check codec support
      const mimeType = `video/${finalConfig.format};codecs=${finalConfig.codec}`;
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        toast({
          title: 'Codec not supported',
          description: 'Falling back to default codec',
          variant: 'destructive'
        });
      }

      // Create MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) 
          ? mimeType 
          : `video/${finalConfig.format}`,
        videoBitsPerSecond: finalConfig.bitrate
      });

      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: `video/${finalConfig.format}` });
        setRecordedBlob(blob);
        setIsRecording(false);
        setProgress(100);
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }

        toast({
          title: 'Recording Complete!',
          description: 'Your cinematic trailer is ready to download.',
        });

        onRecordingStop?.();
      };

      // Start recording
      mediaRecorderRef.current.start(100); // Capture every 100ms
      setIsRecording(true);
      setProgress(0);
      setRecordedBlob(null);
      startTimeRef.current = Date.now();

      // Update progress with requestIdleCallback for better performance
      const updateProgress = () => {
        if (!startTimeRef.current) return;
        
        const elapsed = Date.now() - startTimeRef.current;
        const progressPercent = Math.min((elapsed / finalConfig.duration) * 100, 100);
        setProgress(progressPercent);

        // Auto-stop after duration
        if (elapsed >= finalConfig.duration) {
          stopRecording();
        } else if (progressIntervalRef.current) {
          // Use requestIdleCallback if available, otherwise setTimeout
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(updateProgress);
          } else {
            setTimeout(updateProgress, 100);
          }
        }
      };
      
      progressIntervalRef.current = setInterval(updateProgress, 100) as any;

      onRecordingStart?.();

      toast({
        title: 'Recording Started',
        description: `Recording ${finalConfig.duration / 1000}s cinematic trailer...`,
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: 'Recording Failed',
        description: 'Could not start video recording',
        variant: 'destructive'
      });
    }
  }, [canvasRef, finalConfig, toast, onRecordingStart, onRecordingStop]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      const stream = canvasRef.current?.captureStream();
      stream?.getTracks().forEach(track => track.stop());
    }
  }, [isRecording, canvasRef]);

  const downloadRecording = useCallback(() => {
    if (!recordedBlob) return;

    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bmk-gameplay-trailer-${Date.now()}.${finalConfig.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download Started',
      description: 'Your trailer is downloading...',
    });
  }, [recordedBlob, finalConfig.format, toast]);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 border-2 border-yellow-400 rounded-lg p-4 min-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-bold text-sm">Cinematic Recorder</span>
        </div>
        {isRecording && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 text-xs font-mono">REC</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isRecording && (
        <div className="mb-3">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-white/70 mt-1 text-center">
            {Math.round(progress)}% - {Math.round((progress / 100) * (finalConfig.duration / 1000))}s / {finalConfig.duration / 1000}s
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {!isRecording && !recordedBlob && (
          <Button
            onClick={startRecording}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button
            onClick={stopRecording}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black"
          >
            <StopCircle className="w-4 h-4 mr-2" />
            Stop
          </Button>
        )}

        {recordedBlob && (
          <Button
            onClick={downloadRecording}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 text-xs text-white/50 text-center">
        {finalConfig.resolution.width}x{finalConfig.resolution.height} @ {finalConfig.frameRate}fps
      </div>
    </div>
  );
};
