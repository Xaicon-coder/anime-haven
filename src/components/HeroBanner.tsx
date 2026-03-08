import { Play, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { featuredAnime } from "@/data/animeData";

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      <img
        src={featuredAnime.banner}
        alt={featuredAnime.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 gradient-hero-overlay" />
      <div className="absolute inset-0 bg-background/40" />

      <div className="relative z-10 h-full flex items-end pb-16 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="max-w-xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/30">
              IN EVIDENZA
            </span>
            <div className="flex items-center gap-1 text-primary">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-medium">{featuredAnime.rating}</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3 leading-tight">
            {featuredAnime.title}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 line-clamp-3">
            {featuredAnime.description}
          </p>
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {featuredAnime.genres.map((genre) => (
              <span key={genre} className="text-xs text-secondary-foreground bg-secondary px-3 py-1 rounded-full">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/anime/${featuredAnime.id}`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-all glow-primary"
            >
              <Play size={18} fill="currentColor" />
              Guarda ora
            </Link>
            <button className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium px-6 py-3 rounded-lg transition-colors">
              <Plus size={18} />
              La mia lista
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
