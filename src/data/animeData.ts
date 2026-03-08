import cover1 from "@/assets/anime-cover-1.jpg";
import cover2 from "@/assets/anime-cover-2.jpg";
import cover3 from "@/assets/anime-cover-3.jpg";
import cover4 from "@/assets/anime-cover-4.jpg";
import cover5 from "@/assets/anime-cover-5.jpg";
import cover6 from "@/assets/anime-cover-6.jpg";
import heroBanner from "@/assets/hero-banner-1.jpg";

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
}

export interface Season {
  id: string;
  number: number;
  title: string;
  episodes: Episode[];
}

export interface Anime {
  id: string;
  title: string;
  cover: string;
  banner: string;
  description: string;
  genres: string[];
  rating: number;
  year: number;
  status: string;
  seasons: Season[];
}

const generateEpisodes = (count: number, cover: string): Episode[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `ep-${i + 1}`,
    number: i + 1,
    title: `Episodio ${i + 1}`,
    duration: `${20 + Math.floor(Math.random() * 5)} min`,
    thumbnail: cover,
  }));

export const animeList: Anime[] = [
  {
    id: "blade-of-dawn",
    title: "Blade of Dawn",
    cover: cover1,
    banner: heroBanner,
    description: "Un giovane spadaccino intraprende un viaggio epico attraverso terre mistiche per scoprire il segreto della sua spada leggendaria e proteggere il regno dalla distruzione.",
    genres: ["Azione", "Fantasy", "Avventura"],
    rating: 4.8,
    year: 2024,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "L'inizio del viaggio", episodes: generateEpisodes(12, cover1) },
      { id: "s2", number: 2, title: "Il risveglio", episodes: generateEpisodes(12, cover1) },
    ],
  },
  {
    id: "crimson-flame",
    title: "Crimson Flame",
    cover: cover2,
    banner: heroBanner,
    description: "Una potente maga dal fuoco rosso combatte per liberare la sua città dalle forze oscure che la minacciano, scoprendo poteri ancestrali nascosti nel suo sangue.",
    genres: ["Azione", "Magia", "Drama"],
    rating: 4.6,
    year: 2023,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "La fiamma nascente", episodes: generateEpisodes(24, cover2) },
    ],
  },
  {
    id: "steel-guardian",
    title: "Steel Guardian",
    cover: cover3,
    banner: heroBanner,
    description: "In un futuro distopico, un pilota di mecha combatte per la sopravvivenza dell'umanità contro macchine senzienti che minacciano l'esistenza stessa della civiltà.",
    genres: ["Mecha", "Sci-Fi", "Azione"],
    rating: 4.7,
    year: 2024,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Protocollo Zero", episodes: generateEpisodes(13, cover3) },
    ],
  },
  {
    id: "shadow-requiem",
    title: "Shadow Requiem",
    cover: cover4,
    banner: heroBanner,
    description: "Un assassino misterioso opera nelle ombre della città, districandosi tra intrighi politici e segreti oscuri mentre cerca vendetta per il suo passato.",
    genres: ["Thriller", "Dark Fantasy", "Mistero"],
    rating: 4.9,
    year: 2024,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Ombre nella notte", episodes: generateEpisodes(10, cover4) },
      { id: "s2", number: 2, title: "Il prezzo del sangue", episodes: generateEpisodes(10, cover4) },
      { id: "s3", number: 3, title: "Redenzione", episodes: generateEpisodes(8, cover4) },
    ],
  },
  {
    id: "crystal-seekers",
    title: "Crystal Seekers",
    cover: cover5,
    banner: heroBanner,
    description: "Un gruppo di giovani avventurieri esplora dungeon pieni di cristalli magici, affrontando creature mitiche e stringendo legami indissolubili.",
    genres: ["Avventura", "Fantasy", "Commedia"],
    rating: 4.4,
    year: 2023,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "La prima spedizione", episodes: generateEpisodes(12, cover5) },
      { id: "s2", number: 2, title: "Il cuore del cristallo", episodes: generateEpisodes(12, cover5) },
    ],
  },
  {
    id: "storm-awakening",
    title: "Storm Awakening",
    cover: cover6,
    banner: heroBanner,
    description: "Uno studente delle superiori scopre di possedere poteri soprannaturali incredibili e deve imparare a controllarli prima che sia troppo tardi.",
    genres: ["Supereroi", "Scolastico", "Azione"],
    rating: 4.5,
    year: 2024,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Il risveglio", episodes: generateEpisodes(13, cover6) },
    ],
  },
];

export const featuredAnime = animeList[0];
