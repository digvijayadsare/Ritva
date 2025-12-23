
import React, { createContext, useContext, useState } from 'react';
import { User, Family, Tradition, FamilyMember } from './types';

interface AppState {
  user: User | null;
  family: Family | null;
  traditions: Tradition[];
  ancestors: FamilyMember[];
  isAuthenticated: boolean;
  isPro: boolean;
  login: (identifier: string, provider: 'phone' | 'google', name?: string) => void;
  logout: () => void;
  togglePro: () => void;
  addTradition: (t: Tradition) => void;
  updateFamilyDetails: (details: Partial<Family>) => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string, deleteDescendants: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [traditions, setTraditions] = useState<Tradition[]>([]);

  const login = (identifier: string, provider: 'phone' | 'google', name?: string) => {
    const isGoogle = provider === 'google';
    const userId = isGoogle ? 'u-google' : 'u-phone';
    
    setUser({ 
      id: userId, 
      name: name || (isGoogle ? 'Google User' : 'Rajesh Patil'), 
      phone: isGoogle ? '' : identifier, 
      role: 'Admin', 
      familyId: 'f1' 
    });
    
    setIsAuthenticated(true);
    
    const initialLineage: FamilyMember[] = [
      { id: 'm1', name: 'Late Ganpatrao Patil', relation: 'Grandfather', gender: 'Male', isDeceased: true, punyaTithi: { month: 'Kartik', paksha: 'Krishna', tithi: 'Ashtami' } },
      { id: 'm2', name: 'Late Savitribai Patil', relation: 'Grandmother', gender: 'Female', isDeceased: true, spouseId: 'm1' },
      { id: 'm3', name: 'Suresh Patil', relation: 'Father', gender: 'Male', isDeceased: false, parentId: 'm1' },
      { id: 'm4', name: 'Meena Patil', relation: 'Mother', gender: 'Female', isDeceased: false, spouseId: 'm3' },
      { id: 'm5', name: 'Rajesh Patil', relation: 'Self', gender: 'Male', isDeceased: false, parentId: 'm3' },
      { id: 'm6', name: 'Sunita Deshmukh', relation: 'Sister', gender: 'Female', isDeceased: false, parentId: 'm3' },
    ];

    setFamily({
      id: 'f1',
      name: isGoogle ? `${name || 'Google'}'s Parivar` : 'Patil Parivar',
      adminId: userId,
      members: [userId],
      gotra: 'Kashyap',
      kuladevata: 'Khandoba (Jejuri)',
      kuldevi: 'Ekvira Devi',
      origin: 'Satara, Maharashtra',
      lineage: initialLineage
    });

    setTraditions([
      {
        id: 't1',
        title: 'Gudhi Padwa Puja',
        category: 'Festival',
        description: 'Our traditional way of raising the Gudhi and performing the morning Arati.',
        steps: [
          { id: 's1', title: 'Raising the Gudhi', description: 'Tie the silk cloth, neem leaves, and gaathi to the bamboo.' },
          { id: 's2', title: 'Naivedya', description: 'Offer Puran Poli and Shrikhand to the Gudhi.' }
        ]
      }
    ]);
  };

  const logout = () => { setUser(null); setFamily(null); setIsAuthenticated(false); setIsPro(false); };
  const togglePro = () => setIsPro(prev => !prev);
  const addTradition = (t: Tradition) => setTraditions(prev => [...prev, t]);
  const updateFamilyDetails = (details: Partial<Family>) => setFamily(prev => prev ? { ...prev, ...details } : null);
  
  const addFamilyMember = (member: FamilyMember) => {
    setFamily(prev => {
      if (!prev) return null;
      return { ...prev, lineage: [...prev.lineage, member] };
    });
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamily(prev => {
      if (!prev) return null;
      return {
        ...prev,
        lineage: prev.lineage.map(m => m.id === id ? { ...m, ...updates } : m)
      };
    });
  };

  const deleteFamilyMember = (id: string, deleteDescendants: boolean) => {
    setFamily(prev => {
      if (!prev) return null;

      let idsToRemove = new Set<string>();
      
      if (deleteDescendants) {
        const collectDescendants = (parentId: string) => {
          idsToRemove.add(parentId);
          prev.lineage.forEach(m => {
            if (m.parentId === parentId) collectDescendants(m.id);
          });
        };
        collectDescendants(id);
      } else {
        idsToRemove.add(id);
      }

      const newLineage = prev.lineage
        .filter(m => !idsToRemove.has(m.id))
        .map(m => ({
          ...m,
          parentId: idsToRemove.has(m.parentId || '') ? undefined : m.parentId,
          spouseId: idsToRemove.has(m.spouseId || '') ? undefined : m.spouseId
        }));

      return { ...prev, lineage: newLineage };
    });
  };

  const ancestors = family?.lineage.filter(m => m.isDeceased) || [];

  return React.createElement(AppContext.Provider, { 
    value: { user, family, traditions, ancestors, isAuthenticated, isPro, login, logout, togglePro, addTradition, updateFamilyDetails, addFamilyMember, updateFamilyMember, deleteFamilyMember }
  }, children);
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
