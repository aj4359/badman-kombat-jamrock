import { useState, useCallback, useRef } from 'react';

interface VoiceState {
  isLoading: boolean;
  isSpeaking: boolean;
  error: string | null;
  audioQueue: string[];
}

interface UseElevenLabsVoiceOptions {
  voiceId?: string;
  model?: string;
  apiKey?: string;
}

export const useElevenLabsVoice = (options: UseElevenLabsVoiceOptions = {}) => {
  const {
    voiceId = 'N2lVS1w4EtoT3dr4eOWO', // Callum - good for Jamaican accent
    model = 'eleven_multilingual_v2',
    apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
  } = options;

  const [voiceState, setVoiceState] = useState<VoiceState>({
    isLoading: false,
    isSpeaking: false,
    error: null,
    audioQueue: []
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!apiKey) {
      setVoiceState(prev => ({ ...prev, error: 'ElevenLabs API key not configured' }));
      return;
    }

    try {
      setVoiceState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Stop current audio if playing
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      // Set up audio event listeners
      audio.addEventListener('loadstart', () => {
        setVoiceState(prev => ({ ...prev, isLoading: true }));
      });

      audio.addEventListener('canplay', () => {
        setVoiceState(prev => ({ ...prev, isLoading: false }));
      });

      audio.addEventListener('play', () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: true }));
      });

      audio.addEventListener('ended', () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false }));
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      });

      audio.addEventListener('error', (e) => {
        setVoiceState(prev => ({ 
          ...prev, 
          error: 'Audio playback failed',
          isLoading: false,
          isSpeaking: false 
        }));
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      });

      // Play the audio
      await audio.play();

    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      setVoiceState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Speech synthesis failed',
        isLoading: false,
        isSpeaking: false 
      }));
    }
  }, [apiKey, voiceId, model]);

  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  const clearError = useCallback(() => {
    setVoiceState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    speak,
    stopSpeaking,
    clearError,
    isLoading: voiceState.isLoading,
    isSpeaking: voiceState.isSpeaking,
    error: voiceState.error
  };
};