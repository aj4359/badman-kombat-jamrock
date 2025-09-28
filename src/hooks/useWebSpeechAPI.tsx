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

      // Configure voice settings for Jamaican accent - slower rate, deeper pitch
      utterance.rate = rate || 0.75;
      utterance.pitch = pitch || 0.4;  // Deeper for more authentic Caribbean sound
      utterance.volume = volume || 0.85;

      // Enhanced voice selection for authentic Caribbean/Jamaican sound
      const voices = speechSynthesis.getVoices();
      
      // Priority voice selection for authentic Jamaican/Caribbean sound
      const voiceOptions = [
        voiceName, // User-specified voice first
        // British/UK voices work best for Caribbean when pitch/rate adjusted
        'Google UK English Male',
        'Microsoft Guy',           // Often deeper UK voice
        'Microsoft James Desktop',
        'Microsoft David Desktop', 
        'Daniel',                  // Good depth
        'Google British Male',
        'Aaron',                   // Deep fallback
        'Alex',                    // macOS deep voice
        'default'
      ].filter(Boolean);

      let selectedVoice = null;
      
      for (const voiceName of voiceOptions) {
        // Look for exact matches first, then partial matches
        let voice = voices.find(v => 
          v.name.toLowerCase() === voiceName.toLowerCase() ||
          v.voiceURI.toLowerCase() === voiceName.toLowerCase()
        );
        
        if (!voice) {
          // Try partial matching for broader compatibility
          voice = voices.find(v => 
            v.name.toLowerCase().includes(voiceName.toLowerCase()) ||
            v.voiceURI.toLowerCase().includes(voiceName.toLowerCase()) ||
            (voiceName.includes('male') && v.name.toLowerCase().includes('male')) ||
            (voiceName.includes('british') && (v.lang === 'en-GB' || v.name.toLowerCase().includes('uk'))) ||
            (voiceName.includes('deep') && v.name.toLowerCase().includes('deep'))
          );
        }
        
        if (voice) {
          selectedVoice = voice;
          console.log(`🎤🇯🇲 Selected JAMAICAN voice: ${voice.name} (${voice.lang}) for target: ${voiceName}`);
          break;
        }
      }
      
      // Final fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.includes('en'));
        console.log(`🎤 Fallback to English voice: ${selectedVoice?.name}`);
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