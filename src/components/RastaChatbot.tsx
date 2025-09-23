import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Minimize2, Maximize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'rasta';
  timestamp: number;
}

interface RastaChatbotProps {
  onNavigateToGame?: () => void;
  onNavigateToCharacterSelect?: () => void;
  onNavigateToHome?: () => void;
}

export const RastaChatbot: React.FC<RastaChatbotProps> = ({
  onNavigateToGame,
  onNavigateToCharacterSelect,
  onNavigateToHome
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Irie! Mi name Rasta Bot, yuh digital guide pon dis journey! Ready fi some serious kombat, bredrin?",
      sender: 'rasta',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'rasta') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getRastaResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Navigation responses
    if (input.includes('game') || input.includes('fight') || input.includes('play')) {
      setTimeout(() => onNavigateToGame?.(), 1000);
      return "Bless up! Mi a guide yuh to di fighting arena now! Prepare fi some serious action, seen?";
    }
    
    if (input.includes('character') || input.includes('select') || input.includes('fighter')) {
      setTimeout(() => onNavigateToCharacterSelect?.(), 1000);
      return "Irie! Time fi choose yuh warrior! Pick wisely, each fighter have dem own special powers!";
    }
    
    if (input.includes('home') || input.includes('main')) {
      setTimeout(() => onNavigateToHome?.(), 1000);
      return "No problem bredrin! Mi a take yuh back to di beginning!";
    }

    // General responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Wah gwaan my youth! Bless up and welcome to di digital kombat zone!";
    }
    
    if (input.includes('help') || input.includes('guide')) {
      return "Easy now! Mi here fi help yuh navigate dis place. Tell mi if yuh want go to 'game', 'character select', or back to 'home'. Jah bless!";
    }
    
    if (input.includes('rasta') || input.includes('jamaica')) {
      return "Seen! Mi come from di digital hills of Jamaica, where di bass heavy and di vibes irie! One love!";
    }
    
    if (input.includes('music') || input.includes('sound')) {
      return "Ah yes! Di sound system powerful here! Dis a di place where digital reggae meet martial arts, seen?";
    }

    // Default responses
    const responses = [
      "Irie! Tell mi more bout dat, bredrin!",
      "Bless up! Yuh speaking truth deh!",
      "Seen! Mi understand yuh vibe!",
      "Wicked! Keep di energy flowing!",
      "One love! Dat sound proper!",
      "Respect! Yuh know di way!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addMessage(inputText, 'user');
    const response = getRastaResponse(inputText);
    
    setTimeout(() => {
      addMessage(response, 'rasta');
    }, 500);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 shadow-lg shadow-green-500/25 border-2 border-yellow-400"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-background/95 backdrop-blur border-2 border-green-500/30 shadow-2xl shadow-green-500/20">
          <CardHeader className="bg-gradient-to-r from-green-600 to-yellow-500 text-white p-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">🇯🇲 Rasta Bot Navigator</CardTitle>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 border border-green-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-green-200/50">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask mi anything..."
                  className="flex-1 text-sm border-green-300 focus:border-green-500"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="icon" 
                  className="bg-green-600 hover:bg-green-700 text-white"
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