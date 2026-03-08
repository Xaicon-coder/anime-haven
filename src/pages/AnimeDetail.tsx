import { useParams, Link } from "react-router-dom";
import { Play, Star, ArrowLeft, Clock, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { type Anime } from "@/data/animeData";
import { useAnimeById } from "@/hooks/useAnimeApi";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";

const AnimeDetail = () => {
  useSpatialNavigation();
  const { id } = useParams();
  const { anime, loading } = useAnimeById(id || "");
  const [selectedSeason, setSelectedSeason] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center px-4">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">Anime non trovato</h1>
          <Link to="/" className="text-primary hover:underline text-sm">Torna alla home</Link>
        </div>
      </div>
    );
  }

  const currentSeason = anime.seasons[selectedSeason];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-[50vh] min-h-[250px] max-h-[600px] overflow-hidden">
        <img
          src={anime.banner}
          alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 gradient-hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/40 to-transparent" />
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-40 lg:-mt-48 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors text-xs sm:text-sm">
          <ArrowLeft size={14} className="sm:w-4 sm:h-4" /> Torna indietro
        </Link>

        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 lg:gap-8">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-36 sm:w-44 md:w-48 lg:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-border bg-secondary">
              <img src={anime.cover} alt={anime.title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1 animate-fade-in text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2 sm:mb-3">{anime.title}</h1>
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 flex-wrap justify-center sm:justify-start">
              {anime.rating > 0 && (
                <div className="flex items-center gap-1 text-primary">
                  <Star size={14} fill="currentColor" className="sm:w-4 sm:h-4" />
                  <span className="font-semibold text-sm sm:text-base">{anime.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                <Calendar size={12} className="sm:w-[14px] sm:h-[14px]" />
                <span>{anime.year}</span>
              </div>
              <span className={`text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                anime.status === "In corso" ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary text-secondary-foreground"
              }`}>
                {anime.status}
              </span>
            </div>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap mb-3 sm:mb-4 justify-center sm:justify-start">
              {anime.genres.map((g) => (
                <span key={g} className="text-[10px] sm:text-xs bg-secondary text-secondary-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">{g}</span>
              ))}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed mb-4 sm:mb-6 max-w-2xl mx-auto sm:mx-0">
              {anime.description}
            </p>
            <Link
              to={`/watch/${anime.id}/${currentSeason.id}/${currentSeason.episodes[0].id}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all glow-primary text-sm sm:text-base"
            >
              <Play size={16} fill="currentColor" className="sm:w-[18px] sm:h-[18px]" />
              Guarda Episodio 1
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12 mb-12 sm:mb-16">
          <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-2">
            {anime.seasons.map((season, i) => (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(i)}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedSeason === i
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {season.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {currentSeason.episodes.map((ep, i) => (
              <Link
                key={ep.id}
                to={`/watch/${anime.id}/${currentSeason.id}/${ep.id}`}
                className="group gradient-card rounded-lg sm:rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  <img
                    src={ep.thumbnail}
                    alt={ep.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary rounded-full p-1.5 sm:p-2">
                      <Play size={12} className="text-primary-foreground sm:w-4 sm:h-4" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2 sm:p-3">
                  <h4 className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    E{ep.number} - {ep.title}
                  </h4>
                  <div className="flex items-center gap-1 text-muted-foreground text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                    <Clock size={10} className="sm:w-3 sm:h-3" />
                    <span>{ep.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
