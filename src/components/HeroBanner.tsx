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
    <section className="relative w-full h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh] min-h-[400px] max-h-[800px] overflow-hidden">
      {/* Banner image with proper aspect ratio preservation */}
      <div className="absolute inset-0">
        <img
          src={featured.banner}
          alt={featured.title}
          className="w-full h-full object-cover object-center transition-opacity duration-700"
        />
      </div>
      {/* Gradient overlays */}
      <div className="absolute inset-0 gradient-hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />

      <div className="relative z-10 h-full flex items-end pb-10 sm:pb-14 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl animate-fade-in" key={featured.id}>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="bg-primary/20 text-primary text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-primary/30">
              IN EVIDENZA
            </span>
            {featured.rating > 0 && (
              <div className="flex items-center gap-1 text-primary">
                <Star size={12} fill="currentColor" className="sm:w-[14px] sm:h-[14px]" />
                <span className="text-xs sm:text-sm font-medium">{featured.rating}</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-2 sm:mb-3 leading-tight">
            {featured.title}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
            {featured.description}
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 flex-wrap">
            {featured.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="text-[10px] sm:text-xs text-secondary-foreground bg-secondary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to={`/anime/${featured.id}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all glow-primary text-sm sm:text-base"
            >
              <Play size={16} fill="currentColor" className="sm:w-[18px] sm:h-[18px]" />
              Guarda ora
            </Link>
            <button className="inline-flex items-center gap-1.5 sm:gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base">
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              La mia lista
            </button>
          </div>

          {/* Dots indicator */}
          {heroAnime.length > 1 && (
            <div className="flex gap-1.5 sm:gap-2 mt-4 sm:mt-6">
              {heroAnime.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setFeatured(heroAnime[i]);
                  }}
                  className={`h-1 sm:h-1.5 rounded-full transition-all ${
                    i === currentIndex ? "w-6 sm:w-8 bg-primary" : "w-2 sm:w-3 bg-muted-foreground/40"
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
