import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AnimeCard from "./AnimeCard";
import type { Anime } from "@/data/animeData";

interface AnimeRowProps {
  title: string;
  icon: LucideIcon;
  animeList: Anime[];
}

const AnimeRow = ({ title, icon: Icon, animeList }: AnimeRowProps) => {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-primary" />
          <h2 className="text-base sm:text-lg lg:text-xl font-display font-bold text-foreground">{title}</h2>
        </div>
        <Link to="/explore" className="flex items-center gap-1 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          Vedi tutto <ChevronRight size={14} className="sm:w-4 sm:h-4" />
        </Link>
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2 max-w-[1800px] mx-auto">
        {animeList.map((anime, i) => (
          <AnimeCard key={anime.id} anime={anime} index={i} />
        ))}
      </div>
    </section>
  );
};

export default AnimeRow;
