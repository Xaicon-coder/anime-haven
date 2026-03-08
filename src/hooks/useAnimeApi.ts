import { useState, useEffect } from "react";
import type { Anime } from "@/data/animeData";
import { animeList } from "@/data/animeData";

const JIKAN_BASE = "https://api.jikan.moe/v4";
const ANILIST_BASE = "https://graphql.anilist.co";

interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: {
    jpg: { large_image_url: string; image_url: string; original_image_url?: string };
    webp: { large_image_url: string; image_url: string; original_image_url?: string };
  };
  trailer?: {
    youtube_id?: string | null;
    url?: string | null;
    embed_url?: string | null;
    images?: { maximum_image_url?: string; large_image_url?: string };
  };
  synopsis: string | null;
  genres: { name: string }[];
  score: number | null;
  year: number | null;
  aired?: { prop?: { from?: { year?: number } } };
  status: string;
  episodes: number | null;
}

interface AniListMedia {
  idMal: number | null;
  bannerImage: string | null;
  coverImage: { extraLarge: string | null; large: string | null };
  description: string | null;
}

// Cache banner HD da AniList per MAL ID
const bannerCache = new Map<number, { banner: string | null; cover: string | null; description: string | null }>();

// Fetch banner HD da AniList per una lista di MAL IDs
async function fetchAniListBanners(malIds: number[]): Promise<void> {
  // Filter out already cached
  const needed = malIds.filter(id => !bannerCache.has(id));
  if (needed.length === 0) return;

  // AniList permette max ~50 per query, facciamo batch da 25
  const batches: number[][] = [];
  for (let i = 0; i < needed.length; i += 25) {
    batches.push(needed.slice(i, i + 25));
  }

  for (const batch of batches) {
    const query = `
      query ($page: Int, $idMal_in: [Int]) {
        Page(page: $page, perPage: 50) {
          media(type: ANIME, idMal_in: $idMal_in) {
            idMal
            bannerImage
            coverImage {
              extraLarge
              large
            }
            description(asHtml: false)
          }
        }
      }
    `;

    try {
      const res = await fetch(ANILIST_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { page: 1, idMal_in: batch },
        }),
      });
      const data = await res.json();
      const mediaList: AniListMedia[] = data?.data?.Page?.media || [];

      for (const m of mediaList) {
        if (m.idMal) {
          bannerCache.set(m.idMal, {
            banner: m.bannerImage,
            cover: m.coverImage?.extraLarge || m.coverImage?.large || null,
            description: m.description ? m.description.replace(/<[^>]*>/g, '').trim() : null,
          });
        }
      }

      // Mark missing ones as null so we don't re-fetch
      for (const id of batch) {
        if (!bannerCache.has(id)) {
          bannerCache.set(id, { banner: null, cover: null, description: null });
        }
      }
    } catch (e) {
      console.error("AniList banner fetch failed:", e);
      // Mark as attempted
      for (const id of batch) {
        if (!bannerCache.has(id)) {
          bannerCache.set(id, { banner: null, cover: null, description: null });
        }
      }
    }
  }
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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const LOCAL_BASE_TITLES = ["dr. stone", "attack on titan", "demon slayer", "jujutsu kaisen", "one piece", "my hero academia", "spy×family", "spy x family", "chainsaw man", "solo leveling"];

function isLocalAnimeVariant(j: JikanAnime): boolean {
  const apiTitle = (j.title_english || j.title).toLowerCase().trim();
  const apiTitleJp = j.title.toLowerCase().trim();
  return LOCAL_BASE_TITLES.some((base) => {
    return apiTitle === base ||
           apiTitle.startsWith(base + ":") ||
           apiTitle.startsWith(base + " ") ||
           apiTitleJp.startsWith(base);
  });
}

function findLocalMatch(j: JikanAnime): Anime | undefined {
  const apiTitle = (j.title_english || j.title).toLowerCase().trim();
  return animeList.find((a) => a.title.toLowerCase().trim() === apiTitle);
}

function mapJikanToAnime(j: JikanAnime): Anime | null {
  if (isLocalAnimeVariant(j)) return null;

  // Prendi banner/cover HD da AniList cache
  const anilistData = bannerCache.get(j.mal_id);
  const cover = anilistData?.cover || j.images.jpg?.original_image_url || j.images.webp?.large_image_url || j.images.jpg.large_image_url;
  const banner = anilistData?.banner || anilistData?.cover || j.images.jpg?.original_image_url || cover;

  const animeYear = j.year || j.aired?.prop?.from?.year || 2024;
  const episodeCount = j.episodes || 12;
  const slug = generateSlug(j.title_english || j.title);

  const rawSynopsis = j.synopsis?.replace(/\[Written by MAL Rewrite\]/g, "").replace(/\(Source:.*?\)/g, "").trim();
  const description = rawSynopsis || "Descrizione non disponibile.";

  return {
    id: slug,
    title: j.title_english || j.title,
    cover,
    banner,
    description,
    genres: j.genres.map((g) => genreMap[g.name] || g.name),
    rating: j.score || 0,
    year: animeYear,
    status: mapStatus(j.status),
    folderName: j.title_english || j.title,
    seasons: [
      {
        id: "s1",
        number: 1,
        title: "Stagione 1",
        folderName: "Stagione 1",
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

    const q = query.toLowerCase();
    const localResults = animeList.filter((a) =>
      a.title.toLowerCase().includes(q)
    );

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&limit=10&sfw=true`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const jikanList: JikanAnime[] = data.data || [];

        // Fetch banner HD da AniList prima di mappare
        const malIds = jikanList.map(j => j.mal_id);
        await fetchAniListBanners(malIds);

        const apiResults = jikanList.map(mapJikanToAnime).filter((a): a is Anime => a !== null);
        setResults([...localResults, ...deduplicateAnime(apiResults)]);
      } catch (e) {
        if (!(e instanceof DOMException)) console.error(e);
        setResults(localResults);
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
          const jikanList: JikanAnime[] = data.data || [];

          // Fetch banner HD da AniList
          const malIds = jikanList.map(j => j.mal_id);
          await fetchAniListBanners(malIds);

          const mapped = jikanList.map(mapJikanToAnime).filter((a): a is Anime => a !== null);
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
          const jikanList: JikanAnime[] = data.data || [];

          // Fetch banner HD da AniList
          const malIds = jikanList.map(j => j.mal_id);
          await fetchAniListBanners(malIds);

          const mapped = jikanList.map(mapJikanToAnime).filter((a): a is Anime => a !== null);
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
    const local = animeList.find((a) => a.id === id);
    if (local) {
      setAnime(local);
      setLoading(false);
      return;
    }

    let cancelled = false;
    if (id.startsWith("mal-")) {
      (async () => {
        try {
          const malId = id.replace("mal-", "");
          const res = await fetch(`${JIKAN_BASE}/anime/${malId}/full`);
          const data = await res.json();
          if (!cancelled && data.data) {
            // Fetch banner HD da AniList
            await fetchAniListBanners([data.data.mal_id]);
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
