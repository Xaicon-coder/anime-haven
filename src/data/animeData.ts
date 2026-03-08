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

const generateEpisodes = (count: number, thumbnail: string): Episode[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `ep-${i + 1}`,
    number: i + 1,
    title: `Episodio ${i + 1}`,
    duration: `${20 + Math.floor(Math.random() * 5)} min`,
    thumbnail,
  }));

// Real anime data with official images from MyAnimeList CDN
export const animeList: Anime[] = [
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    cover: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire2/abf1fa6637035ef511cf8050e54d62181652729022_main.jpg",
    description: "Secoli fa, l'umanità fu massacrata fino quasi all'estinzione da mostri enormi e terrificanti con una forma vagamente umana chiamati Titani. I pochi sopravvissuti si rifugiarono dietro tre enormi mura concentriche. Ora, la pace è minacciata quando un Titano Colossale appare e distrugge il muro esterno.",
    genres: ["Azione", "Dark Fantasy", "Post-apocalittico"],
    rating: 9.0,
    year: 2013,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/10/47347.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/10/47347.jpg") },
      { id: "s3", number: 3, title: "Stagione 3", episodes: generateEpisodes(22, "https://cdn.myanimelist.net/images/anime/10/47347.jpg") },
      { id: "s4", number: 4, title: "Stagione Finale", episodes: generateEpisodes(16, "https://cdn.myanimelist.net/images/anime/10/47347.jpg") },
    ],
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer: Kimetsu no Yaiba",
    cover: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire3/f2bc72cb7ce020dc8c40110cfba1a5a81656420494_main.jpg",
    description: "Sin dai tempi antichi circolano voci su demoni mangiauomini che si nascondono nel bosco. Per questo motivo la gente del posto non esce mai di notte. Si dice anche che un demone uccida chiunque si avventuri nel bosco. Tanjiro è un giovane carbonaio dalla gentilezza innata.",
    genres: ["Azione", "Fantasy", "Soprannaturale"],
    rating: 8.6,
    year: 2019,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(26, "https://cdn.myanimelist.net/images/anime/1286/99889.jpg") },
      { id: "s2", number: 2, title: "Distretto a luci rosse", episodes: generateEpisodes(11, "https://cdn.myanimelist.net/images/anime/1286/99889.jpg") },
      { id: "s3", number: 3, title: "Villaggio dei Fabbri", episodes: generateEpisodes(11, "https://cdn.myanimelist.net/images/anime/1286/99889.jpg") },
    ],
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    cover: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire1/2c42070c0a93b1ca5f8ade932b4d81d51603391446_main.jpg",
    description: "Yuji Itadori è uno studente con abilità fisiche straordinarie. Un giorno, per salvare un compagno attaccato da una Maledizione, ingoia un dito di Ryomen Sukuna, il Re delle Maledizioni, diventando il suo recipiente. Da quel momento entra nel mondo degli stregoni.",
    genres: ["Azione", "Soprannaturale", "Scolastico"],
    rating: 8.7,
    year: 2020,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(24, "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", episodes: generateEpisodes(23, "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg") },
    ],
  },
  {
    id: "one-piece",
    title: "One Piece",
    cover: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire3/21af72e84d1c9e993c0f30da6c7955ad1648159498_main.jpg",
    description: "Gol D. Roger era noto come il Re dei Pirati, l'essere più forte e famoso ad aver navigato la Grand Line. La cattura e l'esecuzione di Roger da parte della Marina Mondiale ha portato un cambiamento nel mondo. Le sue ultime parole prima della morte hanno rivelato l'esistenza del più grande tesoro del mondo, il One Piece.",
    genres: ["Azione", "Avventura", "Commedia"],
    rating: 8.7,
    year: 1999,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "East Blue", episodes: generateEpisodes(61, "https://cdn.myanimelist.net/images/anime/6/73245l.jpg") },
      { id: "s2", number: 2, title: "Alabasta", episodes: generateEpisodes(73, "https://cdn.myanimelist.net/images/anime/6/73245l.jpg") },
    ],
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    cover: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire1/2feff504543798a34bb91da2f7f2fb721649277048_main.jpg",
    description: "In un mondo dove l'80% della popolazione possiede superpoteri chiamati 'Quirk', Izuku Midoriya nasce senza poteri. Ma il suo sogno di diventare un eroe non muore mai, specialmente dopo aver incontrato il più grande eroe di tutti, All Might.",
    genres: ["Azione", "Supereroi", "Scolastico"],
    rating: 8.4,
    year: 2016,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(13, "https://cdn.myanimelist.net/images/anime/10/78745l.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/10/78745l.jpg") },
      { id: "s3", number: 3, title: "Stagione 3", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/10/78745l.jpg") },
    ],
  },
  {
    id: "spy-x-family",
    title: "SPY×FAMILY",
    cover: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire2/70f3bfadd5f1483bce2b2c218b14df521648768228_main.jpg",
    description: "La spia di classe mondiale nota come 'Twilight' riceve il compito di indagare su un pericoloso politico. Per avvicinarsi al suo obiettivo, deve costruire una famiglia copertura. Ignaro di tutti, la figlia che adotta sa leggere la mente e sua moglie è un'assassina.",
    genres: ["Azione", "Commedia", "Famiglia"],
    rating: 8.6,
    year: 2022,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/1441/122795l.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1441/122795l.jpg") },
    ],
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    cover: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire3/d11e8adfd6b68f5f3faa75a206dbb14b1656596825_main.jpg",
    description: "Denji è un ragazzo che vive in povertà, costretto a lavorare come cacciatore di demoni per ripagare i debiti del padre defunto. La sua unica compagnia è Pochita, un demone motosega. Quando Denji viene ucciso, Pochita si fonde con lui, trasformandolo nel Chainsaw Man.",
    genres: ["Azione", "Dark Fantasy", "Horror"],
    rating: 8.5,
    year: 2022,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1806/126216l.jpg") },
    ],
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    cover: "https://cdn.myanimelist.net/images/anime/1808/141625.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire4/a8b09a5b8de1b3de73a9e3de1c6ae7041705599642_main.jpg",
    description: "In un mondo dove i cacciatori - umani con poteri magici - devono combattere mortali mostri per proteggere la razza umana, Sung Jinwoo è il cacciatore più debole di tutti, noto come 'il cacciatore più debole dell'umanità'. Un giorno, dopo una missione quasi fatale, riceve un misterioso programma chiamato 'Sistema'.",
    genres: ["Azione", "Fantasy", "Avventura"],
    rating: 8.3,
    year: 2024,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1808/141625l.jpg") },
    ],
  },
];

export const featuredAnime = animeList[3]; // One Piece as featured

export const popularAnime = animeList.slice(0, 6);
export const topRatedAnime = [...animeList].sort((a, b) => b.rating - a.rating);
export const recentAnime = [...animeList].filter(a => a.year >= 2022);
