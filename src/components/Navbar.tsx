import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAnimeSearch } from "@/hooks/useAnimeApi";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { results, loading } = useAnimeSearch(query);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-gradient-primary">AniStream</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="relative flex items-center gap-2 animate-slide-in">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca anime..."
                className="bg-secondary text-foreground text-sm px-4 py-2 rounded-lg border border-border focus:border-primary focus:outline-none w-48 md:w-64"
                autoFocus
              />
              <button onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>

              {/* Search Results Dropdown */}
              {query.length >= 2 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
                  {loading && (
                    <div className="p-4 text-center text-muted-foreground text-sm">Cercando...</div>
                  )}
                  {!loading && results.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm">Nessun risultato</div>
                  )}
                  {results.map((anime) => (
                    <button
                      key={anime.id}
                      onClick={() => {
                        navigate(`/anime/${anime.id}`);
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 w-full p-3 hover:bg-secondary transition-colors text-left"
                    >
                      <img src={anime.cover} alt={anime.title} className="w-10 h-14 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{anime.title}</p>
                        <p className="text-xs text-muted-foreground">{anime.year} • ⭐ {anime.rating}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors p-2">
              <Search size={20} />
            </button>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-muted-foreground hover:text-foreground p-2">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3">
            <Link to="/" className="block py-2 text-sm font-medium text-foreground">Home</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
