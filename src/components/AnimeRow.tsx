import { ChevronRight } from "lucide-react";
import AnimeCard from "./AnimeCard";
import type { Anime } from "@/data/animeData";

interface AnimeRowProps {
  title: string;
  animeList: Anime[];
}

const AnimeRow = ({ title, animeList }: AnimeRowProps) => {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <h2 className="text-lg sm:text-xl font-display font-bold text-foreground">{title}</h2>
        <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          Vedi tutto <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2 max-w-[1400px] mx-auto">
        {animeList.map((anime, i) => (
          <AnimeCard key={anime.id} anime={anime} index={i} />
        ))}
      </div>
    </section>
  );
};

export default AnimeRow;
