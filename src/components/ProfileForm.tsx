import React, { useState } from 'react';
import { UserProfile, TShirtSize, HeightUnit, SizeUnit, ShoeRegion } from '@/types/profile';
import { cn } from '@/lib/utils';
import { ColorPicker } from './ColorPicker';
import { TagInput } from './TagInput';

interface ProfileFormProps {
  profile: UserProfile;
  isNew: boolean;
  isSaving?: boolean;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const TSHIRT_SIZES: TShirtSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const HEIGHT_UNITS: HeightUnit[] = ['cm', 'ft-in'];
const SIZE_UNITS: SizeUnit[] = ['inches', 'cm'];
const SHOE_REGIONS: ShoeRegion[] = ['US', 'UK', 'EU'];

const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
  'Other',
];

export function ProfileForm({ profile, isNew, isSaving = false, onSave, onCancel, onDelete }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Profile name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be 50 characters or less';
    }
    
    if (formData.colorPreferences.length > 10) {
      newErrors.colors = 'Maximum 10 colors allowed';
    }
    
    if (formData.allergies.length > 20) {
      newErrors.allergies = 'Maximum 20 allergies allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">
          {isNew ? 'Create Profile' : 'Edit Profile'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          aria-label="Close form"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Personal Information */}
      <section className="space-y-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Personal Information
        </h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Profile Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Enter profile name"
            disabled={isSaving}
            className={cn(
              'w-full py-2 px-3 rounded-md text-sm',
              'bg-secondary text-foreground placeholder:text-muted-foreground',
              'border border-border',
              'focus:outline-none focus:ring-2 focus:ring-ring',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              errors.name && 'border-destructive'
            )}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Gender Identity</label>
          <select
            value={formData.genderIdentity}
            onChange={(e) => updateField('genderIdentity', e.target.value)}
            disabled={isSaving}
            className={cn(
              'w-full py-2 px-3 rounded-md text-sm appearance-none',
              'bg-secondary text-foreground',
              'border border-border',
              'focus:outline-none focus:ring-2 focus:ring-ring',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <option value="">Select...</option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Body Measurements */}
      <section className="space-y-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Body Measurements
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Height</label>
            <input
              type="text"
              value={formData.height}
              onChange={(e) => updateField('height', e.target.value)}
              placeholder={formData.heightUnit === 'cm' ? '175' : "5'10\""}
              disabled={isSaving}
              className={cn(
                'w-full py-2 px-3 rounded-md text-sm',
                'bg-secondary text-foreground placeholder:text-muted-foreground',
                'border border-border',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Unit</label>
            <select
              value={formData.heightUnit}
              onChange={(e) => updateField('heightUnit', e.target.value as HeightUnit)}
              disabled={isSaving}
              className={cn(
                'w-full py-2 px-3 rounded-md text-sm appearance-none',
                'bg-secondary text-foreground',
                'border border-border',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {HEIGHT_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Waist Size</label>
            <input
              type="text"
              value={formData.waistSize}
              onChange={(e) => updateField('waistSize', e.target.value)}
              placeholder="32"
              disabled={isSaving}
              className={cn(
                'w-full py-2 px-3 rounded-md text-sm',
                'bg-secondary text-foreground placeholder:text-muted-foreground',
                'border border-border',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Unit</label>
            <select
              value={formData.waistUnit}
              onChange={(e) => updateField('waistUnit', e.target.value as SizeUnit)}
              disabled={isSaving}
              className={cn(
                'w-full py-2 px-3 rounded-md text-sm appearance-none',
                'bg-secondary text-foreground',
                'border border-border',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {SIZE_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Shoe Size</label>
            <input
              type="text"
              value={formData.shoeSize}
              onChange={(e) => updateField('shoeSize', e.target.value)}
              placeholder="10"
              disabled={isSaving}
              className={cn(
                'w-full py-2 px-3 rounded-md text-sm',
                'bg-secondary text-foreground placeholder:text-muted-foreground',
                'border border-border',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Region</label>
            <select
              value={formData.shoeRegion}
              onChange={(e) => updateField('shoeRegion', e.target.value as ShoeRegion)}
              disabled={isSaving}
              className={cn(
                'w-full py-2 px-3 rounded-md text-sm appearance-none',
                'bg-secondary text-foreground',
                'border border-border',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {SHOE_REGIONS.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">T-Shirt Size</label>
          <div className="flex flex-wrap gap-2">
            {TSHIRT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updateField('tshirtSize', size)}
                disabled={isSaving}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  formData.tshirtSize === size
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Style Preferences
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Favorite Colors</label>
          <ColorPicker
            colors={formData.colorPreferences}
            onChange={(colors) => updateField('colorPreferences', colors)}
            disabled={isSaving}
          />
          {errors.colors && (
            <p className="text-xs text-destructive">{errors.colors}</p>
          )}
        </div>
      </section>

      {/* Health/Dietary */}
      <section className="space-y-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Health & Dietary
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Allergies</label>
          <TagInput
            tags={formData.allergies}
            onChange={(tags) => updateField('allergies', tags)}
            placeholder="Add allergy (press Enter)"
            disabled={isSaving}
          />
          {errors.allergies && (
            <p className="text-xs text-destructive">{errors.allergies}</p>
          )}
        </div>
      </section>

      {/* Personal Status */}
      <section className="space-y-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Personal Status
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isMarried}
              onChange={(e) => updateField('isMarried', e.target.checked)}
              disabled={isSaving}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-sm text-foreground">Married</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasChildren}
              onChange={(e) => updateField('hasChildren', e.target.checked)}
              disabled={isSaving}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-sm text-foreground">Has Children</span>
          </label>
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isSaving}
          className={cn(
            'w-full py-2.5 px-4 rounded-md text-sm font-medium',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSaving ? 'Saving...' : (isNew ? 'Create Profile' : 'Save Changes')}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className={cn(
            'w-full py-2.5 px-4 rounded-md text-sm font-medium',
            'bg-secondary text-secondary-foreground',
            'border border-border hover:bg-secondary/80 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Cancel
        </button>

        {onDelete && (
          <>
            {showDeleteConfirm ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isSaving}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-md text-sm font-medium',
                    'bg-destructive text-destructive-foreground',
                    'hover:bg-destructive/90 transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSaving}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-md text-sm font-medium',
                    'bg-secondary text-secondary-foreground',
                    'border border-border hover:bg-secondary/80 transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSaving}
                className={cn(
                  'w-full py-2.5 px-4 rounded-md text-sm font-medium',
                  'text-destructive hover:bg-destructive/10 transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                Delete Profile
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
}
