import { useRef, useEffect, useCallback, useState } from "react";
import { ArrowLeft, SkipForward, Languages, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { saveProgress, getProgress } from "@/hooks/useWatchProgress";
import type { Anime, Season, Episode } from "@/data/animeData";
import { getVideoPath } from "@/data/animeData";

interface SkipSegment {
  type: "intro" | "outro" | "recap";
  start: number;
  end: number;
  label: string;
}

interface SubtitleTrack {
  lang: string;
  label: string;
  src: string;
}

// Genera percorsi sottotitoli basati sulla convenzione:
// /anime/[folder]/[season]/subs/[episodio]-[lang].vtt
function getSubtitleTracks(anime: Anime, season: Season, episode: Episode): SubtitleTrack[] {
  const basePath = `/anime/${encodeURIComponent(anime.folderName)}/${encodeURIComponent(season.folderName)}/subs`;
  const epNum = String(episode.number).padStart(2, "0");

  return [
    { lang: "it", label: "Italiano", src: `${basePath}/ep${epNum}-it.vtt` },
    { lang: "en", label: "English", src: `${basePath}/ep${epNum}-en.vtt` },
    { lang: "ja", label: "日本語", src: `${basePath}/ep${epNum}-ja.vtt` },
  ];
}

// Default skip segments (configurabili per episodio)
function getSkipSegments(episode: Episode, duration: number): SkipSegment[] {
  const segments: SkipSegment[] = [];

  // Intro: primi 90 secondi (tipico per anime)
  if (duration > 120) {
    segments.push({ type: "intro", start: 0, end: 90, label: "Salta intro" });
  }

  // Outro: ultimi 90 secondi
  if (duration > 180) {
    segments.push({ type: "outro", start: duration - 90, end: duration, label: "Salta outro" });
  }

  return segments;
}

// Salva/carica skip timestamps personalizzati da localStorage
const SKIP_KEY = "anistream-skip-segments";

function getSavedSkipSegments(animeId: string, seasonId: string, episodeId: string): SkipSegment[] | null {
  try {
    const all = JSON.parse(localStorage.getItem(SKIP_KEY) || "{}");
    return all[`${animeId}__${seasonId}__${episodeId}`] || null;
  } catch {
    return null;
  }
}

interface VideoPlayerProps {
  anime: Anime;
  season: Season;
  episode: Episode;
  prevEp: Episode | null;
  nextEp: Episode | null;
  onEpisodeEnd?: () => void;
}

const VideoPlayer = ({ anime, season, episode, prevEp, nextEp, onEpisodeEnd }: VideoPlayerProps) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [availableSubs, setAvailableSubs] = useState<SubtitleTrack[]>([]);
  const [skipSegments, setSkipSegments] = useState<SkipSegment[]>([]);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const videoPath = getVideoPath(anime, season, episode);
  const subtitleTracks = getSubtitleTracks(anime, season, episode);

  // Check which subtitle files actually exist
  useEffect(() => {
    const checkSubs = async () => {
      const available: SubtitleTrack[] = [];
      for (const track of subtitleTracks) {
        try {
          const res = await fetch(track.src, { method: "HEAD" });
          if (res.ok) available.push(track);
        } catch {}
      }
      setAvailableSubs(available);
    };
    checkSubs();
  }, [anime.id, season.id, episode.id]);

  // Fullscreen automatico
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const goFullscreen = () => {
      try {
        if (containerRef.current?.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(() => {});
        } else if ((video as any).webkitEnterFullscreen) {
          (video as any).webkitEnterFullscreen();
        }
      } catch {}
    };
    const onCanPlay = () => { goFullscreen(); video.removeEventListener("canplay", onCanPlay); };
    video.addEventListener("canplay", onCanPlay);
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [videoPath]);

  // Ripristina progresso
  useEffect(() => {
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
  }, [anime.id, season.id, episode.id, videoPath]);

  // Carica skip segments quando duration disponibile
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const saved = getSavedSkipSegments(anime.id, season.id, episode.id);
    setSkipSegments(saved || getSkipSegments(episode, video.duration));
  }, [anime.id, season.id, episode.id]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    saveProgress(anime.id, season.id, episode.id, video.currentTime, video.duration);

    // Check skip segments visibility
    const intro = skipSegments.find(s => s.type === "intro");
    const outro = skipSegments.find(s => s.type === "outro");

    setShowSkipIntro(!!(intro && video.currentTime >= intro.start && video.currentTime < intro.end));
    setShowSkipOutro(!!(outro && video.currentTime >= outro.start && video.currentTime < outro.end));
  }, [anime.id, season.id, episode.id, skipSegments]);

  const skipTo = useCallback((type: "intro" | "outro") => {
    const video = videoRef.current;
    const segment = skipSegments.find(s => s.type === type);
    if (video && segment) {
      video.currentTime = segment.end;
    }
  }, [skipSegments]);

  const goToNextEp = useCallback(() => {
    if (nextEp) navigate(`/watch/${anime.id}/${season.id}/${nextEp.id}`);
  }, [nextEp, anime.id, season.id, navigate]);

  const goToPrevEp = useCallback(() => {
    if (prevEp) navigate(`/watch/${anime.id}/${season.id}/${prevEp.id}`);
  }, [prevEp, anime.id, season.id, navigate]);

  const handleEnded = useCallback(() => {
    onEpisodeEnd?.();
    goToNextEp();
  }, [goToNextEp, onEpisodeEnd]);

  // Seleziona sottotitolo
  const selectSubtitle = useCallback((lang: string | null) => {
    const video = videoRef.current;
    if (!video) return;
    setActiveSub(lang);
    setShowSubMenu(false);

    // Disabilita tutte le tracce
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = "disabled";
    }

    // Abilita quella selezionata
    if (lang) {
      for (let i = 0; i < video.textTracks.length; i++) {
        if (video.textTracks[i].language === lang) {
          video.textTracks[i].mode = "showing";
          break;
        }
      }
    }
  }, []);

  // Overlay
  const revealOverlay = useCallback(() => {
    setShowOverlay(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowOverlay(false);
      setShowSubMenu(false);
    }, 5000);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const video = videoRef.current;
      switch (e.key) {
        case "n": case "N": e.preventDefault(); goToNextEp(); break;
        case "p": case "P": e.preventDefault(); goToPrevEp(); break;
        case "ArrowRight":
          if (e.ctrlKey || e.altKey) { e.preventDefault(); goToNextEp(); }
          else if (video && !e.shiftKey) { e.preventDefault(); video.currentTime = Math.min(video.duration, video.currentTime + 10); }
          break;
        case "ArrowLeft":
          if (e.ctrlKey || e.altKey) { e.preventDefault(); goToPrevEp(); }
          else if (video && !e.shiftKey) { e.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 10); }
          break;
        case "ArrowUp":
          if (video) { e.preventDefault(); video.currentTime = Math.min(video.duration, video.currentTime + 30); }
          break;
        case "ArrowDown":
          if (video) { e.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 30); }
          break;
        case " ":
          e.preventDefault();
          if (video) video.paused ? video.play() : video.pause();
          break;
        case "f": case "F":
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen();
          else containerRef.current?.requestFullscreen?.().catch(() => {});
          break;
        case "s": case "S":
          e.preventDefault();
          setShowSubMenu(prev => !prev);
          break;
        case "i": case "I":
          e.preventDefault();
          if (showSkipIntro) skipTo("intro");
          break;
        case "Escape":
          if (!document.fullscreenElement) navigate(`/anime/${anime.id}`);
          break;
        case "Backspace": case "BrowserBack":
          if (!document.fullscreenElement) { e.preventDefault(); navigate(`/anime/${anime.id}`); }
          break;
      }
      revealOverlay();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goToNextEp, goToPrevEp, revealOverlay, anime.id, navigate, showSkipIntro, skipTo]);

  return (
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
        onLoadedMetadata={handleLoadedMetadata}
        crossOrigin="anonymous"
      >
        {availableSubs.map((track) => (
          <track
            key={track.lang}
            kind="subtitles"
            src={track.src}
            srcLang={track.lang}
            label={track.label}
          />
        ))}
      </video>

      {/* Skip Intro Button */}
      {showSkipIntro && (
        <button
          onClick={(e) => { e.stopPropagation(); skipTo("intro"); }}
          className="absolute bottom-20 right-4 sm:bottom-24 sm:right-6 z-30 
            bg-white/20 backdrop-blur-md hover:bg-white/30 text-white 
            px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold 
            border border-white/30 transition-all animate-fade-in
            flex items-center gap-2 shadow-lg"
        >
          <SkipForward size={18} />
          Salta intro
        </button>
      )}

      {/* Skip Outro Button */}
      {showSkipOutro && nextEp && (
        <button
          onClick={(e) => { e.stopPropagation(); goToNextEp(); }}
          className="absolute bottom-20 right-4 sm:bottom-24 sm:right-6 z-30 
            bg-primary/80 backdrop-blur-md hover:bg-primary text-primary-foreground 
            px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold 
            border border-primary/50 transition-all animate-fade-in
            flex items-center gap-2 shadow-lg"
        >
          <SkipForward size={18} />
          Prossimo episodio
        </button>
      )}

      {/* Subtitle selector button */}
      {availableSubs.length > 0 && showOverlay && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowSubMenu(prev => !prev); }}
          className="absolute bottom-20 left-4 sm:bottom-24 sm:left-6 z-30
            bg-black/50 backdrop-blur-md hover:bg-black/70 text-white
            p-2 sm:p-2.5 rounded-lg transition-all animate-fade-in
            border border-white/20"
          title="Sottotitoli (S)"
        >
          <Languages size={20} />
        </button>
      )}

      {/* Subtitle menu */}
      {showSubMenu && availableSubs.length > 0 && (
        <div className="absolute bottom-32 left-4 sm:bottom-36 sm:left-6 z-40 
          bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 
          p-2 min-w-[160px] animate-fade-in shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-3 py-1.5 mb-1">
            <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Sottotitoli</span>
            <button onClick={() => setShowSubMenu(false)} className="text-white/50 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <button
            onClick={() => selectSubtitle(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              activeSub === null ? "bg-primary/30 text-primary" : "text-white/80 hover:bg-white/10"
            }`}
          >
            Disattivati
          </button>
          {availableSubs.map((track) => (
            <button
              key={track.lang}
              onClick={() => selectSubtitle(track.lang)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSub === track.lang ? "bg-primary/30 text-primary" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>
      )}

      {/* Info overlay top */}
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

      {/* Shortcut hints */}
      {showOverlay && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-10 z-30 animate-fade-in">
          <div className="flex gap-3 text-white/50 text-[10px] sm:text-xs lg:text-sm">
            <span>◀▶ ±10s</span>
            <span>▲▼ ±30s</span>
            <span>N = Prossimo</span>
            <span>S = Sottotitoli</span>
            <span>I = Salta intro</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
