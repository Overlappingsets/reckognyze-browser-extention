import { s as saveState, l as loadState } from "./assets/profileStorage-DmT5H2sG.js";
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse).catch((error) => {
    console.error("Message handling error:", error);
    sendResponse({ error: error.message });
  });
  return true;
});
async function handleMessage(message) {
  switch (message.type) {
    case "GET_STATE": {
      return await loadState();
    }
    case "SET_ENABLED": {
      const state = await loadState();
      state.isEnabled = message.enabled;
      await saveState(state);
      await broadcastStateUpdate(state);
      return state;
    }
    case "SET_ACTIVE_PROFILE": {
      const state = await loadState();
      state.activeProfileId = message.profileId;
      await saveState(state);
      await broadcastStateUpdate(state);
      return state;
    }
    case "SET_PANEL_VISIBLE": {
      const state = await loadState();
      state.panelVisible = message.visible;
      await saveState(state);
      await broadcastStateUpdate(state);
      return state;
    }
    case "UPDATE_STATE": {
      await saveState(message.state);
      await broadcastStateUpdate(message.state);
      return message.state;
    }
    default:
      return null;
  }
}
async function broadcastStateUpdate(state) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: "STATE_UPDATED",
          state
        });
      } catch (error) {
        console.debug(`Could not send message to tab ${tab.id}:`, error);
      }
    }
  }
}
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === "sync" && changes.reckognyze_extension_state) {
    const newState = changes.reckognyze_extension_state.newValue;
    await broadcastStateUpdate(newState);
  }
});
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    console.log("Reckognyze extension installed");
  } else if (details.reason === "update") {
    console.log("Reckognyze extension updated to version", chrome.runtime.getManifest().version);
  }
});
