import { Link } from "react-router-dom";
import { Play, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { getContinueWatching, type WatchProgress } from "@/hooks/useWatchProgress";
import { animeList } from "@/data/animeData";

const ContinueWatching = () => {
  const [items, setItems] = useState<WatchProgress[]>([]);

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto py-4 sm:py-6">
      <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
        <Play size={20} className="text-primary" />
        Continua a guardare
      </h2>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2">
        {items.map((item) => {
          const anime = animeList.find((a) => a.id === item.animeId);
          if (!anime) return null;
          const season = anime.seasons.find((s) => s.id === item.seasonId);
          const episode = season?.episodes.find((e) => e.id === item.episodeId);
          if (!season || !episode) return null;

          const progressPercent = item.duration > 0 ? Math.round((item.currentTime / item.duration) * 100) : 0;
          const minutesLeft = Math.max(0, Math.ceil((item.duration - item.currentTime) / 60));

          return (
            <Link
              key={item.animeId}
              to={`/watch/${anime.id}/${season.id}/${episode.id}`}
              className="group flex-shrink-0 w-[260px] sm:w-[300px] gradient-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all"
            >
              <div className="relative aspect-video overflow-hidden bg-secondary">
                <img
                  src={episode.thumbnail || anime.cover}
                  alt={anime.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-focus-visible:scale-105 transition-transform duration-200 ease-out"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary rounded-full p-2.5">
                    <Play size={16} className="text-primary-foreground" fill="currentColor" />
                  </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {anime.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ep. {episode.number} - {episode.title}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground text-[10px] mt-1">
                  <Clock size={10} />
                  <span>{minutesLeft} min rimanenti</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ContinueWatching;
