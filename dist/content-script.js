let panelIframe = null;
let fabElement = null;
let currentState = null;
function detectReckognyze() {
  const hasRzObject = !!window.rz || !!window.ReckognyzeObject;
  const hasRzScript = !!document.querySelector('script[src*="reckognyze"]');
  const hasRzDataAttr = !!document.querySelector("[data-reckognyze]");
  return hasRzObject || hasRzScript || hasRzDataAttr;
}
function sendProfileToReckognyze(profile) {
  const rz = window.rz;
  if (typeof rz === "function") {
    rz("setUserProfile", {
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
      hasChildren: profile.hasChildren
    });
  }
}
function createFAB() {
  const fab = document.createElement("div");
  fab.id = "reckognyze-fab";
  fab.setAttribute("role", "button");
  fab.setAttribute("aria-label", "Toggle Reckognyze panel");
  fab.setAttribute("tabindex", "0");
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
  fab.addEventListener("mouseenter", () => {
    fab.style.transform = "scale(1.1)";
    fab.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
  });
  fab.addEventListener("mouseleave", () => {
    fab.style.transform = "scale(1)";
    fab.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
  });
  fab.addEventListener("click", () => {
    togglePanel();
  });
  fab.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePanel();
    }
  });
  return fab;
}
function createPanelIframe() {
  const iframe = document.createElement("iframe");
  iframe.id = "reckognyze-panel";
  iframe.src = chrome.runtime.getURL("panel.html");
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
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    iframe.style.width = "calc(100vw - 60px)";
  } else {
    const width = Math.max(280, Math.min(400, window.innerWidth * 0.2));
    iframe.style.width = `${width}px`;
  }
  return iframe;
}
function createMobileOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "reckognyze-overlay";
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
  overlay.addEventListener("click", () => {
    hidePanel();
  });
  return overlay;
}
let mobileOverlay = null;
function togglePanel() {
  if (panelIframe) {
    const isVisible = panelIframe.style.transform === "translateX(0px)";
    if (isVisible) {
      hidePanel();
    } else {
      showPanel();
    }
  }
}
function showPanel() {
  if (panelIframe) {
    panelIframe.style.transform = "translateX(0)";
    if (window.innerWidth < 768 && mobileOverlay) {
      mobileOverlay.style.opacity = "1";
      mobileOverlay.style.pointerEvents = "auto";
    }
  }
}
function hidePanel() {
  if (panelIframe) {
    panelIframe.style.transform = "translateX(-100%)";
    if (mobileOverlay) {
      mobileOverlay.style.opacity = "0";
      mobileOverlay.style.pointerEvents = "none";
    }
  }
}
async function init() {
  try {
    const state = await chrome.runtime.sendMessage({ type: "GET_STATE" });
    currentState = state;
    updateUI(state);
    if (state.isEnabled && state.activeProfileId) {
      const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId);
      if (activeProfile && detectReckognyze()) {
        sendProfileToReckognyze(activeProfile);
      }
    }
    const detected = detectReckognyze();
    await chrome.runtime.sendMessage({
      type: "RECKOGNYZE_STATUS",
      status: { detected }
    });
  } catch (error) {
    console.error("Reckognyze initialization failed:", error);
  }
}
function updateUI(state) {
  if (state.isEnabled) {
    if (!fabElement) {
      fabElement = createFAB();
      document.body.appendChild(fabElement);
    }
    if (!panelIframe) {
      panelIframe = createPanelIframe();
      document.body.appendChild(panelIframe);
      if (window.innerWidth < 768) {
        mobileOverlay = createMobileOverlay();
        document.body.appendChild(mobileOverlay);
      }
    }
    if (state.panelVisible) {
      showPanel();
    } else {
      hidePanel();
    }
  } else {
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
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "STATE_UPDATED") {
    currentState = message.state;
    updateUI(message.state);
    if (message.state.isEnabled && message.state.activeProfileId && detectReckognyze()) {
      const activeProfile = message.state.profiles.find(
        (p) => p.id === message.state.activeProfileId
      );
      if (activeProfile) {
        sendProfileToReckognyze(activeProfile);
      }
    }
    sendResponse({ success: true });
  } else if (message.type === "GET_RECKOGNYZE_STATUS") {
    sendResponse({ detected: detectReckognyze() });
    return true;
  } else if (message.type === "SET_PANEL_VISIBLE") {
    if (message.visible) {
      showPanel();
    } else {
      hidePanel();
    }
    sendResponse({ success: true });
  }
  return false;
});
window.addEventListener("resize", () => {
  if (panelIframe) {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      panelIframe.style.width = "calc(100vw - 60px)";
      if (!mobileOverlay) {
        mobileOverlay = createMobileOverlay();
        document.body.appendChild(mobileOverlay);
      }
    } else {
      const width = Math.max(280, Math.min(400, window.innerWidth * 0.2));
      panelIframe.style.width = `${width}px`;
      if (mobileOverlay) {
        mobileOverlay.remove();
        mobileOverlay = null;
      }
    }
  }
});
window.addEventListener("message", (event) => {
  var _a;
  if (event.source !== (panelIframe == null ? void 0 : panelIframe.contentWindow)) return;
  if (((_a = event.data) == null ? void 0 : _a.source) === "reckognyze-panel") {
    if (event.data.type === "CLOSE_PANEL") {
      hidePanel();
    } else if (event.data.type === "REQUEST_STATE") {
      if (currentState && (panelIframe == null ? void 0 : panelIframe.contentWindow)) {
        panelIframe.contentWindow.postMessage({
          type: "STATE_UPDATED",
          state: currentState
        }, "*");
      }
    }
  }
});
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
