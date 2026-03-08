import { useState, useEffect } from "react";
import type { Anime } from "@/data/animeData";

const JIKAN_BASE = "https://api.jikan.moe/v4";

interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: {
    jpg: { large_image_url: string; image_url: string };
    webp: { large_image_url: string; image_url: string };
  };
  trailer?: { images?: { maximum_image_url?: string } };
  synopsis: string | null;
  genres: { name: string }[];
  score: number | null;
  year: number | null;
  aired?: { prop?: { from?: { year?: number } } };
  status: string;
  episodes: number | null;
}

function mapStatus(status: string): string {
  if (status === "Currently Airing") return "In corso";
  if (status === "Finished Airing") return "Completato";
  return status;
}

function mapJikanToAnime(j: JikanAnime): Anime {
  const cover = j.images.webp?.large_image_url || j.images.jpg.large_image_url;
  const banner = j.trailer?.images?.maximum_image_url || cover;
  const animeYear = j.year || j.aired?.prop?.from?.year || 2024;
  const episodeCount = j.episodes || 12;

  return {
    id: `mal-${j.mal_id}`,
    title: j.title_english || j.title,
    cover,
    banner,
    description: j.synopsis?.replace(/\[Written by MAL Rewrite\]/g, "").trim() || "Nessuna descrizione disponibile.",
    genres: j.genres.map((g) => g.name),
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
          setAnime((data.data || []).map(mapJikanToAnime));
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
          setAnime((data.data || []).map(mapJikanToAnime));
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

export function useAnimeById(malId: string) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = malId.replace("mal-", "");
        const res = await fetch(`${JIKAN_BASE}/anime/${id}/full`);
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
    return () => { cancelled = true; };
  }, [malId]);

  return { anime, loading };
}
