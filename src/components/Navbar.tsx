import { Search, Menu, X, Bookmark, Compass, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAnimeSearch } from "@/hooks/useAnimeApi";
import { useProfile } from "@/hooks/useProfile";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { results, loading } = useAnimeSearch(query);
  const { activeProfile, logout } = useProfile();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-display font-bold text-gradient-primary">AniStream</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              <Compass size={15} /> Esplora
            </Link>
            <Link to="/watchlist" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              <Bookmark size={15} /> La Mia Lista
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {searchOpen ? (
            <div className="relative flex items-center gap-2 animate-slide-in">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca anime..."
                className="bg-secondary text-foreground text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-border focus:border-primary focus:outline-none w-40 sm:w-48 md:w-64"
                autoFocus
              />
              <button onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-muted-foreground hover:text-foreground">
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>

              {query.length >= 2 && (
                <div className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-h-80 sm:max-h-96 overflow-y-auto">
                  {loading && (
                    <div className="p-4 text-center text-muted-foreground text-xs sm:text-sm">Cercando...</div>
                  )}
                  {!loading && results.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-xs sm:text-sm">Nessun risultato</div>
                  )}
                  {results.map((anime) => (
                    <button
                      key={anime.id}
                      onClick={() => {
                        navigate(`/anime/${anime.id}`);
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 w-full p-2.5 sm:p-3 hover:bg-secondary transition-colors text-left"
                    >
                      <div className="w-8 h-12 sm:w-10 sm:h-14 flex-shrink-0 rounded overflow-hidden bg-secondary">
                        <img src={anime.cover} alt={anime.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">{anime.title}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{anime.year} • ⭐ {anime.rating}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 sm:p-2">
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Profile button */}
          {activeProfile && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-1.5 sm:p-2"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-border bg-secondary">
                  <img src={activeProfile.avatar} alt={activeProfile.name} className="w-full h-full object-cover" />
                </div>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span className="text-base">{activeProfile.avatar}</span> {activeProfile.name}
                    </p>
                  </div>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <LogOut size={15} /> Cambia profilo
                  </button>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-muted-foreground hover:text-foreground p-1.5 sm:p-2">
            {menuOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-foreground">Home</Link>
            <Link to="/explore" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground">
              <Compass size={16} /> Esplora
            </Link>
            <Link to="/watchlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground">
              <Bookmark size={16} /> La Mia Lista
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
