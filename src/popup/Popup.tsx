import React, { useEffect, useState } from 'react';
import { ExtensionState, ReckognyzeStatus, defaultExtensionState } from '@/types/profile';
import { loadState } from '@/storage/profileStorage';
import { ProfileSelector } from '@/components/ProfileSelector';
import { ToggleButton } from '@/components/ToggleButton';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export function Popup() {
  const [state, setState] = useState<ExtensionState>(defaultExtensionState);
  const [reckognyzeStatus, setReckognyzeStatus] = useState<ReckognyzeStatus>({ detected: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial state
    loadState().then((s) => {
      setState(s);
      setLoading(false);
    });

    // Get Reckognyze status from active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'GET_RECKOGNYZE_STATUS' },
          (response: ReckognyzeStatus) => {
            if (chrome.runtime.lastError) {
              console.debug('Could not get Reckognyze status:', chrome.runtime.lastError);
              return;
            }
            if (response) {
              setReckognyzeStatus(response);
            }
          }
        );
      }
    });

    // Listen for state updates
    const handleMessage = (message: { type: string; state?: ExtensionState }) => {
      if (message.type === 'STATE_UPDATED' && message.state) {
        setState(message.state);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const handleToggle = async (enabled: boolean) => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'SET_ENABLED', enabled });
      if (response) {
        setState(response);
      }
    } catch (error) {
      console.error('Failed to toggle extension:', error);
    }
  };

  const handleProfileChange = async (profileId: string | null) => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'SET_ACTIVE_PROFILE', profileId });
      if (response) {
        setState(response);
      }
    } catch (error) {
      console.error('Failed to change profile:', error);
    }
  };

  const handleManageProfiles = async () => {
    try {
      // Update state through service worker
      await chrome.runtime.sendMessage({ 
        type: 'SET_PANEL_VISIBLE', 
        visible: true 
      });
      
      // Service worker will broadcast to all tabs
      // Close popup after short delay to ensure message is sent
      setTimeout(() => window.close(), 100);
    } catch (error) {
      console.error('Failed to open panel:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary-foreground"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="font-semibold text-foreground">Reckognyze</h1>
          <p className="text-xs text-muted-foreground">Personalization</p>
        </div>
      </div>

      {/* Status */}
      <StatusBadge detected={reckognyzeStatus.detected} enabled={state.isEnabled} />

      {/* Profile Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Active Profile</label>
        <ProfileSelector
          profiles={state.profiles}
          activeProfileId={state.activeProfileId}
          onChange={handleProfileChange}
          disabled={!state.isEnabled}
        />
      </div>

      {/* Toggle Buttons */}
      <div className="space-y-2">
        <ToggleButton
          enabled={state.isEnabled}
          onToggle={handleToggle}
        />
      </div>

      {/* Manage Profiles */}
      <button
        onClick={handleManageProfiles}
        className={cn(
          'w-full py-2 px-4 rounded-md text-sm font-medium transition-colors',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          'border border-border'
        )}
      >
        Manage Profiles
      </button>
    </div>
  );
}
