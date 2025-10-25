import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, Eye, DollarSign, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ViralStreetFighterCanvas } from '@/components/game/ViralStreetFighterCanvas';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';

const CHAT_MESSAGES = [
  { user: 'DancehallDon', msg: 'YOW! This combo system is FIRE! 🔥', color: '#FFD700' },
  { user: 'KingstonWarrior', msg: 'LEROY going CRAZY!!! 💪', color: '#FF6347' },
  { user: 'ReggaeRumbler', msg: 'That special move tho 😱', color: '#00CED1' },
  { user: 'JamrockJedi', msg: 'Who else remembers fighting games like this?', color: '#9370DB' },
  { user: 'SoundSystemSage', msg: 'The pixel art is AUTHENTIC! 🎨', color: '#32CD32' },
  { user: 'YardieVibes', msg: 'gifted 5 subs! 🎁', color: '#FFD700' },
  { user: 'BadManBoss', msg: 'Combo meter at 15!!! Keep going!', color: '#FF1493' },
  { user: 'DigitalDread', msg: 'This is what street fighter SHOULD be', color: '#FF8C00' },
  { user: 'TropicalTiger', msg: 'The stage backgrounds are SICK', color: '#00FA9A' },
  { user: 'IslandInnovator', msg: 'Following! This game needs to blow up 🚀', color: '#1E90FF' }
];

const STREAM_EVENTS = [
  { type: 'follow', user: 'YardieVibes', icon: Heart },
  { type: 'sub', user: 'KingstonKing', amount: 'Tier 1', icon: DollarSign },
  { type: 'donation', user: 'ReggaeFan420', amount: '$5.00', icon: DollarSign },
  { type: 'raid', user: 'FightingGameStreamer', amount: '47 viewers', icon: Users }
];

const LiveStream = () => {
  const [viewerCount, setViewerCount] = useState(847);
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES.slice(0, 3));
  const [streamEvent, setStreamEvent] = useState<typeof STREAM_EVENTS[0] | null>(null);
  const [gameStats, setGameStats] = useState({ combo: 0, hp: 100 });
  const chatRef = useRef<HTMLDivElement>(null);

  // Fighter data - Leroy vs Jordan
  const fighterData = {
    player1: ENHANCED_FIGHTER_DATA.leroy,
    player2: ENHANCED_FIGHTER_DATA.jordan
  };

  const stage = {
    id: 'kingston-street',
    name: 'Kingston Downtown Streets',
    background: '/assets/kingston-street-scene-1.jpg',
    music: '/assets/audio/dancehall-riddim-1.mp3'
  };

  // Simulate live chat
  useEffect(() => {
    const chatInterval = setInterval(() => {
      const randomMessage = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
      setChatMessages(prev => [...prev.slice(-8), randomMessage]);
    }, 3000);

    return () => clearInterval(chatInterval);
  }, []);

  // Simulate viewer count fluctuation
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 20) - 8);
    }, 5000);

    return () => clearInterval(viewerInterval);
  }, []);

  // Simulate stream events
  useEffect(() => {
    const eventInterval = setInterval(() => {
      const randomEvent = STREAM_EVENTS[Math.floor(Math.random() * STREAM_EVENTS.length)];
      setStreamEvent(randomEvent);
      setTimeout(() => setStreamEvent(null), 5000);
    }, 15000);

    return () => clearInterval(eventInterval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Main Game Area */}
      <div className="absolute inset-0">
        <ViralStreetFighterCanvas 
          fighterData={fighterData}
          stage={stage}
        />
      </div>

      {/* Stream Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar - Stream Info */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => window.location.href = '/3d-ultimate'} 
                variant="outline"
                size="sm"
                className="pointer-events-auto bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/40"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                EXIT STREAM
              </Button>
              <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white font-bold text-sm">LIVE</span>
              </div>
              <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-white font-bold">{viewerCount.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-white text-lg font-bold">BADMAN KOMBAT - Ranked Match</h2>
              <p className="text-gray-300 text-sm">Leroy "The Legend" vs Jordan "Sound Master"</p>
            </div>
          </div>
        </div>

        {/* Webcam Overlay (Bottom Left) */}
        <div className="absolute bottom-20 left-4 w-64 h-48 rounded-lg overflow-hidden border-4 border-purple-500 shadow-2xl shadow-purple-500/50">
          <div className="w-full h-full bg-gradient-to-br from-purple-900/90 to-black/90 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center">
                <span className="text-3xl">🎮</span>
              </div>
              <p className="text-white font-bold">STREAMER CAM</p>
              <p className="text-purple-300 text-sm">Going for that 20-hit combo!</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-2 py-1">
            <p className="text-white text-xs font-bold">@YardManGaming</p>
          </div>
        </div>

        {/* Chat Overlay (Bottom Right) */}
        <div className="absolute bottom-4 right-4 w-96 h-[500px] bg-black/80 backdrop-blur-sm rounded-lg border-2 border-purple-500/50 flex flex-col pointer-events-auto">
          <div className="bg-purple-900/50 px-4 py-2 border-b border-purple-500/30 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-bold">LIVE CHAT</h3>
            <span className="ml-auto text-purple-300 text-sm">{chatMessages.length} messages</span>
          </div>
          
          <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            {chatMessages.map((msg, i) => (
              <div key={i} className="animate-fade-in">
                <span className="font-bold" style={{ color: msg.color }}>{msg.user}: </span>
                <span className="text-white text-sm">{msg.msg}</span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-purple-500/30">
            <Input 
              placeholder="Say something in chat..."
              className="bg-black/50 border-purple-500/30 text-white"
              disabled
            />
          </div>
        </div>

        {/* Stream Event Alert (Center Top) */}
        {streamEvent && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 animate-scale-in">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg px-8 py-4 border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50">
              <div className="flex items-center gap-4">
                <streamEvent.icon className="w-8 h-8 text-yellow-300" />
                <div>
                  <p className="text-white font-bold text-xl">
                    {streamEvent.type === 'follow' && `${streamEvent.user} followed!`}
                    {streamEvent.type === 'sub' && `${streamEvent.user} subscribed!`}
                    {streamEvent.type === 'donation' && `${streamEvent.user} donated ${streamEvent.amount}!`}
                    {streamEvent.type === 'raid' && `${streamEvent.user} raided with ${streamEvent.amount}!`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stream Stats (Top Right) */}
        <div className="absolute top-20 right-4 space-y-2">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-cyan-500/50 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-cyan-400 text-xs">VIEWERS PEAK</p>
              <p className="text-white font-bold">1,247</p>
            </div>
          </div>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-green-500/50 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-green-400 text-xs">FOLLOWERS</p>
              <p className="text-white font-bold">12.4K</p>
            </div>
          </div>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-yellow-500/50 flex items-center gap-2">
            <Heart className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-yellow-400 text-xs">SUBS</p>
              <p className="text-white font-bold">847</p>
            </div>
          </div>
        </div>

        {/* Donation Goal Progress (Bottom Center) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-3 border-2 border-green-500/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 text-sm font-bold">DONATION GOAL: NEW ARCADE STICK</span>
            <span className="text-white text-sm font-bold">$487 / $800</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: '60.8%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;