import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Profile {
  id: string;
  name: string;
  avatar: string; // URL immagine personaggio
  createdAt: number;
}

interface ProfileContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  selectProfile: (id: string) => void;
  createProfile: (name: string, avatar: string) => void;
  deleteProfile: (id: string) => void;
  logout: () => void;
}

const PROFILES_KEY = 'anistream-profiles';
const ACTIVE_KEY = 'anistream-active-profile';

// Personaggi anime iconici con immagini da MyAnimeList
export const AVATAR_OPTIONS = [
  { name: 'Naruto', url: 'https://img.anili.st/media/20' },
  { name: 'Goku', url: 'https://img.anili.st/media/21459' },
  { name: 'Luffy', url: 'https://img.anili.st/media/21' },
  { name: 'Tanjiro', url: 'https://img.anili.st/media/101922' },
  { name: 'Gojo', url: 'https://img.anili.st/media/113415' },
  { name: 'Levi', url: 'https://img.anili.st/media/16498' },
  { name: 'Zoro', url: 'https://img.anili.st/media/21' },
  { name: 'Eren', url: 'https://img.anili.st/media/16498' },
  { name: 'Gon', url: 'https://img.anili.st/media/11061' },
  { name: 'Senku', url: 'https://img.anili.st/media/105333' },
  { name: 'Denji', url: 'https://img.anili.st/media/127230' },
  { name: 'Anya', url: 'https://img.anili.st/media/140960' },
];

function loadProfiles(): Profile[] {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function loadActiveId(): string | null {
  return sessionStorage.getItem(ACTIVE_KEY);
}

function saveActiveId(id: string | null) {
  if (id) sessionStorage.setItem(ACTIVE_KEY, id);
  else sessionStorage.removeItem(ACTIVE_KEY);
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles);
  const [activeId, setActiveId] = useState<string | null>(loadActiveId);

  const activeProfile = profiles.find(p => p.id === activeId) || null;

  const selectProfile = useCallback((id: string) => {
    setActiveId(id);
    saveActiveId(id);
  }, []);

  const createProfile = useCallback((name: string, avatar: string) => {
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      avatar,
      createdAt: Date.now(),
    };
    setProfiles(prev => {
      const next = [...prev, newProfile];
      saveProfiles(next);
      return next;
    });
    selectProfile(newProfile.id);
  }, [selectProfile]);

  const deleteProfile = useCallback((id: string) => {
    setProfiles(prev => {
      const next = prev.filter(p => p.id !== id);
      saveProfiles(next);
      return next;
    });
    if (activeId === id) {
      setActiveId(null);
      saveActiveId(null);
    }
  }, [activeId]);

  const logout = useCallback(() => {
    setActiveId(null);
    saveActiveId(null);
  }, []);

  return (
    <ProfileContext.Provider value={{ profiles, activeProfile, selectProfile, createProfile, deleteProfile, logout }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}


