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
  { name: 'Naruto', url: 'https://cdn.myanimelist.net/images/characters/2/284121.jpg' },
  { name: 'Goku', url: 'https://cdn.myanimelist.net/images/characters/15/390945.jpg' },
  { name: 'Luffy', url: 'https://cdn.myanimelist.net/images/characters/9/310307.jpg' },
  { name: 'Tanjiro', url: 'https://cdn.myanimelist.net/images/characters/6/386735.jpg' },
  { name: 'Gojo', url: 'https://cdn.myanimelist.net/images/characters/15/422168.jpg' },
  { name: 'Levi', url: 'https://cdn.myanimelist.net/images/characters/2/241413.jpg' },
  { name: 'Zoro', url: 'https://cdn.myanimelist.net/images/characters/3/100534.jpg' },
  { name: 'Eren', url: 'https://cdn.myanimelist.net/images/characters/10/216895.jpg' },
  { name: 'Gon', url: 'https://cdn.myanimelist.net/images/characters/11/174517.jpg' },
  { name: 'Senku', url: 'https://cdn.myanimelist.net/images/characters/3/376228.jpg' },
  { name: 'Denji', url: 'https://cdn.myanimelist.net/images/characters/3/492407.jpg' },
  { name: 'Anya', url: 'https://cdn.myanimelist.net/images/characters/7/494714.jpg' },
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

export { AVATARS };
