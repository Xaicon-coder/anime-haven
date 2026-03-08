import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import Navbar from "@/components/Navbar";
import { animeList } from "@/data/animeData";
import { useAnimeById } from "@/hooks/useAnimeApi";
import type { Anime } from "@/data/animeData";

const WatchPage = () => {
  const { animeId, seasonId, episodeId } = useParams();
  const isApiAnime = animeId?.startsWith("mal-");
  const { anime: apiAnime } = useAnimeById(isApiAnime ? animeId! : "0");

  const localAnime = animeList.find((a) => a.id === animeId);
  const anime: Anime | null | undefined = localAnime || apiAnime;

  const season = anime?.seasons.find((s) => s.id === seasonId);
  const episode = season?.episodes.find((e) => e.id === episodeId);
  const episodeIndex = season?.episodes.findIndex((e) => e.id === episodeId) ?? -1;

  if (!anime || !season || !episode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Episodio non trovato</h1>
          <Link to="/" className="text-primary hover:underline">Torna alla home</Link>
        </div>
      </div>
    );
  }

  const prevEp = episodeIndex > 0 ? season.episodes[episodeIndex - 1] : null;
  const nextEp = episodeIndex < season.episodes.length - 1 ? season.episodes[episodeIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="w-full bg-muted aspect-video max-h-[70vh] flex items-center justify-center relative">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4">
              <SkipForward size={32} className="text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              Collega il tuo server CasaOS per riprodurre
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              /anime/{anime.title}/Stagione {season.number}/{episode.title}.mp4
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          <Link
            to={`/anime/${anime.id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Torna a {anime.title}
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">{anime.title}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Stagione {season.number} • Episodio {episode.number} - {episode.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {prevEp && (
                <Link to={`/watch/${anime.id}/${season.id}/${prevEp.id}`}
                  className="inline-flex items-center gap-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <ChevronLeft size={16} /> Precedente
                </Link>
              )}
              {nextEp && (
                <Link to={`/watch/${anime.id}/${season.id}/${nextEp.id}`}
                  className="inline-flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Prossimo <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>

          <h3 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Altri episodi
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {season.episodes.map((ep) => (
              <Link key={ep.id} to={`/watch/${anime.id}/${season.id}/${ep.id}`}
                className={`rounded-lg p-3 text-sm font-medium transition-all border ${
                  ep.id === episodeId
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                }`}>
                Ep. {ep.number}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
