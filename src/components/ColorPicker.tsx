import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { sanitizeColor } from '@/utils/sanitize';

interface ColorPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  disabled?: boolean;
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#000000', // black
  '#ffffff', // white
  '#6b7280', // gray
  '#92400e', // brown
];

export function ColorPicker({ colors, onChange, disabled = false }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState('#3b82f6');

  const toggleColor = (color: string) => {
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

  const removeColor = (color: string) => {
    onChange(colors.filter((c) => c !== color));
  };

  return (
    <div className="space-y-3">
      {/* Selected Colors */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary border border-border"
            >
              <div
                className="w-4 h-4 rounded-sm border border-border"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-foreground">{color}</span>
              <button
                type="button"
                onClick={() => removeColor(color)}
                disabled={disabled}
                className="ml-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Remove color ${color}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preset Colors */}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => toggleColor(color)}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleColor(color);
              }
            }}
            className={cn(
              'w-7 h-7 rounded-md border-2 transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              colors.includes(color)
                ? 'border-primary ring-2 ring-primary/30 scale-110'
                : 'border-border hover:border-muted-foreground'
            )}
            style={{ backgroundColor: color }}
            aria-label={`${colors.includes(color) ? 'Remove' : 'Add'} color ${color}`}
          />
        ))}
      </div>

      {/* Custom Color */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          disabled={disabled}
          className="w-8 h-8 rounded cursor-pointer border-0 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Pick custom color"
        />
        <input
          type="text"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          disabled={disabled}
          className={cn(
            'flex-1 py-1.5 px-2 rounded-md text-xs',
            'bg-secondary text-foreground',
            'border border-border',
            'focus:outline-none focus:ring-2 focus:ring-ring',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          placeholder="#3b82f6"
        />
        <button
          type="button"
          onClick={addCustomColor}
          disabled={disabled}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Add
        </button>
      </div>
    </div>
  );
}
