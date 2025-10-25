import React, { ReactNode } from 'react';

interface NavigationBeaconProps {
  children: ReactNode;
  label?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  show?: boolean;
}

export const NavigationBeacon: React.FC<NavigationBeaconProps> = ({
  children,
  label = 'Start here!',
  position = 'top',
  show = true,
}) => {
  if (!show) return <>{children}</>;

  const positionClasses = {
    top: '-top-12 left-1/2 -translate-x-1/2',
    bottom: '-bottom-12 left-1/2 -translate-x-1/2',
    left: 'top-1/2 -left-32 -translate-y-1/2',
    right: 'top-1/2 -right-32 -translate-y-1/2',
  };

  return (
    <div className="relative inline-block">
      {/* Pulsing Glow Effect */}
      <div className="absolute inset-0 animate-pulse">
        <div className="absolute inset-0 rounded-lg bg-primary/30 blur-xl" />
        <div className="absolute inset-0 rounded-lg bg-primary/20 blur-2xl animate-ping" />
      </div>

      {/* Floating Label */}
      <div className={`absolute ${positionClasses[position]} z-50 pointer-events-none`}>
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap animate-bounce shadow-lg">
          {label}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary" />
        </div>
      </div>

      {/* Content with glow border */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};
