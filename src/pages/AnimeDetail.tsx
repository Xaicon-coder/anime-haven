import { useParams, Link } from "react-router-dom";
import { Play, Star, ArrowLeft, Clock, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { animeList, type Anime } from "@/data/animeData";
import { useAnimeById } from "@/hooks/useAnimeApi";

const AnimeDetail = () => {
  const { id } = useParams();
  const isApiAnime = id?.startsWith("mal-");
  const { anime: apiAnime, loading } = useAnimeById(isApiAnime ? id! : "0");
  
  // Try local data first, then API
  const localAnime = animeList.find((a) => a.id === id);
  const anime: Anime | null | undefined = localAnime || apiAnime;
  
  const [selectedSeason, setSelectedSeason] = useState(0);

  if (loading && isApiAnime) {
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
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Anime non trovato</h1>
          <Link to="/" className="text-primary hover:underline">Torna alla home</Link>
        </div>
      </div>
    );
  }

  const currentSeason = anime.seasons[selectedSeason];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <img src={anime.banner} alt={anime.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero-overlay" />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 -mt-48 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> Torna indietro
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover */}
          <div className="flex-shrink-0">
            <img
              src={anime.cover}
              alt={anime.title}
              className="w-48 sm:w-56 aspect-[3/4] rounded-xl object-cover shadow-2xl border border-border"
            />
          </div>

          {/* Info */}
          <div className="flex-1 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">{anime.title}</h1>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {anime.rating > 0 && (
                <div className="flex items-center gap-1 text-primary">
                  <Star size={16} fill="currentColor" />
                  <span className="font-semibold">{anime.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Calendar size={14} />
                <span>{anime.year}</span>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                anime.status === "In corso" ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary text-secondary-foreground"
              }`}>
                {anime.status}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {anime.genres.map((g) => (
                <span key={g} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{g}</span>
              ))}
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              {anime.description}
            </p>
            <Link
              to={`/watch/${anime.id}/${currentSeason.id}/${currentSeason.episodes[0].id}`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-all glow-primary"
            >
              <Play size={18} fill="currentColor" />
              Guarda Episodio 1
            </Link>
          </div>
        </div>

        {/* Seasons & Episodes */}
        <div className="mt-12 mb-16">
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
            {anime.seasons.map((season, i) => (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(i)}
                className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedSeason === i
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Stagione {season.number}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentSeason.episodes.map((ep, i) => (
              <Link
                key={ep.id}
                to={`/watch/${anime.id}/${currentSeason.id}/${ep.id}`}
                className="group gradient-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary rounded-full p-2">
                      <Play size={16} className="text-primary-foreground" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    E{ep.number} - {ep.title}
                  </h4>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                    <Clock size={12} />
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
