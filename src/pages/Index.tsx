import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import AnimeRow from "@/components/AnimeRow";
import AnimeRowSkeleton from "@/components/AnimeRowSkeleton";
import ContinueWatching from "@/components/ContinueWatching";
import { useTopAnime, useSeasonalAnime } from "@/hooks/useAnimeApi";
import { animeList, popularAnime, topRatedAnime } from "@/data/animeData";
import { Flame, Star, Tv } from "lucide-react";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";

const Index = () => {
  const { anime: topAnime, loading: topLoading } = useTopAnime();
  const { anime: seasonalAnime, loading: seasonalLoading } = useSeasonalAnime();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <main className="pb-8 sm:pb-12">
        <ContinueWatching />
        {seasonalLoading ? (
          <AnimeRowSkeleton title="Anime della Stagione" icon={Flame} />
        ) : (
          <AnimeRow title="Anime della Stagione" icon={Flame} animeList={seasonalAnime.length > 0 ? seasonalAnime : popularAnime} />
        )}
        {topLoading ? (
          <AnimeRowSkeleton title="Più Votati" icon={Star} />
        ) : (
          <AnimeRow title="Più Votati" icon={Star} animeList={topAnime.length > 0 ? topAnime : topRatedAnime} />
        )}
        <AnimeRow title="Classici Imperdibili" icon={Tv} animeList={animeList} />
      </main>
    </div>
  );
};

export default Index;
