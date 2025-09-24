import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Minimize2, Volume2, VolumeX, Settings } from 'lucide-react';
import { RastaAvatar } from '@/components/ui/RastaAvatar';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'rasta';
  timestamp: number;
  emotion?: 'happy' | 'excited' | 'thinking' | 'greeting' | 'cool';
}

interface EnhancedRastaChatbotProps {
  onNavigateToGame?: () => void;
  onNavigateToCharacterSelect?: () => void;
  onNavigateToHome?: () => void;
}

export const EnhancedRastaChatbot: React.FC<EnhancedRastaChatbotProps> = ({
  onNavigateToGame,
  onNavigateToCharacterSelect,
  onNavigateToHome
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'excited' | 'thinking' | 'greeting' | 'cool'>('cool');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Irie! Mi name Rasta Bot, yuh digital guide pon dis journey! Ready fi some serious kombat, bredrin?",
      sender: 'rasta',
      timestamp: Date.now(),
      emotion: 'greeting'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { speak, stopSpeaking, isLoading, isSpeaking, error } = useElevenLabsVoice({
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', // Callum - good Caribbean accent
    model: 'eleven_multilingual_v2'
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Speak the first message when opened
  useEffect(() => {
    if (isOpen && voiceEnabled && messages.length === 1) {
      const firstMessage = messages[0];
      speak(firstMessage.text);
      setCurrentEmotion(firstMessage.emotion || 'greeting');
    }
  }, [isOpen, voiceEnabled]);

  const addMessage = (text: string, sender: 'user' | 'rasta', emotion?: ChatMessage['emotion']) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: Date.now(),
      emotion
    };
    setMessages(prev => [...prev, newMessage]);

    // Auto-speak rasta messages if voice is enabled
    if (sender === 'rasta' && voiceEnabled) {
      setTimeout(() => {
        speak(text);
        setCurrentEmotion(emotion || 'cool');
      }, 300);
    }

    return newMessage;
  };

  const getEnhancedRastaResponse = (userInput: string): { text: string; emotion: ChatMessage['emotion'] } => {
    const input = userInput.toLowerCase();
    
    // Navigation responses with emotions
    if (input.includes('game') || input.includes('fight') || input.includes('play')) {
      setTimeout(() => onNavigateToGame?.(), 2000);
      return {
        text: "Bless up! Mi a guide yuh to di fighting arena now! Get ready fi some wicked kombat action, seen? Jah bless!",
        emotion: 'excited'
      };
    }
    
    if (input.includes('character') || input.includes('select') || input.includes('fighter')) {
      setTimeout(() => onNavigateToCharacterSelect?.(), 2000);
      return {
        text: "Irie! Time fi choose yuh warrior! Each fighter have dem own special powers and moves. Pick wisely, bredrin!",
        emotion: 'excited'
      };
    }
    
    if (input.includes('home') || input.includes('main')) {
      setTimeout(() => onNavigateToHome?.(), 2000);
      return {
        text: "No problem mi friend! Mi a take yuh back to di beginning. One love!",
        emotion: 'happy'
      };
    }

    // Greeting responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('yo')) {
      return {
        text: "Wah gwaan my youth! Bless up and welcome to di digital kombat zone! Mi here fi guide yuh through dis irie experience!",
        emotion: 'greeting'
      };
    }
    
    // Help responses
    if (input.includes('help') || input.includes('guide') || input.includes('how')) {
      return {
        text: "Easy now! Mi here fi help yuh navigate dis place. Tell mi if yuh want go to 'game', 'character select', or back to 'home'. Mi can also give yuh tips bout di fighters dem!",
        emotion: 'thinking'
      };
    }
    
    // Cultural responses
    if (input.includes('rasta') || input.includes('jamaica') || input.includes('reggae')) {
      return {
        text: "Seen! Mi come from di digital hills of Jamaica, where di bass heavy and di vibes irie! Dis a di place where reggae beats meet martial arts, bredrin! One love!",
        emotion: 'happy'
      };
    }
    
    // Music responses
    if (input.includes('music') || input.includes('sound') || input.includes('beat')) {
      return {
        text: "Ah yes! Di sound system powerful here! Dis a di place where digital reggae meet street fighting! Feel di rhythm in every punch and kick, seen?",
        emotion: 'excited'
      };
    }

    // Fighter tips
    if (input.includes('tip') || input.includes('strategy') || input.includes('combo')) {
      const tips = [
        "Listen mi now - timing is everything! Watch yuh opponent movements and strike when dem guard down!",
        "Remember bredrin - each fighter have dem own style. Learn di combos and master di flow!",
        "Patience grasshopper! Don't rush in like a mad man. Observe, adapt, then dominate!",
        "Block and counter, dat's di key! Let dem attack first, then show dem who is boss!",
        "Special moves powerful, but don't rely on dem too much. Basic attacks can be deadly too!"
      ];
      return {
        text: tips[Math.floor(Math.random() * tips.length)],
        emotion: 'thinking'
      };
    }

    // Positive responses
    if (input.includes('thanks') || input.includes('thank you') || input.includes('cool') || input.includes('awesome')) {
      return {
        text: "Bless up! Mi glad fi help yuh out! Dat's what mi here for - fi guide and support mi bredrin dem!",
        emotion: 'happy'
      };
    }

    // Default responses with varied emotions
    const responses = [
      { text: "Irie! Tell mi more bout dat, bredrin!", emotion: 'cool' as const },
      { text: "Bless up! Yuh speaking truth deh!", emotion: 'happy' as const },
      { text: "Seen! Mi understand yuh vibe completely!", emotion: 'thinking' as const },
      { text: "Wicked! Keep di energy flowing like dat!", emotion: 'excited' as const },
      { text: "One love! Dat sound proper bredrin!", emotion: 'happy' as const },
      { text: "Respect! Yuh know di way fi sure!", emotion: 'cool' as const }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addMessage(inputText, 'user');
    setIsThinking(true);
    setCurrentEmotion('thinking');
    
    // Simulate thinking delay
    setTimeout(() => {
      const { text, emotion } = getEnhancedRastaResponse(inputText);
      addMessage(text, 'rasta', emotion);
      setIsThinking(false);
    }, 800);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-jamaica hover:scale-110 transition-all duration-300 shadow-neon-green border-2 border-jamaica-yellow animate-pulse"
          size="icon"
        >
          <div className="relative">
            <RastaAvatar size="sm" emotion="cool" showParticles={false} />
            <MessageCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-background" />
          </div>
        </Button>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-background/95 backdrop-blur border-2 border-jamaica-green/50 shadow-neon-green">
          <CardHeader className="bg-gradient-jamaica text-background p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RastaAvatar 
                  size="sm" 
                  emotion={currentEmotion}
                  isSpeaking={isSpeaking}
                  isThinking={isThinking}
                  showParticles={false}
                />
                <div>
                  <CardTitle className="text-sm font-retro">🇯🇲 Rasta Bot</CardTitle>
                  <p className="text-xs opacity-90">
                    {isSpeaking ? 'Speaking...' : isThinking ? 'Thinking...' : 'Ready to help!'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={toggleVoice}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-background hover:bg-background/20"
                  title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-background hover:bg-background/20"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'rasta' && (
                    <div className="mr-2 flex-shrink-0">
                      <RastaAvatar 
                        size="sm" 
                        emotion={message.emotion || 'cool'}
                        showParticles={false}
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm transition-all duration-300 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gradient-to-r from-jamaica-green/20 to-jamaica-yellow/20 text-foreground border border-jamaica-green/30 shadow-neon-green/20'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="mr-2 flex-shrink-0">
                    <RastaAvatar size="sm" emotion="thinking" isThinking={true} showParticles={false} />
                  </div>
                  <div className="bg-muted/50 text-muted-foreground p-3 rounded-lg text-sm animate-pulse">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-jamaica-green rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-jamaica-yellow rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-jamaica-red rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Error Display */}
            {error && (
              <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
                <p className="text-xs text-destructive">
                  Voice unavailable: {error}
                </p>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-jamaica-green/20 bg-background/50">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask mi anything, bredrin..."
                  className="flex-1 text-sm border-jamaica-green/30 focus:border-jamaica-green bg-background/80"
                  disabled={isThinking || isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  size="icon" 
                  className="bg-jamaica-green hover:bg-jamaica-green/80 text-background shadow-neon-green"
                  disabled={isThinking || isLoading || !inputText.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};