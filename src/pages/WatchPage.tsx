import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { animeList, getVideoPath } from "@/data/animeData";
import { useAnimeById } from "@/hooks/useAnimeApi";
import type { Anime } from "@/data/animeData";

const WatchPage = () => {
  const { animeId, seasonId, episodeId } = useParams();
  const { anime, loading } = useAnimeById(animeId || "");

  const season = anime?.seasons.find((s) => s.id === seasonId);
  const episode = season?.episodes.find((e) => e.id === episodeId);
  const episodeIndex = season?.episodes.findIndex((e) => e.id === episodeId) ?? -1;

  if (!anime || !season || !episode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center px-4">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">Episodio non trovato</h1>
          <Link to="/" className="text-primary hover:underline text-sm">Torna alla home</Link>
        </div>
      </div>
    );
  }

  const prevEp = episodeIndex > 0 ? season.episodes[episodeIndex - 1] : null;
  const nextEp = episodeIndex < season.episodes.length - 1 ? season.episodes[episodeIndex + 1] : null;

  // Percorso video: /anime/[id]/stagione-[n]/episodio-[n].mp4
  const videoPath = `/anime/${anime.id}/stagione-${season.number}/episodio-${episode.number}.mp4`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="w-full bg-black aspect-video max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh] relative">
          <video
            key={videoPath}
            src={videoPath}
            controls
            autoPlay
            className="w-full h-full"
            poster={episode.thumbnail}
          >
            Il tuo browser non supporta il video.
          </video>
        </div>

        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Link
            to={`/anime/${anime.id}`}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground text-xs sm:text-sm mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" /> Torna a {anime.title}
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground">{anime.title}</h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">
                Stagione {season.number} • Episodio {episode.number} - {episode.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {prevEp && (
                <Link to={`/watch/${anime.id}/${season.id}/${prevEp.id}`}
                  className="inline-flex items-center gap-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                  <ChevronLeft size={14} className="sm:w-4 sm:h-4" /> Precedente
                </Link>
              )}
              {nextEp && (
                <Link to={`/watch/${anime.id}/${season.id}/${nextEp.id}`}
                  className="inline-flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                  Prossimo <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                </Link>
              )}
            </div>
          </div>

          <h3 className="text-xs sm:text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
            Altri episodi
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2 sm:gap-3">
            {season.episodes.map((ep) => (
              <Link key={ep.id} to={`/watch/${anime.id}/${season.id}/${ep.id}`}
                className={`rounded-lg p-2 sm:p-3 text-xs sm:text-sm font-medium transition-all border text-center ${
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
