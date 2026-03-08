import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import AnimeRow from "@/components/AnimeRow";
import { animeList } from "@/data/animeData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <main className="pb-12">
        <AnimeRow title="🔥 Popolari" animeList={animeList} />
        <AnimeRow title="⭐ Più votati" animeList={[...animeList].reverse()} />
        <AnimeRow title="🆕 Aggiunti di recente" animeList={animeList.slice(2).concat(animeList.slice(0, 2))} />
      </main>
    </div>
  );
};

export default Index;
