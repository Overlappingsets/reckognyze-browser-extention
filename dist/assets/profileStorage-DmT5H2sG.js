const defaultProfile = {
  name: "",
  genderIdentity: "",
  height: "",
  heightUnit: "cm",
  waistSize: "",
  waistUnit: "inches",
  shoeSize: "",
  shoeRegion: "US",
  tshirtSize: "M",
  colorPreferences: [],
  allergies: [],
  isMarried: false,
  hasChildren: false
};
const defaultExtensionState = {
  isEnabled: false,
  activeProfileId: null,
  profiles: [],
  panelVisible: false
};
const STORAGE_KEY = "reckognyze_extension_state";
let saveTimeout = null;
const SAVE_DEBOUNCE_MS = 1e3;
async function loadState() {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    return result[STORAGE_KEY] || defaultExtensionState;
  } catch (error) {
    console.error("Failed to load extension state:", error);
    return defaultExtensionState;
  }
}
async function saveState(state) {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  return new Promise((resolve, reject) => {
    saveTimeout = setTimeout(async () => {
      try {
        await chrome.storage.sync.set({ [STORAGE_KEY]: state });
        resolve();
      } catch (error) {
        console.error("Failed to save extension state:", error);
        reject(error);
      }
    }, SAVE_DEBOUNCE_MS);
  });
}
function generateId() {
  return `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
function createProfile(data) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    ...defaultProfile,
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now
  };
}
export {
  defaultProfile as a,
  createProfile as c,
  defaultExtensionState as d,
  loadState as l,
  saveState as s
};
