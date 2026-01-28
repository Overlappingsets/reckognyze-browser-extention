import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleButtonProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function ToggleButton({ enabled, onToggle }: ToggleButtonProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onToggle(true)}
        className={cn(
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
          enabled
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
        )}
      >
        <span className="flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Turn On
        </span>
      </button>
      <button
        onClick={() => onToggle(false)}
        className={cn(
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
          !enabled
            ? 'bg-destructive text-destructive-foreground shadow-md'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
        )}
      >
        <span className="flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Turn Off
        </span>
      </button>
    </div>
  );
}
