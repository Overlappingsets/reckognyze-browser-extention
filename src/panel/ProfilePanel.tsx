import React, { useEffect, useState } from 'react';
import { ExtensionState, UserProfile, defaultExtensionState, defaultProfile } from '@/types/profile';
import { createProfile } from '@/storage/profileStorage';
import { ProfileForm } from '@/components/ProfileForm';
import { cn } from '@/lib/utils';

export function ProfilePanel() {
  const [state, setState] = useState<ExtensionState>(defaultExtensionState);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Listen for state updates from content script (via parent window)
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from parent
      if (event.source !== window.parent) return;
      
      if (event.data?.type === 'STATE_UPDATED') {
        setState(event.data.state);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Request initial state from content script
    window.parent.postMessage({ 
      source: 'reckognyze-panel', 
      type: 'REQUEST_STATE' 
    }, '*');
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleClose = () => {
    window.parent.postMessage({ source: 'reckognyze-panel', type: 'CLOSE_PANEL' }, '*');
  };

  const handleCreateProfile = () => {
    const newProfile = createProfile({ ...defaultProfile, name: 'New Profile' });
    setEditingProfile(newProfile);
    setIsCreating(true);
  };

  const handleEditProfile = (profile: UserProfile) => {
    setEditingProfile({ ...profile });
    setIsCreating(false);
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    setIsSaving(true);
    try {
      const newState = { ...state };
      
      if (isCreating) {
        newState.profiles.push(profile);
        if (newState.profiles.length === 1) {
          newState.activeProfileId = profile.id;
        }
      } else {
        const index = newState.profiles.findIndex((p) => p.id === profile.id);
        if (index !== -1) {
          newState.profiles[index] = { 
            ...profile, 
            updatedAt: new Date().toISOString() 
          };
        }
      }
      
      // Save through service worker for proper broadcast
      const response = await chrome.runtime.sendMessage({
        type: 'UPDATE_STATE',
        state: newState
      });
      
      if (response) {
        setState(response);
        setEditingProfile(null);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    setIsSaving(true);
    try {
      const newState = { ...state };
      newState.profiles = newState.profiles.filter((p) => p.id !== profileId);
      
      if (newState.activeProfileId === profileId) {
        newState.activeProfileId = newState.profiles.length > 0 ? newState.profiles[0].id : null;
      }
      
      // Save through service worker
      const response = await chrome.runtime.sendMessage({
        type: 'UPDATE_STATE',
        state: newState
      });
      
      if (response) {
        setState(response);
        setEditingProfile(null);
      }
    } catch (error) {
      console.error('Failed to delete profile:', error);
      alert('Failed to delete profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetActive = async (profileId: string) => {
    try {
      const response = await chrome.runtime.sendMessage({ 
        type: 'SET_ACTIVE_PROFILE', 
        profileId 
      });
      
      if (response) {
        setState(response);
      }
    } catch (error) {
      console.error('Failed to set active profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProfile(null);
    setIsCreating(false);
  };

  const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId);

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary-foreground"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm">Reckognyze</h1>
            <p className="text-xs text-muted-foreground">Profile Manager</p>
          </div>
        </div>
        
        {/* Close button - only on desktop/tablet */}
        {!isMobile && (
          <button
            onClick={handleClose}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {editingProfile ? (
          <ProfileForm
            profile={editingProfile}
            isNew={isCreating}
            isSaving={isSaving}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
            onDelete={!isCreating ? () => handleDeleteProfile(editingProfile.id) : undefined}
          />
        ) : (
          <div className="p-4 space-y-4">
            {/* Active Profile */}
            {activeProfile && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active Profile
                </label>
                <div
                  className={cn(
                    'p-3 rounded-lg border-2 border-primary bg-primary/10 cursor-pointer',
                    'hover:bg-primary/20 transition-colors'
                  )}
                  onClick={() => handleEditProfile(activeProfile)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      {activeProfile.name.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {activeProfile.name || 'Unnamed Profile'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activeProfile.tshirtSize} • {activeProfile.genderIdentity || 'Not specified'}
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted-foreground"
                    >
                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Other Profiles */}
            {state.profiles.filter((p) => p.id !== state.activeProfileId).length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Other Profiles
                </label>
                <div className="space-y-2">
                  {state.profiles
                    .filter((p) => p.id !== state.activeProfileId)
                    .map((profile) => (
                      <div
                        key={profile.id}
                        className={cn(
                          'p-3 rounded-lg border border-border bg-secondary/50 cursor-pointer',
                          'hover:bg-secondary transition-colors'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold">
                            {profile.name.charAt(0).toUpperCase() || 'P'}
                          </div>
                          <div
                            className="flex-1 min-w-0"
                            onClick={() => handleEditProfile(profile)}
                          >
                            <p className="font-medium text-foreground truncate">
                              {profile.name || 'Unnamed Profile'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {profile.tshirtSize} • {profile.genderIdentity || 'Not specified'}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetActive(profile.id);
                            }}
                            className="px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                          >
                            Set Active
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Add Profile Button */}
            <button
              onClick={handleCreateProfile}
              className={cn(
                'w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors',
                'border-2 border-dashed border-border',
                'text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5',
                'flex items-center justify-center gap-2'
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Add New Profile
            </button>

            {/* Empty State */}
            {state.profiles.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-primary"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Welcome to Reckognyze!
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                  Create your first profile to start personalizing your web experience
                </p>
                <button
                  onClick={handleCreateProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                  Create Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
