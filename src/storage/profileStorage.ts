import { ExtensionState, UserProfile, defaultExtensionState, defaultProfile } from '@/types/profile';

const STORAGE_KEY = 'reckognyze_extension_state';

// Debounce timer to prevent quota exceeded errors
let saveTimeout: NodeJS.Timeout | null = null;
const SAVE_DEBOUNCE_MS = 1000; // Wait 1 second before saving

export async function loadState(): Promise<ExtensionState> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    return result[STORAGE_KEY] || defaultExtensionState;
  } catch (error) {
    console.error('Failed to load extension state:', error);
    return defaultExtensionState;
  }
}

export async function saveState(state: ExtensionState): Promise<void> {
  // Clear any pending save
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Debounce the save operation
  return new Promise((resolve, reject) => {
    saveTimeout = setTimeout(async () => {
      try {
        await chrome.storage.sync.set({ [STORAGE_KEY]: state });
        resolve();
      } catch (error) {
        console.error('Failed to save extension state:', error);
        reject(error);
      }
    }, SAVE_DEBOUNCE_MS);
  });
}

export function generateId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createProfile(data: Partial<UserProfile>): UserProfile {
  const now = new Date().toISOString();
  return {
    ...defaultProfile,
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
}

export async function addProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
  const state = await loadState();
  const newProfile = createProfile(profile);
  state.profiles.push(newProfile);
  
  // If this is the first profile, set it as active
  if (state.profiles.length === 1) {
    state.activeProfileId = newProfile.id;
  }
  
  await saveState(state);
  return newProfile;
}

export async function updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const state = await loadState();
  const index = state.profiles.findIndex((p) => p.id === id);
  
  if (index === -1) return null;
  
  state.profiles[index] = {
    ...state.profiles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await saveState(state);
  return state.profiles[index];
}

export async function deleteProfile(id: string): Promise<boolean> {
  const state = await loadState();
  const index = state.profiles.findIndex((p) => p.id === id);
  
  if (index === -1) return false;
  
  state.profiles.splice(index, 1);
  
  // If we deleted the active profile, switch to another or null
  if (state.activeProfileId === id) {
    state.activeProfileId = state.profiles.length > 0 ? state.profiles[0].id : null;
  }
  
  await saveState(state);
  return true;
}

export async function setActiveProfile(id: string | null): Promise<void> {
  const state = await loadState();
  state.activeProfileId = id;
  await saveState(state);
}

export async function setEnabled(enabled: boolean): Promise<void> {
  const state = await loadState();
  state.isEnabled = enabled;
  await saveState(state);
}

export async function setPanelVisible(visible: boolean): Promise<void> {
  const state = await loadState();
  state.panelVisible = visible;
  await saveState(state);
}

export async function getActiveProfile(): Promise<UserProfile | null> {
  const state = await loadState();
  if (!state.activeProfileId) return null;
  return state.profiles.find((p) => p.id === state.activeProfileId) || null;
}