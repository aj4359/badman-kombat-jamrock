import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface EnhancedMobileControlsProps {
  onTouch: (action: string, pressed: boolean) => void;
  onGesture?: (gesture: GestureType) => void;
}

type GestureType = 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'tap' | 'double-tap' | 'hold';

interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

export const EnhancedMobileControls: React.FC<EnhancedMobileControlsProps> = ({ 
  onTouch, 
  onGesture 
}) => {
  const isMobile = useIsMobile();
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());
  const [showControls, setShowControls] = useState(true);
  const [gestureMode, setGestureMode] = useState(false);
  
  // Gesture detection
  const touchStart = useRef<TouchPosition | null>(null);
  const lastTap = useRef<number>(0);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  if (!isMobile) return null;

  const handleTouchStart = (action: string) => {
    setActiveButtons(prev => new Set(prev).add(action));
    onTouch(action, true);
  };

  const handleTouchEnd = (action: string) => {
    setActiveButtons(prev => {
      const newSet = new Set(prev);
      newSet.delete(action);
      return newSet;
    });
    onTouch(action, false);
  };

  const handleGestureStart = (e: React.TouchEvent) => {
    if (!gestureMode || !onGesture) return;
    
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    // Start hold timer
    holdTimer.current = setTimeout(() => {
      onGesture('hold');
    }, 500);
  };

  const handleGestureEnd = (e: React.TouchEvent) => {
    if (!gestureMode || !onGesture || !touchStart.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.timestamp;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Clear hold timer
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    // Detect swipes (minimum distance and speed)
    if (distance > 50 && deltaTime < 300) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        onGesture(deltaX > 0 ? 'swipe-right' : 'swipe-left');
      } else {
        onGesture(deltaY > 0 ? 'swipe-down' : 'swipe-up');
      }
    } 
    // Detect taps
    else if (distance < 30 && deltaTime < 200) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        onGesture('double-tap');
      } else {
        onGesture('tap');
      }
      lastTap.current = now;
    }

    touchStart.current = null;
  };

  const ControlButton = ({ 
    action, 
    label, 
    className = '', 
    size = 'default' 
  }: { 
    action: string; 
    label: string; 
    className?: string;
    size?: 'sm' | 'default' | 'lg';
  }) => {
    const isActive = activeButtons.has(action);
    const sizeClasses = {
      sm: 'p-2 text-xs',
      default: 'p-3 text-sm',
      lg: 'p-4 text-base'
    };

    return (
      <button 
        className={cn(
          'rounded-lg font-retro font-bold border-2 transition-all duration-150 select-none',
          'active:scale-95 transform',
          sizeClasses[size],
          isActive ? 'scale-110 shadow-lg' : 'scale-100',
          className
        )}
        onTouchStart={(e) => {
          e.preventDefault();
          handleTouchStart(action);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleTouchEnd(action);
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          handleTouchEnd(action);
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      {/* Control Toggle */}
      <button
        className="fixed top-4 right-4 z-50 bg-black/80 text-white p-2 rounded-lg text-xs"
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? '🎮' : '👆'}
      </button>

      {/* Gesture Mode Toggle */}
      <button
        className="fixed top-4 right-16 z-50 bg-black/80 text-white p-2 rounded-lg text-xs"
        onClick={() => setGestureMode(!gestureMode)}
      >
        {gestureMode ? '✋' : '🎯'}
      </button>

      {showControls && !gestureMode && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-black/90 backdrop-blur border-t border-neon-cyan/30">
          <div className="p-4 grid grid-cols-8 gap-2 max-w-lg mx-auto">
            {/* Movement Controls */}
            <div className="col-span-2 grid grid-cols-2 gap-1">
              <ControlButton
                action="left"
                label="←"
                className="bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan active:bg-neon-cyan/40"
              />
              <ControlButton
                action="right"
                label="→"
                className="bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan active:bg-neon-cyan/40"
              />
              <ControlButton
                action="down"
                label="↓"
                className="bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan active:bg-neon-cyan/40"
                size="sm"
              />
              <ControlButton
                action="up"
                label="↑"
                className="bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan active:bg-neon-cyan/40"
                size="sm"
              />
            </div>

            {/* Action Controls */}
            <div className="col-span-6 grid grid-cols-3 gap-2">
              <div className="grid grid-cols-2 gap-1">
                <ControlButton
                  action="punch"
                  label="P"
                  className="bg-red-500/20 border-red-500/50 text-red-400 active:bg-red-500/40"
                  size="lg"
                />
                <ControlButton
                  action="kick"
                  label="K"
                  className="bg-orange-500/20 border-orange-500/50 text-orange-400 active:bg-orange-500/40"
                  size="lg"
                />
              </div>
              
              <ControlButton
                action="block"
                label="BLOCK"
                className="bg-blue-500/20 border-blue-500/50 text-blue-400 active:bg-blue-500/40"
                size="lg"
              />
              
              <ControlButton
                action="special"
                label="SPECIAL"
                className="bg-neon-pink/20 border-neon-pink/50 text-neon-pink active:bg-neon-pink/40"
                size="lg"
              />
            </div>
          </div>

          {/* Special Move Shortcuts */}
          <div className="px-4 pb-4 grid grid-cols-4 gap-1 max-w-lg mx-auto">
            <ControlButton
              action="quarter-circle-forward"
              label="↓↘→"
              className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 active:bg-yellow-500/40"
              size="sm"
            />
            <ControlButton
              action="quarter-circle-back"
              label="↓↙←"
              className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 active:bg-yellow-500/40"
              size="sm"
            />
            <ControlButton
              action="dragon-punch"
              label="→↓↘"
              className="bg-purple-500/20 border-purple-500/50 text-purple-400 active:bg-purple-500/40"
              size="sm"
            />
            <ControlButton
              action="charge-back"
              label="←→"
              className="bg-green-500/20 border-green-500/50 text-green-400 active:bg-green-500/40"
              size="sm"
            />
          </div>
        </div>
      )}

      {/* Gesture Area */}
      {gestureMode && (
        <div 
          className="fixed inset-0 z-30 bg-black/20"
          onTouchStart={handleGestureStart}
          onTouchEnd={handleGestureEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white/60 font-retro text-center">
              <div className="text-xl mb-2">GESTURE MODE</div>
              <div className="text-sm space-y-1">
                <div>Swipe: Movement</div>
                <div>Tap: Punch</div>
                <div>Double-tap: Kick</div>
                <div>Hold: Block</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};