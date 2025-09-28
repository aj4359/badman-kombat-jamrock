import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Minimize2, Volume2, VolumeX, Settings, Navigation, Gamepad2, Users, Trophy } from 'lucide-react';
import { JamaicanPixelAvatar } from '@/components/ui/JamaicanPixelAvatar';
import { useWebSpeechAPI } from '@/hooks/useWebSpeechAPI';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'rasta';
  timestamp: number;
  emotion?: 'happy' | 'excited' | 'thinking' | 'greeting' | 'cool' | 'speaking';
  type?: 'guidance' | 'navigation' | 'gameplay' | 'general';
}

interface GameplayTip {
  category: string;
  title: string;
  description: string;
  keyCombos?: string[];
}

interface EnhancedRastaChatbotProps {
  onNavigateToGame?: () => void;
  onNavigateToCharacterSelect?: () => void;
  onNavigateToHome?: () => void;
}

// Comprehensive gameplay guidance database
const GAMEPLAY_TIPS: GameplayTip[] = [
  {
    category: "Basic Controls",
    title: "Movement & Basic Attacks",
    description: "Use WASD or Arrow Keys fi move yuh fighter. Punch with J/Numpad 4, Kick with K/Numpad 5, Block with L/Numpad 6. Bredrin, practice dem basics first!",
    keyCombos: ["WASD/Arrows", "J/Num4=Punch", "K/Num5=Kick", "L/Num6=Block"]
  },
  {
    category: "Special Moves",
    title: "Quarter Circle Motions",
    description: "Fi execute special moves, use quarter circle motions: Down, Down-Right, Right + Punch/Kick. Each fighter got different special moves, seen?",
    keyCombos: ["↓→ + Punch", "↓← + Kick", "→↓→ + Punch"]
  },
  {
    category: "Combat System",
    title: "Combos & Frame Data",
    description: "Link yuh attacks fi create combos! Light attacks start faster, heavy attacks do more damage. Watch di frame advantage, rude boy!",
    keyCombos: ["Light→Medium→Heavy", "Special Cancel", "Block at right time"]
  },
  {
    category: "Advanced Techniques",
    title: "Super Moves & Meter Management",
    description: "Build yuh super meter by attacking and taking damage. When full, unleash devastating super moves with complex inputs!",
    keyCombos: ["Full 360° + Punch", "←→←→ + Kick", "Complex inputs"]
  }
];

const NAVIGATION_GUIDE = {
  "/": {
    location: "Home Page",
    guidance: "Welcome to Badman Kombat Jamrock! From here yuh can select characters, view fighters, or jump straight inna di game. Check out di trailers fi get hyped!",
    actions: ["Character Select", "View Fighters", "Start Game", "Watch Trailers"]
  },
  "/character-select": {
    location: "Character Selection",
    guidance: "Time fi choose yuh warrior! Each fighter got unique abilities, special moves, and fighting styles. Take time fi learn dem backstories and movesets, seen?",
    actions: ["Pick Fighter", "View Stats", "Practice Mode", "Start Battle"]
  },
  "/game": {
    location: "Fighting Arena",
    guidance: "Dis a di real deal! Use everything yuh learned. Watch yuh health, manage yuh meter, and show dem yuh skills. Remember - respect yuh opponent!",
    actions: ["Fight", "Pause", "Special Moves", "Super Attacks"]
  },
  "/vs-screen": {
    location: "VS Screen",
    guidance: "Get ready fi di showdown! Dis where yuh see who facing who. Take a deep breath and prepare fi battle, champion!",
    actions: ["Ready Up", "Change Fighter", "View Moves"]
  }
};

const JAMAICAN_RESPONSES = {
  greetings: [
    "Irie, bredrin! How mi can help yuh today?",
    "Wah gwaan, champion! Ready fi some guidance?",
    "Big up yuhself! What yuh need fi know?",
    "Respect, warrior! Mi here fi guide yuh journey."
  ],
  gameplay: [
    "Seen! Let mi break down di combat system fi yuh...",
    "No worry yuhself, mi teach yuh proper fighting techniques!",
    "Listen carefully, dis knowledge crucial fi victory!",
    "Mi show yuh how fi dominate di ring, bredrin!"
  ],
  navigation: [
    "No problem! Mi guide yuh through every section.",
    "Easy navigation coming right up, champion!",
    "Let mi show yuh around di place properly.",
    "Follow mi lead, we explore together!"
  ],
  encouragement: [
    "Yuh doing great, keep practicing!",
    "Respect! Yuh learning fast, seen?",
    "Dat's di spirit! Victory soon come!",
    "Big up yuhself, champion! Keep fighting!"
  ]
};

export const EnhancedRastaChatbot: React.FC<EnhancedRastaChatbotProps> = ({
  onNavigateToGame,
  onNavigateToCharacterSelect,
  onNavigateToHome
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'excited' | 'thinking' | 'greeting' | 'cool' | 'speaking'>('cool');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [quickTips, setQuickTips] = useState<GameplayTip[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { speak, stopSpeaking, isLoading, isSpeaking, error } = useWebSpeechAPI({
    voiceName: 'Microsoft David', // Real UK English Male voice with Caribbean potential
    rate: 0.8, // Slightly faster for natural flow
    pitch: 0.7, // Moderate pitch for authentic sound
    volume: 0.85
  });

  // Initialize with contextual welcome message
  useEffect(() => {
    const currentPath = location.pathname;
    const locationInfo = NAVIGATION_GUIDE[currentPath as keyof typeof NAVIGATION_GUIDE];
    
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      text: locationInfo 
        ? `Irie! Welcome to ${locationInfo.location}. ${locationInfo.guidance}`
        : "Wah gwaan, champion! Mi name Rasta Bot, yuh personal guide fi Badman Kombat Jamrock! Ask mi anything bout gameplay, controls, or navigation. Let's get yuh ready fi victory!",
      sender: 'rasta',
      timestamp: Date.now(),
      emotion: 'greeting',
      type: 'guidance'
    };

    setMessages([welcomeMessage]);
    
    // Set relevant quick tips based on current page
    if (currentPath === '/character-select') {
      setQuickTips(GAMEPLAY_TIPS.filter(tip => tip.category === 'Basic Controls'));
    } else if (currentPath === '/game') {
      setQuickTips(GAMEPLAY_TIPS.filter(tip => tip.category === 'Combat System'));
    }
  }, [location.pathname]);

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
      const gameResponses = [
        "Big up yuhself! Time fi lick down some opponents pon di street! Ready fi di madness?",
        "Wah gwaan warrior! Mi a send yuh to di arena now - prepare fi some serious bruk out!",
        "Bloodfire! Yuh ready fi test yuh skills? Mek wi see if yuh can dominate!",
        "Seen! Time fi show dem who a di real champion! Go handle yuh business!"
      ];
      return {
        text: gameResponses[Math.floor(Math.random() * gameResponses.length)],
        emotion: 'excited'
      };
    }
    
    if (input.includes('character') || input.includes('select') || input.includes('fighter')) {
      setTimeout(() => onNavigateToCharacterSelect?.(), 2000);
      const selectResponses = [
        "Irie! Choose yuh champion wisely, seen? Each warrior have dem own style and vibes!",
        "Big up! Time fi pick yuh fighter! Remember - a not just strength, but technique and heart!",
        "Wah gwaan selecta! Choose di one weh speak to yuh soul, bredrin!",
        "Bless! Every fighter have dem own journey and power. Trust yuh instincts!"
      ];
      return {
        text: selectResponses[Math.floor(Math.random() * selectResponses.length)],
        emotion: 'excited'
      };
    }
    
    if (input.includes('home') || input.includes('main')) {
      setTimeout(() => onNavigateToHome?.(), 2000);
      const homeResponses = [
        "No worries bredrin! Mi a carry yuh back a yard! One love!",
        "Easy! Back to di starting point wi go. Jah guide!",
        "Seen! Home sweet home it is! Mi deh yah fi when yuh ready again!",
        "Blessed! Back to di foundation wi go. Take yuh time, youth!"
      ];
      return {
        text: homeResponses[Math.floor(Math.random() * homeResponses.length)],
        emotion: 'happy'
      };
    }

    // Greeting responses with more variety
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('yo') || input.includes('wah gwaan') || input.includes('irie')) {
      const greetings = [
        "Wah gwaan mi bredrin! Bless up yuhself! Welcome to di digital yard!",
        "Irie massive! Big up yuhself! Mi glad fi see yuh reach ya so!",
        "Respect youth! How yuh stay? Ready fi some serious ting?",
        "Bless up mi friend! Wah yuh seh? Come mek wi reason little bit!",
        "One love bredrin! Yuh looking well today! Ready fi di vibes?"
      ];
      return {
        text: greetings[Math.floor(Math.random() * greetings.length)],
        emotion: 'greeting'
      };
    }
    
    // Help responses
    if (input.includes('help') || input.includes('guide') || input.includes('how') || input.includes('wat') || input.includes('explain')) {
      const helpResponses = [
        "Easy now bredrin! Mi deh yah fi guide yuh through everything! Just tell mi wah yuh want do!",
        "No stress at all! Mi can help yuh reach anywhere - 'game', 'character select', or back 'home'!",
        "Seen! Mi here fi assist yuh journey. Ask mi anything bout di fighters or di game!",
        "Blessed! Mi a yuh digital tour guide! Tell mi weh yuh want go and mi sort yuh out!",
        "Irie! Questions? Mi have all di answers! Just speak yuh mind, bredrin!"
      ];
      return {
        text: helpResponses[Math.floor(Math.random() * helpResponses.length)],
        emotion: 'thinking'
      };
    }
    
    // Cultural responses with more depth
    if (input.includes('rasta') || input.includes('jamaica') || input.includes('reggae') || input.includes('jah') || input.includes('babylon')) {
      const culturalResponses = [
        "Seen! Mi represent di culture to di fullest! From di hills of Jamaica to di digital realm!",
        "Bloodfire! Rasta vibes strong inna dis place! One love and unity through kombat!",
        "Jah bless! Mi bring di wisdom of di elders to dis new age fighting game!",
        "Big up! From Bob Marley to Marcus Garvey - di spirit live on inna dis digital space!",
        "Irie! Babylon system can't stop wi! Wi use technology fi spread di message!"
      ];
      return {
        text: culturalResponses[Math.floor(Math.random() * culturalResponses.length)],
        emotion: 'happy'
      };
    }
    
    // Music responses
    if (input.includes('music') || input.includes('sound') || input.includes('beat') || input.includes('bass') || input.includes('riddim')) {
      const musicResponses = [
        "Wah! Di bass line heavy like Sly & Robbie! Every punch land pon di one drop!",
        "Seen! Dis a where dancehall meet martial arts! Feel di riddim inna every move!",
        "Bloodfire! Sound system culture meet fighting game! Pure vibes!",
        "Irie! From ska to dubstep - wi evolve but di essence remain di same!",
        "Big up! Music a di universal language, and kombat a di universal conversation!"
      ];
      return {
        text: musicResponses[Math.floor(Math.random() * musicResponses.length)],
        emotion: 'excited'
      };
    }

    // Fighter tips with more authentic language
    if (input.includes('tip') || input.includes('strategy') || input.includes('combo') || input.includes('skill') || input.includes('train')) {
      const tips = [
        "Listen mi now youth - patience a di master key! Watch yuh opponent like hawk and strike like lightning!",
        "Bredrin, every champion know dis - practice mek perfect! Master di basics before yuh try di fancy moves!",
        "Seen! Timing more important than power. Study yuh opponent pattern and exploit dem weakness!",
        "Big up! Block and counter a deadly combination! Let dem attack first, den punish dem fi it!",
        "Wicked! Special moves flashy, but basic attacks a di bread and butter! Master both fi total domination!",
        "Remember dis - mind over matter! Stay calm under pressure and yuh decisions will be sharp!",
        "Real talk - every loss a lesson! Learn from defeat and come back stronger!",
        "Bloodfire! Distance management crucial! Know when fi stay close and when fi keep space!"
      ];
      return {
        text: tips[Math.floor(Math.random() * tips.length)],
        emotion: 'thinking'
      };
    }

    // Positive responses with more expressions
    if (input.includes('thanks') || input.includes('thank you') || input.includes('cool') || input.includes('awesome') || input.includes('wicked') || input.includes('bless')) {
      const positiveResponses = [
        "Bless up yuhself! Mi honor fi help out! Dat's what family do fi each other!",
        "No problem at all bredrin! Mi glad yuh appreciate di vibes! One love!",
        "Seen! Positive energy always welcome! Keep dat good spirit flowing!",
        "Big up yuhself! Gratitude a beautiful ting! Respect!",
        "Irie! Mi blessed fi be here fi yuh! Anytime yuh need guidance, just holla!",
        "Wicked! Good manners never go out of style! Jah bless yuh spirit!"
      ];
      return {
        text: positiveResponses[Math.floor(Math.random() * positiveResponses.length)],
        emotion: 'happy'
      };
    }

    // Combat-specific responses
    if (input.includes('punch') || input.includes('kick') || input.includes('block') || input.includes('attack') || input.includes('defend')) {
      const combatResponses = [
        "Seen! Every warrior have dem own style! Find yuh rhythm and flow with it!",
        "Bloodfire! Timing and precision beat brute force every time! Train smart!",
        "Irie! Defense win championship! Master di art of protection first!",
        "Big up! Attack with purpose, not just aggression! Every move must have meaning!",
        "Wicked! Balance a everything - offense and defense must work together!"
      ];
      return {
        text: combatResponses[Math.floor(Math.random() * combatResponses.length)],
        emotion: 'thinking'
      };
    }

    // Motivational responses
    if (input.includes('hard') || input.includes('difficult') || input.includes('lose') || input.includes('losing') || input.includes('frustrated')) {
      const motivationalResponses = [
        "Easy youth! Every champion face defeat! What matter is how yuh bounce back!",
        "Seen bredrin! Hard times don't last, but strong people do! Keep pushing!",
        "Bloodfire! Frustration a part of di journey! Channel dat energy into improvement!",
        "Irie! Remember - even di great Bob Marley face struggle! Perseverance a di key!",
        "Big up! When di going get tough, di tough get going! Yuh stronger than yuh think!",
        "Bless! Every master was once a disaster! Keep training and yuh will excel!"
      ];
      return {
        text: motivationalResponses[Math.floor(Math.random() * motivationalResponses.length)],
        emotion: 'happy'
      };
    }

    // Default responses with more variety and authentic expressions
    const responses = [
      { text: "Irie! Tell mi more bout dat, bredrin! Mi ears dem open!", emotion: 'cool' as const },
      { text: "Seen! Yuh speaking pure facts deh! Big up yuhself!", emotion: 'happy' as const },
      { text: "Bloodfire! Dat sound interesting! Explain it to mi proper!", emotion: 'excited' as const },
      { text: "Wicked! Mi feel yuh vibes completely! Continue di reasoning!", emotion: 'thinking' as const },
      { text: "Bless up! Yuh always have good insights! Share more wisdom!", emotion: 'happy' as const },
      { text: "Respect youth! Yuh definitely know wah yuh talking bout!", emotion: 'cool' as const },
      { text: "One love! Dat sound like pure conscious reasoning to mi!", emotion: 'thinking' as const },
      { text: "Big up! Mi learn something new from yuh every time!", emotion: 'excited' as const },
      { text: "Easy now! Yuh have mi full attention! Speak yuh mind!", emotion: 'cool' as const },
      { text: "Jah know! Dis conversation getting deeper by di minute!", emotion: 'thinking' as const }
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
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 hover:scale-110 transition-all duration-300 shadow-lg border-2 border-yellow-400 animate-pulse"
          size="icon"
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <JamaicanPixelAvatar size="sm" emotion="cool" showParticles={true} />
            <MessageCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-white bg-blue-500 rounded-full p-0.5" />
          </div>
        </Button>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-background/95 backdrop-blur border-2 border-jamaica-green/50 shadow-neon-green">
          <CardHeader className="bg-gradient-jamaica text-background p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <JamaicanPixelAvatar 
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
                    <JamaicanPixelAvatar 
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
                    <JamaicanPixelAvatar size="sm" emotion="thinking" isThinking={true} showParticles={false} />
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