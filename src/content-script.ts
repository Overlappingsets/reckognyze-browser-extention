import { ExtensionState, UserProfile } from '@/types/profile';

// Inject the panel iframe and FAB into the page
let panelIframe: HTMLIFrameElement | null = null;
let fabElement: HTMLDivElement | null = null;
let currentState: ExtensionState | null = null;

// Check for Reckognyze script on the page
function detectReckognyze(): boolean {
  const hasRzObject = !!(window as any).rz || !!(window as any).ReckognyzeObject;
  const hasRzScript = !!document.querySelector('script[src*="reckognyze"]');
  const hasRzDataAttr = !!document.querySelector('[data-reckognyze]');
  
  return hasRzObject || hasRzScript || hasRzDataAttr;
}

// Send profile data to Reckognyze
function sendProfileToReckognyze(profile: UserProfile): void {
  const rz = (window as any).rz;
  if (typeof rz === 'function') {
    rz('setUserProfile', {
      name: profile.name,
      genderIdentity: profile.genderIdentity,
      height: profile.height,
      heightUnit: profile.heightUnit,
      waistSize: profile.waistSize,
      waistUnit: profile.waistUnit,
      shoeSize: profile.shoeSize,
      shoeRegion: profile.shoeRegion,
      tshirtSize: profile.tshirtSize,
      colorPreferences: profile.colorPreferences,
      allergies: profile.allergies,
      isMarried: profile.isMarried,
      hasChildren: profile.hasChildren,
    });
  }
}

// Create the floating action button
function createFAB(): HTMLDivElement {
  const fab = document.createElement('div');
  fab.id = 'reckognyze-fab';
  fab.setAttribute('role', 'button');
  fab.setAttribute('aria-label', 'Toggle Reckognyze panel');
  fab.setAttribute('tabindex', '0');
  
  fab.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  fab.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(142 76% 26%) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 2147483646;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: none;
  `;

  fab.addEventListener('mouseenter', () => {
    fab.style.transform = 'scale(1.1)';
    fab.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
  });

  fab.addEventListener('mouseleave', () => {
    fab.style.transform = 'scale(1)';
    fab.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  });

  fab.addEventListener('click', () => {
    togglePanel();
  });

  fab.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePanel();
    }
  });

  return fab;
}

// Create the profile panel iframe
function createPanelIframe(): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.id = 'reckognyze-panel';
  // FIXED: Use panel.html instead of panel/index.html
  iframe.src = chrome.runtime.getURL('panel.html');
  iframe.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    border: none;
    z-index: 2147483647;
    background: transparent;
    transition: transform 0.3s ease;
    transform: translateX(-100%);
  `;
  
  // Responsive width
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    iframe.style.width = 'calc(100vw - 60px)';
  } else {
    const width = Math.max(280, Math.min(400, window.innerWidth * 0.2));
    iframe.style.width = `${width}px`;
  }

  return iframe;
}

// Create mobile overlay
function createMobileOverlay(): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.id = 'reckognyze-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 60px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 2147483646;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  `;

  overlay.addEventListener('click', () => {
    hidePanel();
  });

  return overlay;
}

let mobileOverlay: HTMLDivElement | null = null;

function togglePanel(): void {
  if (panelIframe) {
    const isVisible = panelIframe.style.transform === 'translateX(0px)';
    if (isVisible) {
      hidePanel();
    } else {
      showPanel();
    }
  }
}

function showPanel(): void {
  if (panelIframe) {
    panelIframe.style.transform = 'translateX(0)';
    
    // Show mobile overlay on small screens
    if (window.innerWidth < 768 && mobileOverlay) {
      mobileOverlay.style.opacity = '1';
      mobileOverlay.style.pointerEvents = 'auto';
    }
    
    // Don't notify service worker to avoid quota - panel will request state on load
  }
}

function hidePanel(): void {
  if (panelIframe) {
    panelIframe.style.transform = 'translateX(-100%)';
    
    // Hide mobile overlay
    if (mobileOverlay) {
      mobileOverlay.style.opacity = '0';
      mobileOverlay.style.pointerEvents = 'none';
    }
  }
}

// Initialize the content script
async function init(): Promise<void> {
  try {
    // Get initial state from service worker
    const state = await chrome.runtime.sendMessage({ type: 'GET_STATE' }) as ExtensionState;
    currentState = state;
    updateUI(state);
    
    // If enabled and has active profile, send to Reckognyze
    if (state.isEnabled && state.activeProfileId) {
      const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);
      if (activeProfile && detectReckognyze()) {
        sendProfileToReckognyze(activeProfile);
      }
    }

    // Report Reckognyze detection status
    const detected = detectReckognyze();
    await chrome.runtime.sendMessage({
      type: 'RECKOGNYZE_STATUS',
      status: { detected },
    });
  } catch (error) {
    console.error('Reckognyze initialization failed:', error);
  }
}

// Update UI based on extension state
function updateUI(state: ExtensionState): void {
  if (state.isEnabled) {
    // Add FAB if not present
    if (!fabElement) {
      fabElement = createFAB();
      document.body.appendChild(fabElement);
    }
    
    // Add panel iframe if not present
    if (!panelIframe) {
      panelIframe = createPanelIframe();
      document.body.appendChild(panelIframe);
      
      // Add mobile overlay
      if (window.innerWidth < 768) {
        mobileOverlay = createMobileOverlay();
        document.body.appendChild(mobileOverlay);
      }
    }
    
    // Update panel visibility
    if (state.panelVisible) {
      showPanel();
    } else {
      hidePanel();
    }
  } else {
    // Remove FAB and panel when disabled
    if (fabElement) {
      fabElement.remove();
      fabElement = null;
    }
    if (panelIframe) {
      panelIframe.remove();
      panelIframe = null;
    }
    if (mobileOverlay) {
      mobileOverlay.remove();
      mobileOverlay = null;
    }
  }
}

// Listen for state updates from service worker
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'STATE_UPDATED') {
    currentState = message.state;
    updateUI(message.state);
    
    // Send updated profile to Reckognyze
    if (message.state.isEnabled && message.state.activeProfileId && detectReckognyze()) {
      const activeProfile = message.state.profiles.find(
        (p: UserProfile) => p.id === message.state.activeProfileId
      );
      if (activeProfile) {
        sendProfileToReckognyze(activeProfile);
      }
    }
    sendResponse({ success: true });
  } else if (message.type === 'GET_RECKOGNYZE_STATUS') {
    // Respond to popup's request for Reckognyze detection status
    sendResponse({ detected: detectReckognyze() });
    return true; // Keep channel open
  } else if (message.type === 'SET_PANEL_VISIBLE') {
    // Handle direct panel visibility requests
    if (message.visible) {
      showPanel();
    } else {
      hidePanel();
    }
    sendResponse({ success: true });
  }
  
  return false;
});

// Handle window resize for responsive panel
window.addEventListener('resize', () => {
  if (panelIframe) {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      panelIframe.style.width = 'calc(100vw - 60px)';
      
      // Add overlay if needed
      if (!mobileOverlay) {
        mobileOverlay = createMobileOverlay();
        document.body.appendChild(mobileOverlay);
      }
    } else {
      const width = Math.max(280, Math.min(400, window.innerWidth * 0.2));
      panelIframe.style.width = `${width}px`;
      
      // Remove overlay on desktop
      if (mobileOverlay) {
        mobileOverlay.remove();
        mobileOverlay = null;
      }
    }
  }
});

// Listen for messages from panel iframe
window.addEventListener('message', (event) => {
  // Only accept messages from our iframe
  if (event.source !== panelIframe?.contentWindow) return;
  
  if (event.data?.source === 'reckognyze-panel') {
    if (event.data.type === 'CLOSE_PANEL') {
      hidePanel();
    } else if (event.data.type === 'REQUEST_STATE') {
      // Send current state to panel
      if (currentState && panelIframe?.contentWindow) {
        panelIframe.contentWindow.postMessage({
          type: 'STATE_UPDATED',
          state: currentState
        }, '*');
      }
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export {};