import { useState } from 'react';
import { useProfile, AVATARS } from '@/hooks/useProfile';
import { Plus, Trash2, User } from 'lucide-react';
import type { ReactNode } from 'react';

interface AccountGateProps {
  children: ReactNode;
}

const AccountGate = ({ children }: AccountGateProps) => {
  const { profiles, activeProfile, selectProfile, createProfile, deleteProfile } = useProfile();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Se c'è un profilo attivo, mostra l'app
  if (activeProfile) {
    return <>{children}</>;
  }

  const handleCreate = () => {
    if (newName.trim().length < 2) return;
    createProfile(newName, selectedAvatar);
    setNewName('');
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gradient-primary mb-2">AniStream</h1>
        <p className="text-muted-foreground text-sm mb-8">Chi sta guardando?</p>

        {!creating ? (
          <>
            {/* Profili esistenti */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
              {profiles.map((profile) => (
                <div key={profile.id} className="relative group">
                  <button
                    onClick={() => selectProfile(profile.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-secondary border-2 border-border hover:border-primary/50 transition-colors flex items-center justify-center text-3xl sm:text-4xl">
                      {profile.avatar}
                    </div>
                    <span className="text-sm font-medium text-foreground max-w-[80px] truncate">{profile.name}</span>
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => setConfirmDelete(profile.id)}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              {/* Pulsante aggiungi profilo */}
              {profiles.length < 6 && (
                <button
                  onClick={() => setCreating(true)}
                  className="flex flex-col items-center gap-2 p-3"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center text-muted-foreground hover:text-primary">
                    <Plus size={28} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Aggiungi</span>
                </button>
              )}
            </div>

            {profiles.length === 0 && (
              <p className="text-muted-foreground text-xs">Crea un profilo per iniziare a guardare</p>
            )}
          </>
        ) : (
          /* Form creazione profilo */
          <div className="gradient-card rounded-2xl border border-border p-6 sm:p-8 max-w-sm mx-auto animate-fade-in">
            <h2 className="text-lg font-display font-bold text-foreground mb-4">Nuovo profilo</h2>

            <div className="mb-4">
              <label className="block text-xs font-medium text-muted-foreground mb-2">Scegli un avatar</label>
              <div className="flex flex-wrap gap-2 justify-center">
                {AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${
                      selectedAvatar === emoji
                        ? 'bg-primary/20 border-2 border-primary scale-110'
                        : 'bg-secondary border-2 border-transparent hover:border-border'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-secondary text-foreground px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none text-sm"
                placeholder="Es. Marco, Papà, Mamma..."
                maxLength={20}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={newName.trim().length < 2}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                Crea profilo
              </button>
              <button
                onClick={() => { setCreating(false); setNewName(''); }}
                className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors text-sm"
              >
                Annulla
              </button>
            </div>
          </div>
        )}

        {/* Confirm delete dialog */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setConfirmDelete(null)}>
            <div className="bg-card border border-border rounded-2xl p-6 max-w-xs w-full shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm text-foreground mb-4">Eliminare questo profilo? I dati locali verranno persi.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { deleteProfile(confirmDelete); setConfirmDelete(null); }}
                  className="flex-1 bg-destructive text-destructive-foreground font-medium py-2 rounded-lg text-sm"
                >
                  Elimina
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-secondary text-secondary-foreground font-medium py-2 rounded-lg text-sm"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountGate;
