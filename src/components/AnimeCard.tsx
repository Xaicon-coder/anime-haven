import { Star, Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { Anime } from "@/data/animeData";

interface AnimeCardProps {
  anime: Anime;
  index?: number;
}

const AnimeCard = ({ anime, index = 0 }: AnimeCardProps) => {
  return (
    <Link
      to={`/anime/${anime.id}`}
      className="group relative flex-shrink-0 w-[160px] sm:w-[200px] animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
        <img
          src={anime.cover}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary rounded-full p-3 glow-primary">
            <Play size={20} className="text-primary-foreground" fill="currentColor" />
          </div>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md px-2 py-0.5">
          <Star size={10} className="text-primary" fill="currentColor" />
          <span className="text-xs font-medium text-foreground">{anime.rating}</span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
        {anime.title}
      </h3>
      <p className="text-xs text-muted-foreground">
        {anime.year} • {anime.seasons.length} Stagion{anime.seasons.length > 1 ? "i" : "e"}
      </p>
    </Link>
  );
};

export default AnimeCard;
