import { r as reactExports, j as jsxRuntimeExports, c as cn, R as ReactDOM, a as React, E as ErrorBoundary } from "./globals-DGAE7eSB.js";
import { d as defaultExtensionState, c as createProfile, a as defaultProfile } from "./profileStorage-DmT5H2sG.js";
function sanitizeString(input, maxLength = 100) {
  return input.trim().slice(0, maxLength).replace(/[<>]/g, "");
}
function sanitizeColor(color) {
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  if (hexPattern.test(color)) {
    return color.toLowerCase();
  }
  return "#3b82f6";
}
function sanitizeTag(tag) {
  return sanitizeString(tag, 50).replace(/[^\w\s-]/g, "");
}
const PRESET_COLORS = [
  "#ef4444",
  // red
  "#f97316",
  // orange
  "#eab308",
  // yellow
  "#22c55e",
  // green
  "#06b6d4",
  // cyan
  "#3b82f6",
  // blue
  "#8b5cf6",
  // violet
  "#ec4899",
  // pink
  "#000000",
  // black
  "#ffffff",
  // white
  "#6b7280",
  // gray
  "#92400e"
  // brown
];
function ColorPicker({ colors, onChange, disabled = false }) {
  const [customColor, setCustomColor] = reactExports.useState("#3b82f6");
  const toggleColor = (color) => {
    if (colors.includes(color)) {
      onChange(colors.filter((c) => c !== color));
    } else {
      onChange([...colors, color]);
    }
  };
  const addCustomColor = () => {
    const sanitized = sanitizeColor(customColor);
    if (!colors.includes(sanitized)) {
      onChange([...colors, sanitized]);
    }
  };
  const removeColor = (color) => {
    onChange(colors.filter((c) => c !== color));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    colors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: colors.map((color) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1 px-2 py-1 rounded-md bg-secondary border border-border",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-4 h-4 rounded-sm border border-border",
              style: { backgroundColor: color }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: color }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => removeColor(color),
              disabled,
              className: "ml-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed",
              "aria-label": `Remove color ${color}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 6L6 18M6 6l12 12", strokeLinecap: "round", strokeLinejoin: "round" }) })
            }
          )
        ]
      },
      color
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: PRESET_COLORS.map((color) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => toggleColor(color),
        disabled,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleColor(color);
          }
        },
        className: cn(
          "w-7 h-7 rounded-md border-2 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          colors.includes(color) ? "border-primary ring-2 ring-primary/30 scale-110" : "border-border hover:border-muted-foreground"
        ),
        style: { backgroundColor: color },
        "aria-label": `${colors.includes(color) ? "Remove" : "Add"} color ${color}`
      },
      color
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "color",
          value: customColor,
          onChange: (e) => setCustomColor(e.target.value),
          disabled,
          className: "w-8 h-8 rounded cursor-pointer border-0 p-0 disabled:opacity-50 disabled:cursor-not-allowed",
          "aria-label": "Pick custom color"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: customColor,
          onChange: (e) => setCustomColor(e.target.value),
          disabled,
          className: cn(
            "flex-1 py-1.5 px-2 rounded-md text-xs",
            "bg-secondary text-foreground",
            "border border-border",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          ),
          placeholder: "#3b82f6"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: addCustomColor,
          disabled,
          className: cn(
            "px-3 py-1.5 rounded-md text-xs font-medium",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          ),
          children: "Add"
        }
      )
    ] })
  ] });
}
function TagInput({ tags, onChange, placeholder = "Add tag...", disabled = false }) {
  const [inputValue, setInputValue] = reactExports.useState("");
  const addTag = (tag) => {
    const sanitized = sanitizeTag(tag);
    if (sanitized && !tags.includes(sanitized)) {
      onChange([...tags, sanitized]);
    }
    setInputValue("");
  };
  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1 px-2 py-1 rounded-md bg-secondary border border-border",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: tag }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => removeTag(tag),
              disabled,
              className: "ml-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed",
              "aria-label": `Remove ${tag}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 6L6 18M6 6l12 12", strokeLinecap: "round", strokeLinejoin: "round" }) })
            }
          )
        ]
      },
      tag
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value: inputValue,
        onChange: (e) => setInputValue(e.target.value),
        onKeyDown: handleKeyDown,
        placeholder,
        disabled,
        className: cn(
          "w-full py-2 px-3 rounded-md text-sm",
          "bg-secondary text-foreground placeholder:text-muted-foreground",
          "border border-border",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )
      }
    )
  ] });
}
const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const HEIGHT_UNITS = ["cm", "ft-in"];
const SIZE_UNITS = ["inches", "cm"];
const SHOE_REGIONS = ["US", "UK", "EU"];
const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
  "Other"
];
function ProfileForm({ profile, isNew, isSaving = false, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = reactExports.useState(profile);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Profile name is required";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be 50 characters or less";
    }
    if (formData.colorPreferences.length > 10) {
      newErrors.colors = "Maximum 10 colors allowed";
    }
    if (formData.allergies.length > 20) {
      newErrors.allergies = "Maximum 20 allergies allowed";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    onSave(formData);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-4 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: isNew ? "Create Profile" : "Edit Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          disabled: isSaving,
          className: "p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50",
          "aria-label": "Close form",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 6L6 18M6 6l12 12", strokeLinecap: "round", strokeLinejoin: "round" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Personal Information" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Profile Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: formData.name,
            onChange: (e) => updateField("name", e.target.value),
            placeholder: "Enter profile name",
            disabled: isSaving,
            className: cn(
              "w-full py-2 px-3 rounded-md text-sm",
              "bg-secondary text-foreground placeholder:text-muted-foreground",
              "border border-border",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              errors.name && "border-destructive"
            )
          }
        ),
        errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Gender Identity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: formData.genderIdentity,
            onChange: (e) => updateField("genderIdentity", e.target.value),
            disabled: isSaving,
            className: cn(
              "w-full py-2 px-3 rounded-md text-sm appearance-none",
              "bg-secondary text-foreground",
              "border border-border",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select..." }),
              GENDER_OPTIONS.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option, children: option }, option))
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Body Measurements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Height" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: formData.height,
              onChange: (e) => updateField("height", e.target.value),
              placeholder: formData.heightUnit === "cm" ? "175" : `5'10"`,
              disabled: isSaving,
              className: cn(
                "w-full py-2 px-3 rounded-md text-sm",
                "bg-secondary text-foreground placeholder:text-muted-foreground",
                "border border-border",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Unit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: formData.heightUnit,
              onChange: (e) => updateField("heightUnit", e.target.value),
              disabled: isSaving,
              className: cn(
                "w-full py-2 px-3 rounded-md text-sm appearance-none",
                "bg-secondary text-foreground",
                "border border-border",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              ),
              children: HEIGHT_UNITS.map((unit) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: unit, children: unit }, unit))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Waist Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: formData.waistSize,
              onChange: (e) => updateField("waistSize", e.target.value),
              placeholder: "32",
              disabled: isSaving,
              className: cn(
                "w-full py-2 px-3 rounded-md text-sm",
                "bg-secondary text-foreground placeholder:text-muted-foreground",
                "border border-border",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Unit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: formData.waistUnit,
              onChange: (e) => updateField("waistUnit", e.target.value),
              disabled: isSaving,
              className: cn(
                "w-full py-2 px-3 rounded-md text-sm appearance-none",
                "bg-secondary text-foreground",
                "border border-border",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              ),
              children: SIZE_UNITS.map((unit) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: unit, children: unit }, unit))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Shoe Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: formData.shoeSize,
              onChange: (e) => updateField("shoeSize", e.target.value),
              placeholder: "10",
              disabled: isSaving,
              className: cn(
                "w-full py-2 px-3 rounded-md text-sm",
                "bg-secondary text-foreground placeholder:text-muted-foreground",
                "border border-border",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Region" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: formData.shoeRegion,
              onChange: (e) => updateField("shoeRegion", e.target.value),
              disabled: isSaving,
              className: cn(
                "w-full py-2 px-3 rounded-md text-sm appearance-none",
                "bg-secondary text-foreground",
                "border border-border",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              ),
              children: SHOE_REGIONS.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: region, children: region }, region))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "T-Shirt Size" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: TSHIRT_SIZES.map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => updateField("tshirtSize", size),
            disabled: isSaving,
            className: cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              formData.tshirtSize === size ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80"
            ),
            children: size
          },
          size
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Style Preferences" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Favorite Colors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ColorPicker,
          {
            colors: formData.colorPreferences,
            onChange: (colors) => updateField("colorPreferences", colors),
            disabled: isSaving
          }
        ),
        errors.colors && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.colors })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Health & Dietary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Allergies" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TagInput,
          {
            tags: formData.allergies,
            onChange: (tags) => updateField("allergies", tags),
            placeholder: "Add allergy (press Enter)",
            disabled: isSaving
          }
        ),
        errors.allergies && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.allergies })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Personal Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: formData.isMarried,
              onChange: (e) => updateField("isMarried", e.target.checked),
              disabled: isSaving,
              className: "w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Married" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: formData.hasChildren,
              onChange: (e) => updateField("hasChildren", e.target.checked),
              disabled: isSaving,
              className: "w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Has Children" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-4 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: isSaving,
          className: cn(
            "w-full py-2.5 px-4 rounded-md text-sm font-medium",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          ),
          children: isSaving ? "Saving..." : isNew ? "Create Profile" : "Save Changes"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          disabled: isSaving,
          className: cn(
            "w-full py-2.5 px-4 rounded-md text-sm font-medium",
            "bg-secondary text-secondary-foreground",
            "border border-border hover:bg-secondary/80 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          ),
          children: "Cancel"
        }
      ),
      onDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: showDeleteConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onDelete,
            disabled: isSaving,
            className: cn(
              "flex-1 py-2.5 px-4 rounded-md text-sm font-medium",
              "bg-destructive text-destructive-foreground",
              "hover:bg-destructive/90 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            ),
            children: "Confirm Delete"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowDeleteConfirm(false),
            disabled: isSaving,
            className: cn(
              "flex-1 py-2.5 px-4 rounded-md text-sm font-medium",
              "bg-secondary text-secondary-foreground",
              "border border-border hover:bg-secondary/80 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            ),
            children: "Cancel"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setShowDeleteConfirm(true),
          disabled: isSaving,
          className: cn(
            "w-full py-2.5 px-4 rounded-md text-sm font-medium",
            "text-destructive hover:bg-destructive/10 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          ),
          children: "Delete Profile"
        }
      ) })
    ] })
  ] });
}
function ProfilePanel() {
  const [state, setState] = reactExports.useState(defaultExtensionState);
  const [editingProfile, setEditingProfile] = reactExports.useState(null);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const [isMobile, setIsMobile] = reactExports.useState(window.innerWidth < 768);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  reactExports.useEffect(() => {
    const handleMessage = (event) => {
      var _a;
      if (event.source !== window.parent) return;
      if (((_a = event.data) == null ? void 0 : _a.type) === "STATE_UPDATED") {
        setState(event.data.state);
      }
    };
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({
      source: "reckognyze-panel",
      type: "REQUEST_STATE"
    }, "*");
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  const handleClose = () => {
    window.parent.postMessage({ source: "reckognyze-panel", type: "CLOSE_PANEL" }, "*");
  };
  const handleCreateProfile = () => {
    const newProfile = createProfile({ ...defaultProfile, name: "New Profile" });
    setEditingProfile(newProfile);
    setIsCreating(true);
  };
  const handleEditProfile = (profile) => {
    setEditingProfile({ ...profile });
    setIsCreating(false);
  };
  const handleSaveProfile = async (profile) => {
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
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      }
      const response = await chrome.runtime.sendMessage({
        type: "UPDATE_STATE",
        state: newState
      });
      if (response) {
        setState(response);
        setEditingProfile(null);
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteProfile = async (profileId) => {
    setIsSaving(true);
    try {
      const newState = { ...state };
      newState.profiles = newState.profiles.filter((p) => p.id !== profileId);
      if (newState.activeProfileId === profileId) {
        newState.activeProfileId = newState.profiles.length > 0 ? newState.profiles[0].id : null;
      }
      const response = await chrome.runtime.sendMessage({
        type: "UPDATE_STATE",
        state: newState
      });
      if (response) {
        setState(response);
        setEditingProfile(null);
      }
    } catch (error) {
      console.error("Failed to delete profile:", error);
      alert("Failed to delete profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleSetActive = async (profileId) => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "SET_ACTIVE_PROFILE",
        profileId
      });
      if (response) {
        setState(response);
      }
    } catch (error) {
      console.error("Failed to set active profile:", error);
    }
  };
  const handleCancelEdit = () => {
    setEditingProfile(null);
    setIsCreating(false);
  };
  const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-background border-r border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: "18",
            height: "18",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-semibold text-foreground text-sm", children: "Reckognyze" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Profile Manager" })
        ] })
      ] }),
      !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleClose,
          className: "p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
          "aria-label": "Close panel",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 6L6 18M6 6l12 12", strokeLinecap: "round", strokeLinejoin: "round" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: editingProfile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProfileForm,
      {
        profile: editingProfile,
        isNew: isCreating,
        isSaving,
        onSave: handleSaveProfile,
        onCancel: handleCancelEdit,
        onDelete: !isCreating ? () => handleDeleteProfile(editingProfile.id) : void 0
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
      activeProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Active Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "p-3 rounded-lg border-2 border-primary bg-primary/10 cursor-pointer",
              "hover:bg-primary/20 transition-colors"
            ),
            onClick: () => handleEditProfile(activeProfile),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold", children: activeProfile.name.charAt(0).toUpperCase() || "P" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: activeProfile.name || "Unnamed Profile" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  activeProfile.tshirtSize,
                  " • ",
                  activeProfile.genderIdentity || "Not specified"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  className: "text-muted-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 18l6-6-6-6", strokeLinecap: "round", strokeLinejoin: "round" })
                }
              )
            ] })
          }
        )
      ] }),
      state.profiles.filter((p) => p.id !== state.activeProfileId).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Other Profiles" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: state.profiles.filter((p) => p.id !== state.activeProfileId).map((profile) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "p-3 rounded-lg border border-border bg-secondary/50 cursor-pointer",
              "hover:bg-secondary transition-colors"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold", children: profile.name.charAt(0).toUpperCase() || "P" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex-1 min-w-0",
                  onClick: () => handleEditProfile(profile),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: profile.name || "Unnamed Profile" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      profile.tshirtSize,
                      " • ",
                      profile.genderIdentity || "Not specified"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleSetActive(profile.id);
                  },
                  className: "px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-md transition-colors",
                  children: "Set Active"
                }
              )
            ] })
          },
          profile.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleCreateProfile,
          className: cn(
            "w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors",
            "border-2 border-dashed border-border",
            "text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5",
            "flex items-center justify-center gap-2"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 5v14M5 12h14", strokeLinecap: "round" }) }),
            "Add New Profile"
          ]
        }
      ),
      state.profiles.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: "40",
            height: "40",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            className: "text-primary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "7", r: "4" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: "Welcome to Reckognyze!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-xs mx-auto", children: "Create your first profile to start personalizing your web experience" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleCreateProfile,
            className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 5v14M5 12h14", strokeLinecap: "round" }) }),
              "Create Profile"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
ReactDOM.createRoot(document.getElementById("panel-root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfilePanel, {}) }) })
);
