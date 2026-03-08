import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import AnimeRow from "@/components/AnimeRow";
import AnimeRowSkeleton from "@/components/AnimeRowSkeleton";
import { useTopAnime, useSeasonalAnime } from "@/hooks/useAnimeApi";
import { animeList, popularAnime, topRatedAnime, recentAnime } from "@/data/animeData";

const Index = () => {
  const { anime: topAnime, loading: topLoading } = useTopAnime();
  const { anime: seasonalAnime, loading: seasonalLoading } = useSeasonalAnime();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <main className="pb-12">
        {seasonalLoading ? (
          <AnimeRowSkeleton title="🔥 Anime della Stagione" />
        ) : (
          <AnimeRow title="🔥 Anime della Stagione" animeList={seasonalAnime.length > 0 ? seasonalAnime : popularAnime} />
        )}
        {topLoading ? (
          <AnimeRowSkeleton title="⭐ Più Votati" />
        ) : (
          <AnimeRow title="⭐ Più Votati" animeList={topAnime.length > 0 ? topAnime : topRatedAnime} />
        )}
        <AnimeRow title="📺 Classici Imperdibili" animeList={animeList} />
      </main>
    </div>
  );
};

export default Index;
