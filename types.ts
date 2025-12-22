
export type Category = 'Festival' | 'Puja' | 'Marriage' | 'Death / Shraddha' | 'Other';

export interface Step {
  id: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mantra?: string;
}

export interface RitualGuide {
  setupInstructions: string;
  materials: string[];
  steps: Step[];
}

export interface Tradition {
  id: string;
  title: string;
  category: Category;
  description: string;
  coverImage?: string;
  videoUrl?: string;
  steps: Step[];
  materials?: string[];
  setupInstructions?: string;
  linkedFestivalId?: string;
  linkedTithi?: PanchangTithi;
  isAiGenerated?: boolean;
}

export interface PanchangTithi {
  month: string;
  paksha: 'Shukla' | 'Krishna';
  tithi: string;
}

export interface Festival {
  id: string;
  name: string;
  description: string;
  tithi: PanchangTithi;
  standardMonth: number;
  standardDay: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  gender: 'Male' | 'Female' | 'Other';
  parentId?: string; // Links to parent node for tree structure
  spouseId?: string; // Links to spouse node
  isDeceased: boolean;
  punyaTithi?: PanchangTithi;
  photoUrl?: string;
}

export interface Family {
  id: string;
  name: string;
  adminId: string;
  members: string[]; 
  gotra?: string;
  kuladevata?: string;
  kuldevi?: string;
  origin?: string;
  lineage: FamilyMember[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'Admin' | 'Member';
  familyId?: string;
}
