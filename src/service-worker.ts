import { loadState, saveState } from '@/storage/profileStorage';
import { ExtensionState, ReckognyzeStatus } from '@/types/profile';

// Message types
type MessageType =
  | { type: 'GET_STATE' }
  | { type: 'SET_ENABLED'; enabled: boolean }
  | { type: 'SET_ACTIVE_PROFILE'; profileId: string | null }
  | { type: 'SET_PANEL_VISIBLE'; visible: boolean }
  | { type: 'STATE_UPDATED'; state: ExtensionState }
  | { type: 'RECKOGNYZE_STATUS'; status: ReckognyzeStatus }
  | { type: 'GET_RECKOGNYZE_STATUS' }
  | { type: 'UPDATE_STATE'; state: ExtensionState };

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message: MessageType, _sender, sendResponse) => {
  handleMessage(message)
    .then(sendResponse)
    .catch((error) => {
      console.error('Message handling error:', error);
      sendResponse({ error: error.message });
    });
  return true; // Keep the message channel open for async response
});

async function handleMessage(message: MessageType): Promise<unknown> {
  switch (message.type) {
    case 'GET_STATE': {
      return await loadState();
    }
    
    case 'SET_ENABLED': {
      const state = await loadState();
      state.isEnabled = message.enabled;
      await saveState(state);
      await broadcastStateUpdate(state);
      return state;
    }
    
    case 'SET_ACTIVE_PROFILE': {
      const state = await loadState();
      state.activeProfileId = message.profileId;
      await saveState(state);
      await broadcastStateUpdate(state);
      return state;
    }
    
    case 'SET_PANEL_VISIBLE': {
      const state = await loadState();
      state.panelVisible = message.visible;
      await saveState(state);
      await broadcastStateUpdate(state);
      return state;
    }
    
    case 'UPDATE_STATE': {
      await saveState(message.state);
      await broadcastStateUpdate(message.state);
      return message.state;
    }
    
    default:
      return null;
  }
}

// Broadcast state updates to all tabs
async function broadcastStateUpdate(state: ExtensionState): Promise<void> {
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    if (tab.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'STATE_UPDATED',
          state,
        });
      } catch (error) {
        // Tab might not have content script loaded
        console.debug(`Could not send message to tab ${tab.id}:`, error);
      }
    }
  }
}

// Listen for storage changes and broadcast updates
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === 'sync' && changes.reckognyze_extension_state) {
    const newState = changes.reckognyze_extension_state.newValue as ExtensionState;
    await broadcastStateUpdate(newState);
  }
});

// Handle extension install/update
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('Reckognyze extension installed');
  } else if (details.reason === 'update') {
    console.log('Reckognyze extension updated to version', chrome.runtime.getManifest().version);
  }
});

export {};
