import React from 'react';
import { UserProfile } from '@/types/profile';
import { cn } from '@/lib/utils';

interface ProfileSelectorProps {
  profiles: UserProfile[];
  activeProfileId: string | null;
  onChange: (profileId: string | null) => void;
  disabled?: boolean;
}

export function ProfileSelector({
  profiles,
  activeProfileId,
  onChange,
  disabled,
}: ProfileSelectorProps) {
  if (profiles.length === 0) {
    return (
      <div className="py-3 px-4 rounded-md bg-muted text-muted-foreground text-sm text-center">
        No profiles yet. Click "Manage Profiles" to create one.
      </div>
    );
  }

  return (
    <select
      value={activeProfileId || ''}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      className={cn(
        'w-full py-2 px-3 rounded-md text-sm',
        'bg-secondary text-foreground',
        'border border-border',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'appearance-none cursor-pointer'
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.5rem center',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '2.5rem',
      }}
    >
      <option value="">Select a profile</option>
      {profiles.map((profile) => (
        <option key={profile.id} value={profile.id}>
          {profile.name || 'Unnamed Profile'}
        </option>
      ))}
    </select>
  );
}
