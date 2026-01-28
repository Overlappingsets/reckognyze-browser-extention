import { j as jsxRuntimeExports, c as cn, r as reactExports, R as ReactDOM, a as React, E as ErrorBoundary } from "./globals-DGAE7eSB.js";
import { d as defaultExtensionState, l as loadState } from "./profileStorage-DmT5H2sG.js";
function ProfileSelector({
  profiles,
  activeProfileId,
  onChange,
  disabled
}) {
  if (profiles.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-3 px-4 rounded-md bg-muted text-muted-foreground text-sm text-center", children: 'No profiles yet. Click "Manage Profiles" to create one.' });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "select",
    {
      value: activeProfileId || "",
      onChange: (e) => onChange(e.target.value || null),
      disabled,
      className: cn(
        "w-full py-2 px-3 rounded-md text-sm",
        "bg-secondary text-foreground",
        "border border-border",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "appearance-none cursor-pointer"
      ),
      style: {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.5rem center",
        backgroundSize: "1.5em 1.5em",
        paddingRight: "2.5rem"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a profile" }),
        profiles.map((profile) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: profile.id, children: profile.name || "Unnamed Profile" }, profile.id))
      ]
    }
  );
}
function ToggleButton({ enabled, onToggle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onToggle(true),
        className: cn(
          "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
          enabled ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 12l5 5L20 7", strokeLinecap: "round", strokeLinejoin: "round" }) }),
          "Turn On"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onToggle(false),
        className: cn(
          "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
          !enabled ? "bg-destructive text-destructive-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 6L6 18M6 6l12 12", strokeLinecap: "round", strokeLinejoin: "round" }) }),
          "Turn Off"
        ] })
      }
    )
  ] });
}
function StatusBadge({ detected, enabled }) {
  const getStatus = () => {
    if (!detected) {
      return {
        label: "Reckognyze not detected on this site",
        color: "bg-muted text-muted-foreground",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 8v4M12 16h.01", strokeLinecap: "round" })
        ] })
      };
    }
    if (!enabled) {
      return {
        label: "Reckognyze detected • Disabled",
        color: "bg-amber-500/20 text-amber-400",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 9v4M12 17h.01", strokeLinecap: "round" })
        ] })
      };
    }
    return {
      label: "Reckognyze active • Personalization enabled",
      color: "bg-primary/20 text-primary",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22 11.08V12a10 10 0 11-5.93-9.14", strokeLinecap: "round" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22 4L12 14.01l-3-3", strokeLinecap: "round", strokeLinejoin: "round" })
      ] })
    };
  };
  const status = getStatus();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2 py-2 px-3 rounded-md text-xs font-medium",
        status.color
      ),
      children: [
        status.icon,
        status.label
      ]
    }
  );
}
function Popup() {
  const [state, setState] = reactExports.useState(defaultExtensionState);
  const [reckognyzeStatus, setReckognyzeStatus] = reactExports.useState({ detected: false });
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setLoading(false);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var _a;
      if ((_a = tabs[0]) == null ? void 0 : _a.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "GET_RECKOGNYZE_STATUS" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.debug("Could not get Reckognyze status:", chrome.runtime.lastError);
              return;
            }
            if (response) {
              setReckognyzeStatus(response);
            }
          }
        );
      }
    });
    const handleMessage = (message) => {
      if (message.type === "STATE_UPDATED" && message.state) {
        setState(message.state);
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);
  const handleToggle = async (enabled) => {
    try {
      const response = await chrome.runtime.sendMessage({ type: "SET_ENABLED", enabled });
      if (response) {
        setState(response);
      }
    } catch (error) {
      console.error("Failed to toggle extension:", error);
    }
  };
  const handleProfileChange = async (profileId) => {
    try {
      const response = await chrome.runtime.sendMessage({ type: "SET_ACTIVE_PROFILE", profileId });
      if (response) {
        setState(response);
      }
    } catch (error) {
      console.error("Failed to change profile:", error);
    }
  };
  const handleManageProfiles = async () => {
    try {
      await chrome.runtime.sendMessage({
        type: "SET_PANEL_VISIBLE",
        visible: true
      });
      setTimeout(() => window.close(), 100);
    } catch (error) {
      console.error("Failed to open panel:", error);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          className: "text-primary-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 6v6l4 2", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-semibold text-foreground", children: "Reckognyze" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Personalization" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { detected: reckognyzeStatus.detected, enabled: state.isEnabled }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Active Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProfileSelector,
        {
          profiles: state.profiles,
          activeProfileId: state.activeProfileId,
          onChange: handleProfileChange,
          disabled: !state.isEnabled
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToggleButton,
      {
        enabled: state.isEnabled,
        onToggle: handleToggle
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleManageProfiles,
        className: cn(
          "w-full py-2 px-4 rounded-md text-sm font-medium transition-colors",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          "border border-border"
        ),
        children: "Manage Profiles"
      }
    )
  ] });
}
ReactDOM.createRoot(document.getElementById("popup-root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, {}) }) })
);
