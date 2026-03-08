import { Play, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTopAnime } from "@/hooks/useAnimeApi";
import { featuredAnime } from "@/data/animeData";
import { useState, useEffect } from "react";
import type { Anime } from "@/data/animeData";

const HeroBanner = () => {
  const { anime: topAnime } = useTopAnime();
  const [featured, setFeatured] = useState<Anime>(featuredAnime);
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroAnime = topAnime.length > 0 ? topAnime.slice(0, 5) : [featuredAnime];

  useEffect(() => {
    if (topAnime.length > 0) {
      setFeatured(topAnime[0]);
    }
  }, [topAnime]);

  useEffect(() => {
    if (heroAnime.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % heroAnime.length;
        setFeatured(heroAnime[next]);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [heroAnime.length, topAnime]);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      <img
        src={featured.banner}
        alt={featured.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />
      <div className="absolute inset-0 gradient-hero-overlay" />
      <div className="absolute inset-0 bg-background/50" />

      <div className="relative z-10 h-full flex items-end pb-16 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="max-w-xl animate-fade-in" key={featured.id}>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/30">
              IN EVIDENZA
            </span>
            {featured.rating > 0 && (
              <div className="flex items-center gap-1 text-primary">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-medium">{featured.rating}</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3 leading-tight">
            {featured.title}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 line-clamp-3">
            {featured.description}
          </p>
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {featured.genres.slice(0, 4).map((genre) => (
              <span key={genre} className="text-xs text-secondary-foreground bg-secondary px-3 py-1 rounded-full">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/anime/${featured.id}`}
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

          {/* Dots indicator */}
          {heroAnime.length > 1 && (
            <div className="flex gap-2 mt-6">
              {heroAnime.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setFeatured(heroAnime[i]);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex ? "w-8 bg-primary" : "w-3 bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
