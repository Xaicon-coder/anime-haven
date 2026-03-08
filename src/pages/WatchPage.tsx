import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { useRef, useEffect, useCallback, useState } from "react";
import Navbar from "@/components/Navbar";
import { getVideoPath } from "@/data/animeData";
import { useAnimeById } from "@/hooks/useAnimeApi";
import { saveProgress, getProgress } from "@/hooks/useWatchProgress";

const WatchPage = () => {
  const { animeId, seasonId, episodeId } = useParams();
  const navigate = useNavigate();
  const { anime } = useAnimeById(animeId || "");
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [isNearEnd, setIsNearEnd] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const season = anime?.seasons.find((s) => s.id === seasonId);
  const episode = season?.episodes.find((e) => e.id === episodeId);
  const episodeIndex = season?.episodes.findIndex((e) => e.id === episodeId) ?? -1;
  const prevEp = episodeIndex > 0 ? season?.episodes[episodeIndex - 1] ?? null : null;
  const nextEp = season && episodeIndex < season.episodes.length - 1 ? season.episodes[episodeIndex + 1] : null;
  const videoPath = anime && season && episode ? getVideoPath(anime, season, episode) : "";

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && anime && season && episode) {
      saveProgress(anime.id, season.id, episode.id, video.currentTime, video.duration);
      // Mostra pulsante prossimo episodio negli ultimi 90 secondi
      if (video.duration && video.currentTime > video.duration - 90) {
        setIsNearEnd(true);
      } else {
        setIsNearEnd(false);
      }
    }
  }, [anime, season, episode]);

  // Auto-play prossimo episodio a fine video
  const handleEnded = useCallback(() => {
    if (nextEp && anime && season) {
      navigate(`/watch/${anime.id}/${season.id}/${nextEp.id}`);
    }
  }, [nextEp, anime, season, navigate]);

  useEffect(() => {
    if (!anime || !season || !episode) return;
    const saved = getProgress(anime.id, season.id, episode.id);
    const video = videoRef.current;
    if (saved && video) {
      const onLoaded = () => {
        if (saved.currentTime < video.duration - 10) {
          video.currentTime = saved.currentTime;
        }
        video.removeEventListener("loadedmetadata", onLoaded);
      };
      video.addEventListener("loadedmetadata", onLoaded);
    }
  }, [anime, season, episode, videoPath]);

  // Mostra/nascondi overlay controlli (mouse/touch/telecomando)
  const revealControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 4000);
  }, []);

  // Keyboard support per TV (freccia destra = prossimo ep)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && (e.altKey || e.ctrlKey) && nextEp && anime && season) {
        navigate(`/watch/${anime.id}/${season.id}/${nextEp.id}`);
      }
      revealControls();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nextEp, anime, season, navigate, revealControls]);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Video container con overlay prossimo episodio */}
        <div
          ref={containerRef}
          className="w-full bg-black aspect-video max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh] xl:max-h-[80vh] 2xl:max-h-[85vh] relative group"
          onMouseMove={revealControls}
          onTouchStart={revealControls}
        >
          <video
            ref={videoRef}
            key={videoPath}
            src={videoPath}
            controls
            autoPlay
            className="w-full h-full"
            poster={episode.thumbnail}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          >
            Il tuo browser non supporta il video.
          </video>

          {/* Overlay prossimo episodio - appare con i controlli o vicino alla fine */}
          {nextEp && (showControls || isNearEnd) && (
            <div className="absolute bottom-14 sm:bottom-16 lg:bottom-20 right-3 sm:right-5 lg:right-8 z-20 animate-fade-in">
              <Link
                to={`/watch/${anime.id}/${season.id}/${nextEp.id}`}
                className="inline-flex items-center gap-2 sm:gap-3 bg-primary hover:bg-primary/90 text-primary-foreground 
                  font-semibold px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg lg:rounded-xl 
                  transition-all shadow-2xl glow-primary
                  text-sm sm:text-base lg:text-lg xl:text-xl
                  focus:outline-none focus:ring-4 focus:ring-primary/50"
                tabIndex={0}
              >
                <SkipForward size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                <span className="flex flex-col items-start leading-tight">
                  <span>Prossimo Episodio</span>
                  <span className="text-[10px] sm:text-xs lg:text-sm font-normal opacity-80">
                    Ep. {nextEp.number} - {nextEp.title}
                  </span>
                </span>
              </Link>
            </div>
          )}

          {/* Overlay precedente - lato sinistro */}
          {prevEp && showControls && (
            <div className="absolute bottom-14 sm:bottom-16 lg:bottom-20 left-3 sm:left-5 lg:left-8 z-20 animate-fade-in">
              <Link
                to={`/watch/${anime.id}/${season.id}/${prevEp.id}`}
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-secondary/90 hover:bg-secondary text-secondary-foreground 
                  font-medium px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg lg:rounded-xl 
                  transition-all shadow-xl backdrop-blur-sm
                  text-xs sm:text-sm lg:text-base xl:text-lg
                  focus:outline-none focus:ring-4 focus:ring-secondary/50"
                tabIndex={0}
              >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                Precedente
              </Link>
            </div>
          )}
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
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-display font-bold text-foreground">{anime.title}</h1>
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
                Stagione {season.number} • Episodio {episode.number} - {episode.title}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {prevEp && (
                <Link to={`/watch/${anime.id}/${season.id}/${prevEp.id}`}
                  className="inline-flex items-center gap-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-lg text-xs sm:text-sm lg:text-base font-medium transition-colors">
                  <ChevronLeft size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" /> Precedente
                </Link>
              )}
              {nextEp && (
                <Link to={`/watch/${anime.id}/${season.id}/${nextEp.id}`}
                  className="inline-flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-lg text-xs sm:text-sm lg:text-base font-medium transition-colors">
                  Prossimo <ChevronRight size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </Link>
              )}
            </div>
          </div>

          <h3 className="text-xs sm:text-sm lg:text-base font-display font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
            Altri episodi
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2 sm:gap-3">
            {season.episodes.map((ep) => (
              <Link key={ep.id} to={`/watch/${anime.id}/${season.id}/${ep.id}`}
                className={`rounded-lg p-2 sm:p-3 lg:p-4 text-xs sm:text-sm lg:text-base font-medium transition-all border text-center focus:outline-none focus:ring-2 focus:ring-primary ${
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