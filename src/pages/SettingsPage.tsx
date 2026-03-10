import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useProfile, AVATAR_OPTIONS } from "@/hooks/useProfile";
import { Settings, User, Monitor, Bell, Shield, Palette, Volume2, Languages, Trash2, Plus, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";

const QUALITY_OPTIONS = ["Auto", "480p", "720p", "1080p", "4K"];
const AUDIO_OPTIONS = ["Italiano (Doppiaggio)", "Inglese (Doppiaggio)", "Giapponese (Originale)"];
const SUB_OPTIONS = ["Italiano", "Inglese", "Nessuno"];
const AUTOPLAY_TIMERS = [0, 3, 5, 10];
const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const LANGUAGES = ["Italiano", "English", "Español", "Deutsch", "Français", "日本語"];

const SETTINGS_KEY = "anistream-settings";

interface AppSettings {
  defaultQuality: string;
  defaultAudio: string;
  defaultSubtitles: string;
  autoplayTimer: number;
  skipIntro: boolean;
  skipOutro: boolean;
  defaultSpeed: number;
  theaterDefault: boolean;
  resumePlayback: "always" | "ask" | "never";
  interfaceLang: string;
  profileVisibility: "public" | "private";
  showActivity: boolean;
  emailNotifications: boolean;
  episodeNotifications: boolean;
}

function loadSettings(): AppSettings {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch { return defaultSettings; }
}

const defaultSettings: AppSettings = {
  defaultQuality: "Auto",
  defaultAudio: "Giapponese (Originale)",
  defaultSubtitles: "Italiano",
  autoplayTimer: 5,
  skipIntro: false,
  skipOutro: false,
  defaultSpeed: 1,
  theaterDefault: false,
  resumePlayback: "always",
  interfaceLang: "Italiano",
  profileVisibility: "private",
  showActivity: false,
  emailNotifications: false,
  episodeNotifications: true,
};

type Tab = "profiles" | "video" | "privacy" | "notifications" | "account";

const SettingsPage = () => {
  const { profiles, activeProfile, createProfile, deleteProfile, logout } = useProfile();
  const [tab, setTab] = useState<Tab>("profiles");
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(AVATAR_OPTIONS[0].url);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleCreateProfile = () => {
    if (newName.trim().length < 2) return;
    createProfile(newName, newAvatar);
    setNewName("");
    setCreating(false);
    toast.success("Profilo creato!");
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profiles", label: "Profili", icon: User },
    { id: "video", label: "Video e Riproduzione", icon: Monitor },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "notifications", label: "Notifiche", icon: Bell },
    { id: "account", label: "Account", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
          <Settings size={28} className="text-primary" />
          Impostazioni
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="md:w-56 flex-shrink-0">
            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible scrollbar-hide">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                  <t.icon size={16} /> {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 gradient-card rounded-xl border border-border p-5 sm:p-6">
            {/* Profiles */}
            {tab === "profiles" && (
              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-4">Gestione Profili</h2>
                <p className="text-xs text-muted-foreground mb-6">Profilo attivo: <span className="text-primary font-medium">{activeProfile?.name || "Nessuno"}</span></p>

                <div className="space-y-3 mb-6">
                  {profiles.map(p => (
                    <div key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${p.id === activeProfile?.id ? "border-primary/30 bg-primary/5" : "border-border"}`}>
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        {p.id === activeProfile?.id && <span className="text-[10px] text-primary">Attivo</span>}
                      </div>
                      <button onClick={() => setConfirmDelete(p.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>

                {profiles.length < 6 && !creating && (
                  <button onClick={() => setCreating(true)} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
                    <Plus size={16} /> Aggiungi profilo
                  </button>
                )}

                {creating && (
                  <div className="border border-border rounded-lg p-4 animate-fade-in">
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {AVATAR_OPTIONS.map(char => (
                        <button key={char.name} onClick={() => setNewAvatar(char.url)} className={`rounded-lg overflow-hidden aspect-square ${newAvatar === char.url ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"}`}>
                          <img src={char.url} alt={char.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome profilo" className="w-full bg-secondary text-foreground text-sm px-4 py-2 rounded-lg border border-border focus:border-primary focus:outline-none mb-3" maxLength={20} onKeyDown={e => e.key === "Enter" && handleCreateProfile()} />
                    <div className="flex gap-2">
                      <button onClick={handleCreateProfile} disabled={newName.trim().length < 2} className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50">Crea</button>
                      <button onClick={() => setCreating(false)} className="bg-secondary text-secondary-foreground text-sm px-4 py-2 rounded-lg">Annulla</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Video & Playback */}
            {tab === "video" && (
              <div className="space-y-6">
                <h2 className="text-lg font-display font-bold text-foreground">Video e Riproduzione</h2>

                <SettingRow label="Qualità predefinita">
                  <select value={settings.defaultQuality} onChange={e => updateSetting("defaultQuality", e.target.value)} className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border border-border">
                    {QUALITY_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </SettingRow>

                <SettingRow label="Audio predefinito">
                  <select value={settings.defaultAudio} onChange={e => updateSetting("defaultAudio", e.target.value)} className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border border-border">
                    {AUDIO_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </SettingRow>

                <SettingRow label="Sottotitoli predefiniti">
                  <select value={settings.defaultSubtitles} onChange={e => updateSetting("defaultSubtitles", e.target.value)} className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border border-border">
                    {SUB_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </SettingRow>

                <SettingRow label="Timer autoplay prossimo episodio">
                  <select value={settings.autoplayTimer} onChange={e => updateSetting("autoplayTimer", parseInt(e.target.value))} className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border border-border">
                    {AUTOPLAY_TIMERS.map(t => <option key={t} value={t}>{t === 0 ? "Disattivato" : `${t} secondi`}</option>)}
                  </select>
                </SettingRow>

                <SettingRow label="Skip intro automatico">
                  <Toggle checked={settings.skipIntro} onChange={v => updateSetting("skipIntro", v)} />
                </SettingRow>

                <SettingRow label="Skip outro automatico">
                  <Toggle checked={settings.skipOutro} onChange={v => updateSetting("skipOutro", v)} />
                </SettingRow>

                <SettingRow label="Velocità predefinita">
                  <select value={settings.defaultSpeed} onChange={e => updateSetting("defaultSpeed", parseFloat(e.target.value))} className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border border-border">
                    {SPEED_OPTIONS.map(s => <option key={s} value={s}>{s}x</option>)}
                  </select>
                </SettingRow>

                <SettingRow label="Modalità teatro di default">
                  <Toggle checked={settings.theaterDefault} onChange={v => updateSetting("theaterDefault", v)} />
                </SettingRow>

                <SettingRow label="Riprendi riproduzione">
                  <select value={settings.resumePlayback} onChange={e => updateSetting("resumePlayback", e.target.value as any)} className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border border-border">
                    <option value="always">Sempre</option>
                    <option value="ask">Chiedi</option>
                    <option value="never">Mai</option>
                  </select>
                </SettingRow>
              </div>
            )}

            {/* Privacy */}
            {tab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-lg font-display font-bold text-foreground">Privacy</h2>
                <SettingRow label="Visibilità profilo">
                  <select value={settings.profileVisibility} onChange={e => updateSetting("profileVisibility", e.target.value as any)} className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border border-border">
                    <option value="public">Pubblico</option>
                    <option value="private">Privato</option>
                  </select>
                </SettingRow>
                <SettingRow label="Mostra attività">
                  <Toggle checked={settings.showActivity} onChange={v => updateSetting("showActivity", v)} />
                </SettingRow>
                <SettingRow label="Lingua interfaccia">
                  <select value={settings.interfaceLang} onChange={e => updateSetting("interfaceLang", e.target.value)} className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border border-border">
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </SettingRow>
              </div>
            )}

            {/* Notifications */}
            {tab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-display font-bold text-foreground">Notifiche</h2>
                <SettingRow label="Notifiche email">
                  <Toggle checked={settings.emailNotifications} onChange={v => updateSetting("emailNotifications", v)} />
                </SettingRow>
                <SettingRow label="Nuovi episodi">
                  <Toggle checked={settings.episodeNotifications} onChange={v => updateSetting("episodeNotifications", v)} />
                </SettingRow>
                <p className="text-xs text-muted-foreground">Le notifiche push saranno disponibili nell'app mobile.</p>
              </div>
            )}

            {/* Account */}
            {tab === "account" && (
              <div className="space-y-6">
                <h2 className="text-lg font-display font-bold text-foreground">Account</h2>
                <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-sm text-foreground mb-1">Profilo attivo</p>
                  <p className="text-xs text-muted-foreground">{activeProfile?.name || "Nessun profilo selezionato"}</p>
                </div>
                <button onClick={() => { logout(); toast.success("Disconnesso!"); }} className="bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full text-left">
                  Cambia profilo
                </button>
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium text-destructive mb-2">Zona pericolosa</h3>
                  <p className="text-xs text-muted-foreground mb-3">L'eliminazione di un profilo è permanente e non può essere annullata.</p>
                  <button onClick={() => { if (activeProfile) setConfirmDelete(activeProfile.id); }} className="bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Elimina profilo attivo
                  </button>
                </div>
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">Esporta dati</h3>
                  <button onClick={() => {
                    const data = {
                      profiles: localStorage.getItem("anistream-profiles"),
                      watchlist: localStorage.getItem("anistream-watchlist"),
                      watched: localStorage.getItem("anistream-watched-episodes"),
                      progress: localStorage.getItem("anistream-watch-progress"),
                      settings: localStorage.getItem(SETTINGS_KEY),
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url; a.download = "anistream-data.json"; a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Dati esportati!");
                  }} className="bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Esporta dati (JSON)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-xs w-full shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <p className="text-sm text-foreground mb-4">Eliminare questo profilo?</p>
            <div className="flex gap-2">
              <button onClick={() => { deleteProfile(confirmDelete); setConfirmDelete(null); toast.success("Profilo eliminato"); }} className="flex-1 bg-destructive text-destructive-foreground font-medium py-2 rounded-lg text-sm">Elimina</button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-secondary text-secondary-foreground font-medium py-2 rounded-lg text-sm">Annulla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components
function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-foreground">{label}</span>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-secondary"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default SettingsPage;
