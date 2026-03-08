import { Bookmark, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import { animeList } from "@/data/animeData";
import { useWatchlist } from "@/hooks/useLocalWatchlist";
import { useTopAnime, useSeasonalAnime } from "@/hooks/useAnimeApi";
import { useMemo } from "react";
import type { Anime } from "@/data/animeData";

const WatchlistPage = () => {
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { anime: topAnime } = useTopAnime();
  const { anime: seasonalAnime } = useSeasonalAnime();

  // Merge all sources to find watchlisted anime
  const allAnime = useMemo(() => {
    const map = new Map<string, Anime>();
    for (const a of animeList) map.set(a.id, a);
    for (const a of topAnime) if (!map.has(a.id)) map.set(a.id, a);
    for (const a of seasonalAnime) if (!map.has(a.id)) map.set(a.id, a);
    return map;
  }, [topAnime, seasonalAnime]);

  const watchlistAnime = watchlist
    .map((id) => allAnime.get(id))
    .filter((a): a is Anime => !!a);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
            <Bookmark size={28} className="text-primary" />
            La Mia Lista
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gli anime che hai salvato per dopo
          </p>
        </div>

        {watchlistAnime.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm mb-2">La tua lista è vuota</p>
            <p className="text-muted-foreground/60 text-xs">
              Aggiungi anime alla tua lista dalla pagina dettaglio
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-4">
              {watchlistAnime.length} anime nella lista
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-4">
              {watchlistAnime.map((anime, i) => (
                <div key={anime.id} className="relative group/card">
                  <AnimeCard anime={anime} index={i} />
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWatchlist(anime.id); }}
                    className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity z-10"
                    title="Rimuovi dalla lista"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
