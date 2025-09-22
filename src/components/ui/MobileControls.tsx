import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileControlsProps {
  onTouch: (action: string, pressed: boolean) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onTouch }) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-background/90 backdrop-blur border-t">
      <div className="p-4 grid grid-cols-6 gap-2 max-w-md mx-auto">
        {/* Movement */}
        <button 
          className="col-span-1 bg-primary/20 border-2 border-primary/40 rounded-lg p-3 font-retro text-xs text-primary"
          onTouchStart={() => onTouch('left', true)}
          onTouchEnd={() => onTouch('left', false)}
        >
          ←
        </button>
        <button 
          className="col-span-1 bg-primary/20 border-2 border-primary/40 rounded-lg p-3 font-retro text-xs text-primary"
          onTouchStart={() => onTouch('right', true)}
          onTouchEnd={() => onTouch('right', false)}
        >
          →
        </button>
        
        {/* Actions */}
        <button 
          className="col-span-1 bg-destructive/20 border-2 border-destructive/40 rounded-lg p-3 font-retro text-xs text-destructive"
          onTouchStart={() => onTouch('punch', true)}
          onTouchEnd={() => onTouch('punch', false)}
        >
          P
        </button>
        <button 
          className="col-span-1 bg-destructive/20 border-2 border-destructive/40 rounded-lg p-3 font-retro text-xs text-destructive"
          onTouchStart={() => onTouch('kick', true)}
          onTouchEnd={() => onTouch('kick', false)}
        >
          K
        </button>
        <button 
          className="col-span-1 bg-neon-cyan/20 border-2 border-neon-cyan/40 rounded-lg p-3 font-retro text-xs text-neon-cyan"
          onTouchStart={() => onTouch('block', true)}
          onTouchEnd={() => onTouch('block', false)}
        >
          B
        </button>
        <button 
          className="col-span-1 bg-neon-pink/20 border-2 border-neon-pink/40 rounded-lg p-3 font-retro text-xs text-neon-pink"
          onTouchStart={() => onTouch('special', true)}
          onTouchEnd={() => onTouch('special', false)}
        >
          SP
        </button>
      </div>
    </div>
  );
};