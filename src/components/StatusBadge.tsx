import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  detected: boolean;
  enabled: boolean;
}

export function StatusBadge({ detected, enabled }: StatusBadgeProps) {
  const getStatus = () => {
    if (!detected) {
      return {
        label: 'Reckognyze not detected on this site',
        color: 'bg-muted text-muted-foreground',
        icon: (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
        ),
      };
    }
    if (!enabled) {
      return {
        label: 'Reckognyze detected • Disabled',
        color: 'bg-amber-500/20 text-amber-400',
        icon: (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
          </svg>
        ),
      };
    }
    return {
      label: 'Reckognyze active • Personalization enabled',
      color: 'bg-primary/20 text-primary',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
          <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  };

  const status = getStatus();

  return (
    <div
      className={cn(
        'flex items-center gap-2 py-2 px-3 rounded-md text-xs font-medium',
        status.color
      )}
    >
      {status.icon}
      {status.label}
    </div>
  );
}
