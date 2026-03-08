import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-gradient-primary">AniStream</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Sfoglia</Link>
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">La mia lista</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-slide-in">
              <input
                type="text"
                placeholder="Cerca anime..."
                className="bg-secondary text-foreground text-sm px-4 py-2 rounded-lg border border-border focus:border-primary focus:outline-none w-48 md:w-64"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
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
          <div className="px-4 py-3 space-y-2">
            <Link to="/" className="block py-2 text-sm font-medium text-foreground">Home</Link>
            <Link to="/" className="block py-2 text-sm font-medium text-muted-foreground">Sfoglia</Link>
            <Link to="/" className="block py-2 text-sm font-medium text-muted-foreground">La mia lista</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
