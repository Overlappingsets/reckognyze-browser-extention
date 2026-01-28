export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type HeightUnit = 'cm' | 'ft-in';
export type SizeUnit = 'inches' | 'cm';
export type ShoeRegion = 'US' | 'UK' | 'EU';

export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;

  // Personal Info
  genderIdentity: string;

  // Sizing
  height: string;
  heightUnit: HeightUnit;
  waistSize: string;
  waistUnit: SizeUnit;
  shoeSize: string;
  shoeRegion: ShoeRegion;
  tshirtSize: TShirtSize;

  // Preferences
  colorPreferences: string[];
  allergies: string[];

  // Personal Status
  isMarried: boolean;
  hasChildren: boolean;
}

export interface ExtensionState {
  isEnabled: boolean;
  activeProfileId: string | null;
  profiles: UserProfile[];
  panelVisible: boolean;
}

export interface ReckognyzeStatus {
  detected: boolean;
  version?: string;
}

export const defaultProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  genderIdentity: '',
  height: '',
  heightUnit: 'cm',
  waistSize: '',
  waistUnit: 'inches',
  shoeSize: '',
  shoeRegion: 'US',
  tshirtSize: 'M',
  colorPreferences: [],
  allergies: [],
  isMarried: false,
  hasChildren: false,
};

export const defaultExtensionState: ExtensionState = {
  isEnabled: false,
  activeProfileId: null,
  profiles: [],
  panelVisible: false,
};
