import { Star, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Anime } from "@/data/animeData";

interface AnimeCardProps {
  anime: Anime;
  index?: number;
}

const AnimeCard = ({ anime, index = 0 }: AnimeCardProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/anime/${anime.id}`}
      className="group relative flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[210px] 2xl:w-[220px] animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-secondary">
        {!imgError ? (
          <img
            src={anime.cover}
            alt={anime.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs text-center p-2">
            {anime.title}
          </div>
        )}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary rounded-full p-2.5 sm:p-3 glow-primary">
            <Play size={16} className="text-primary-foreground sm:w-5 sm:h-5" fill="currentColor" />
          </div>
        </div>
        {anime.rating > 0 && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md px-1.5 py-0.5 sm:px-2">
            <Star size={9} className="text-primary sm:w-[10px] sm:h-[10px]" fill="currentColor" />
            <span className="text-[10px] sm:text-xs font-medium text-foreground">{anime.rating}</span>
          </div>
        )}
      </div>
      <h3 className="text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
        {anime.title}
      </h3>
      <p className="text-[10px] sm:text-xs text-muted-foreground">
        {anime.year} • {anime.seasons.length} Stagion{anime.seasons.length > 1 ? "i" : "e"}
      </p>
    </Link>
  );
};

export default AnimeCard;
