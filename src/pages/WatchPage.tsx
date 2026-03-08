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
  const [showOverlay, setShowOverlay] = useState(false);
  const [isNearEnd, setIsNearEnd] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const season = anime?.seasons.find((s) => s.id === seasonId);
  const episode = season?.episodes.find((e) => e.id === episodeId);
  const episodeIndex = season?.episodes.findIndex((e) => e.id === episodeId) ?? -1;
  const prevEp = episodeIndex > 0 ? season?.episodes[episodeIndex - 1] ?? null : null;
  const nextEp = season && episodeIndex < season.episodes.length - 1 ? season.episodes[episodeIndex + 1] : null;
  const videoPath = anime && season && episode ? getVideoPath(anime, season, episode) : "";

  // Fullscreen automatico all'apertura
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const goFullscreen = () => {
      try {
        if (containerRef.current?.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(() => {});
        } else if ((video as any).webkitEnterFullscreen) {
          // iOS / Smart TV fallback
          (video as any).webkitEnterFullscreen();
        }
      } catch {}
    };

    // Richiedi fullscreen dopo che il video è pronto
    const onCanPlay = () => {
      goFullscreen();
      video.removeEventListener("canplay", onCanPlay);
    };
    video.addEventListener("canplay", onCanPlay);

    return () => video.removeEventListener("canplay", onCanPlay);
  }, [videoPath]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && anime && season && episode) {
      saveProgress(anime.id, season.id, episode.id, video.currentTime, video.duration);
      if (video.duration && video.currentTime > video.duration - 90) {
        setIsNearEnd(true);
      } else {
        setIsNearEnd(false);
      }
    }
  }, [anime, season, episode]);

  const goToNextEp = useCallback(() => {
    if (nextEp && anime && season) {
      navigate(`/watch/${anime.id}/${season.id}/${nextEp.id}`);
    }
  }, [nextEp, anime, season, navigate]);

  const goToPrevEp = useCallback(() => {
    if (prevEp && anime && season) {
      navigate(`/watch/${anime.id}/${season.id}/${prevEp.id}`);
    }
  }, [prevEp, anime, season, navigate]);

  const handleEnded = useCallback(() => {
    goToNextEp();
  }, [goToNextEp]);

  // Ripristina progresso
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

  // Mostra/nascondi overlay
  const revealOverlay = useCallback(() => {
    setShowOverlay(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowOverlay(false), 5000);
  }, []);

  // Comandi telecomando TV
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const video = videoRef.current;
      
      switch (e.key) {
        // Prossimo episodio: tasto N o freccia destra lunga (con Ctrl/Alt)
        case "n":
        case "N":
          e.preventDefault();
          goToNextEp();
          break;
        case "p":
        case "P":
          e.preventDefault();
          goToPrevEp();
          break;
        // Avanti/indietro 10 secondi con frecce
        case "ArrowRight":
          if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            goToNextEp();
          } else if (video && !e.shiftKey) {
            e.preventDefault();
            video.currentTime = Math.min(video.duration, video.currentTime + 10);
          }
          break;
        case "ArrowLeft":
          if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            goToPrevEp();
          } else if (video && !e.shiftKey) {
            e.preventDefault();
            video.currentTime = Math.max(0, video.currentTime - 10);
          }
          break;
        // Avanti/indietro 30 secondi con Shift+frecce
        case "ArrowUp":
          if (video) {
            e.preventDefault();
            video.currentTime = Math.min(video.duration, video.currentTime + 30);
          }
          break;
        case "ArrowDown":
          if (video) {
            e.preventDefault();
            video.currentTime = Math.max(0, video.currentTime - 30);
          }
          break;
        // Spazio = play/pause
        case " ":
          e.preventDefault();
          if (video) video.paused ? video.play() : video.pause();
          break;
        // F = fullscreen
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            containerRef.current?.requestFullscreen?.().catch(() => {});
          }
          break;
        // Escape = esci dalla pagina
        case "Escape":
          if (!document.fullscreenElement && anime) {
            navigate(`/anime/${anime.id}`);
          }
          break;
        // Back button per TV (tasto specifico)
        case "Backspace":
        case "BrowserBack":
          if (!document.fullscreenElement && anime) {
            e.preventDefault();
            navigate(`/anime/${anime.id}`);
          }
          break;
      }
      revealOverlay();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goToNextEp, goToPrevEp, revealOverlay, anime, navigate]);

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
        {/* Video container fullscreen-ready */}
        <div
          ref={containerRef}
          className="w-full bg-black relative group"
          style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 4rem)" }}
          onMouseMove={revealOverlay}
          onTouchStart={revealOverlay}
          onClick={revealOverlay}
        >
          <video
            ref={videoRef}
            key={videoPath}
            src={videoPath}
            controls
            autoPlay
            className="w-full h-full object-contain"
            poster={episode.thumbnail}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          >
            Il tuo browser non supporta il video.
          </video>

          {/* PROSSIMO EPISODIO - grande, sempre visibile vicino alla fine, facile da cliccare con telecomando */}
          {nextEp && (showOverlay || isNearEnd) && (
            <button
              ref={nextBtnRef}
              onClick={(e) => { e.stopPropagation(); goToNextEp(); }}
              className="absolute bottom-20 sm:bottom-24 lg:bottom-28 right-4 sm:right-6 lg:right-10 z-30
                flex items-center gap-3 sm:gap-4
                bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground
                font-bold rounded-xl lg:rounded-2xl shadow-2xl glow-primary
                px-6 sm:px-8 lg:px-10 xl:px-12 py-4 sm:py-5 lg:py-6 xl:py-7
                text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl
                transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-primary/60 focus:scale-105
                animate-fade-in cursor-pointer select-none"
              tabIndex={0}
              autoFocus={isNearEnd}
            >
              <SkipForward className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
              <span className="flex flex-col items-start leading-tight">
                <span>Prossimo Episodio</span>
                <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-normal opacity-80">
                  Ep. {nextEp.number}
                </span>
              </span>
            </button>
          )}

          {/* EPISODIO PRECEDENTE */}
          {prevEp && showOverlay && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevEp(); }}
              className="absolute bottom-20 sm:bottom-24 lg:bottom-28 left-4 sm:left-6 lg:left-10 z-30
                flex items-center gap-2 sm:gap-3
                bg-secondary/90 hover:bg-secondary active:scale-95 text-secondary-foreground
                font-semibold rounded-xl lg:rounded-2xl shadow-xl backdrop-blur-sm
                px-5 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5
                text-sm sm:text-base lg:text-lg xl:text-xl
                transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-secondary/50
                animate-fade-in cursor-pointer select-none"
              tabIndex={0}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              Precedente
            </button>
          )}

          {/* Info episodio overlay in alto */}
          {showOverlay && (
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-10 z-30 animate-fade-in">
              <Link
                to={`/anime/${anime.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm sm:text-base lg:text-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="font-medium">{anime.title}</span>
                <span className="opacity-60">• S{season.number} E{episode.number}</span>
              </Link>
            </div>
          )}

          {/* Shortcut hint per TV */}
          {showOverlay && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-10 z-30 animate-fade-in">
              <div className="flex gap-3 text-white/50 text-[10px] sm:text-xs lg:text-sm">
                <span>◀▶ ±10s</span>
                <span>▲▼ ±30s</span>
                <span>N = Prossimo</span>
              </div>
            </div>
          )}
        </div>

        {/* Info sotto il video */}
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
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