import { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceState {
  isLoading: boolean;
  isSpeaking: boolean;
  error: string | null;
  availableVoices: SpeechSynthesisVoice[];
}

interface UseWebSpeechAPIOptions {
  voiceName?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useWebSpeechAPI = (options: UseWebSpeechAPIOptions = {}) => {
  const {
    voiceName = '',
    rate = 0.8,
    pitch = 0.8,
    volume = 1
  } = options;

  const [voiceState, setVoiceState] = useState<VoiceState>({
    isLoading: false,
    isSpeaking: false,
    error: null,
    availableVoices: []
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setVoiceState(prev => ({ ...prev, availableVoices: voices }));
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!('speechSynthesis' in window)) {
      setVoiceState(prev => ({ ...prev, error: 'Speech synthesis not supported' }));
      return;
    }

    try {
      // Stop any current speech
      speechSynthesis.cancel();
      
      setVoiceState(prev => ({ ...prev, isLoading: true, error: null }));

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Configure voice settings
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Select voice (prefer deep male voices for cinematic effect)
      const voices = speechSynthesis.getVoices();
      let selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes(voiceName.toLowerCase()) ||
        (voice.name.toLowerCase().includes('male') && voice.lang.includes('en')) ||
        voice.name.toLowerCase().includes('deep')
      );
      
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.includes('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Set up event listeners
      utterance.onstart = () => {
        setVoiceState(prev => ({ ...prev, isLoading: false, isSpeaking: true }));
      };

      utterance.onend = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false }));
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        setVoiceState(prev => ({ 
          ...prev, 
          error: `Speech synthesis failed: ${event.error}`,
          isLoading: false,
          isSpeaking: false 
        }));
        utteranceRef.current = null;
      };

      // Speak the text
      speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Web Speech API Error:', error);
      setVoiceState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Speech synthesis failed',
        isLoading: false,
        isSpeaking: false 
      }));
    }
  }, [rate, pitch, volume, voiceName]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    utteranceRef.current = null;
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
    error: voiceState.error,
    availableVoices: voiceState.availableVoices
  };
};