import { useState, useEffect } from "react";
import type { Anime } from "@/data/animeData";
import { animeList } from "@/data/animeData";

const JIKAN_BASE = "https://api.jikan.moe/v4";

interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: {
    jpg: { large_image_url: string; image_url: string; original_image_url?: string };
    webp: { large_image_url: string; image_url: string; original_image_url?: string };
  };
  trailer?: { images?: { maximum_image_url?: string; large_image_url?: string } };
  synopsis: string | null;
  genres: { name: string }[];
  score: number | null;
  year: number | null;
  aired?: { prop?: { from?: { year?: number } } };
  status: string;
  episodes: number | null;
}

// Mappa generi inglese -> italiano
const genreMap: Record<string, string> = {
  "Action": "Azione",
  "Adventure": "Avventura",
  "Comedy": "Commedia",
  "Drama": "Drammatico",
  "Fantasy": "Fantasy",
  "Horror": "Horror",
  "Mystery": "Mistero",
  "Romance": "Romantico",
  "Sci-Fi": "Fantascienza",
  "Slice of Life": "Vita Quotidiana",
  "Sports": "Sport",
  "Supernatural": "Soprannaturale",
  "Thriller": "Thriller",
  "Suspense": "Suspense",
  "Award Winning": "Premiato",
  "Gourmet": "Cucina",
  "Boys Love": "Boys Love",
  "Girls Love": "Girls Love",
  "Ecchi": "Ecchi",
};

function mapStatus(status: string): string {
  if (status === "Currently Airing") return "In corso";
  if (status === "Finished Airing") return "Completato";
  if (status === "Not yet aired") return "Non ancora uscito";
  return status;
}

// Genera un ID basato sul titolo per il percorso file locale
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Controlla se un anime API corrisponde a uno locale (evita duplicati)
function findLocalMatch(j: JikanAnime): Anime | undefined {
  const titleLower = (j.title_english || j.title).toLowerCase();
  return animeList.find((a) => {
    const localTitle = a.title.toLowerCase();
    return localTitle === titleLower || 
           localTitle.includes(titleLower) || 
           titleLower.includes(localTitle);
  });
}

function mapJikanToAnime(j: JikanAnime): Anime {
  // Se esiste un anime locale corrispondente, usa quello (evita duplicati)
  const localMatch = findLocalMatch(j);
  if (localMatch) return localMatch;

  const cover = j.images.jpg?.original_image_url || j.images.webp?.large_image_url || j.images.jpg.large_image_url;
  const banner = j.trailer?.images?.maximum_image_url || j.trailer?.images?.large_image_url || cover;
  const animeYear = j.year || j.aired?.prop?.from?.year || 2024;
  const episodeCount = j.episodes || 12;
  const slug = generateSlug(j.title_english || j.title);

  return {
    id: slug,
    title: j.title_english || j.title,
    cover,
    banner,
    description: j.synopsis?.replace(/\[Written by MAL Rewrite\]/g, "").trim() || "Nessuna descrizione disponibile.",
    genres: j.genres.map((g) => genreMap[g.name] || g.name),
    rating: j.score || 0,
    year: animeYear,
    status: mapStatus(j.status),
    seasons: [
      {
        id: "s1",
        number: 1,
        title: "Stagione 1",
        episodes: Array.from({ length: Math.min(episodeCount, 26) }, (_, i) => ({
          id: `ep-${i + 1}`,
          number: i + 1,
          title: `Episodio ${i + 1}`,
          duration: `${20 + Math.floor(Math.random() * 5)} min`,
          thumbnail: cover,
        })),
      },
    ],
  };
}

// Rimuovi duplicati tra API e lista locale
function deduplicateAnime(apiAnime: Anime[]): Anime[] {
  const localIds = new Set(animeList.map((a) => a.id));
  const seen = new Set<string>();
  const result: Anime[] = [];

  for (const anime of apiAnime) {
    if (!localIds.has(anime.id) && !seen.has(anime.id)) {
      seen.add(anime.id);
      result.push(anime);
    }
  }

  return result;
}

export function useAnimeSearch(query: string) {
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&limit=10&sfw=true`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults((data.data || []).map(mapJikanToAnime));
      } catch (e) {
        if (!(e instanceof DOMException)) console.error(e);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return { results, loading };
}

export function useTopAnime() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${JIKAN_BASE}/top/anime?limit=25&sfw=true`);
        const data = await res.json();
        if (!cancelled) {
          const mapped = (data.data || []).map(mapJikanToAnime);
          setAnime(deduplicateAnime(mapped));
        }
      } catch (e) {
        console.error("Failed to fetch top anime:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { anime, loading };
}

export function useSeasonalAnime() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${JIKAN_BASE}/seasons/now?limit=25&sfw=true`);
        const data = await res.json();
        if (!cancelled) {
          const mapped = (data.data || []).map(mapJikanToAnime);
          setAnime(deduplicateAnime(mapped));
        }
      } catch (e) {
        console.error("Failed to fetch seasonal anime:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { anime, loading };
}

export function useAnimeById(id: string) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prima cerca nei locali
    const local = animeList.find((a) => a.id === id);
    if (local) {
      setAnime(local);
      setLoading(false);
      return;
    }

    // Se non trovato, cerca nell'API (supporta ancora mal-ID per retrocompatibilità)
    let cancelled = false;
    if (id.startsWith("mal-")) {
      (async () => {
        try {
          const malId = id.replace("mal-", "");
          const res = await fetch(`${JIKAN_BASE}/anime/${malId}/full`);
          const data = await res.json();
          if (!cancelled && data.data) {
            setAnime(mapJikanToAnime(data.data));
          }
        } catch (e) {
          console.error("Failed to fetch anime:", e);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [id]);

  return { anime, loading };
}
