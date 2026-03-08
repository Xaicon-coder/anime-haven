import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import AnimeRow from "@/components/AnimeRow";
import AnimeRowSkeleton from "@/components/AnimeRowSkeleton";
import ContinueWatching from "@/components/ContinueWatching";
import AccountGate from "@/components/AccountGate";
import { useTopAnime, useSeasonalAnime, useRandomAnime } from "@/hooks/useAnimeApi";
import { popularAnime, topRatedAnime } from "@/data/animeData";
import { Flame, Star, Shuffle } from "lucide-react";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";

const Index = () => {
  useSpatialNavigation();
  const { anime: topAnime, loading: topLoading } = useTopAnime();
  const { anime: seasonalAnime, loading: seasonalLoading } = useSeasonalAnime();
  const { anime: randomAnime, loading: randomLoading } = useRandomAnime();

  return (
    <AccountGate>
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
          {randomLoading ? (
            <AnimeRowSkeleton title="Scopri Anime" icon={Shuffle} />
          ) : (
            <AnimeRow title="Scopri Anime" icon={Shuffle} animeList={randomAnime.length > 0 ? randomAnime : popularAnime} />
          )}
        </main>
      </div>
    </AccountGate>
  );
};

export default Index;
