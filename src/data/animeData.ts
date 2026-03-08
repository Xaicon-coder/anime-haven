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
    description: "Sin dai tempi antichi circolano voci su demoni mangiauomini che si nascondono nel bosco. Per questo motivo la gente del posto non esce mai di notte. Tanjiro è un giovane carbonaio dalla gentilezza innata che un giorno trova la sua famiglia massacrata da un demone. L'unica sopravvissuta è sua sorella Nezuko, trasformata in un demone. Così inizia il suo viaggio per trovare una cura e vendicare la sua famiglia.",
    genres: ["Azione", "Fantasy", "Soprannaturale"],
    rating: 8.6,
    year: 2019,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(26, "https://cdn.myanimelist.net/images/anime/1286/99889.jpg") },
      { id: "s2", number: 2, title: "Distretto a Luci Rosse", episodes: generateEpisodes(11, "https://cdn.myanimelist.net/images/anime/1286/99889.jpg") },
      { id: "s3", number: 3, title: "Villaggio dei Fabbri", episodes: generateEpisodes(11, "https://cdn.myanimelist.net/images/anime/1286/99889.jpg") },
    ],
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    cover: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire1/2c42070c0a93b1ca5f8ade932b4d81d51603391446_main.jpg",
    description: "Yuji Itadori è uno studente con abilità fisiche straordinarie. Un giorno, per salvare un compagno attaccato da una Maledizione, ingoia un dito di Ryomen Sukuna, il Re delle Maledizioni, diventando il suo recipiente. Da quel momento entra nel mondo degli stregoni e deve affrontare maledizioni terrificanti mentre cerca di raccogliere tutti i frammenti di Sukuna.",
    genres: ["Azione", "Soprannaturale", "Scolastico"],
    rating: 8.7,
    year: 2020,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(24, "https://cdn.myanimelist.net/images/anime/1171/109222.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", episodes: generateEpisodes(23, "https://cdn.myanimelist.net/images/anime/1171/109222.jpg") },
    ],
  },
  {
    id: "one-piece",
    title: "One Piece",
    cover: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire3/21af72e84d1c9e993c0f30da6c7955ad1648159498_main.jpg",
    description: "Gol D. Roger era noto come il Re dei Pirati, l'essere più forte e famoso ad aver navigato la Grand Line. Le sue ultime parole prima della morte hanno rivelato l'esistenza del più grande tesoro del mondo, il One Piece. Da quel momento, una nuova era di pirati ha avuto inizio, e il giovane Monkey D. Luffy parte per trovare il leggendario tesoro e diventare il nuovo Re dei Pirati.",
    genres: ["Azione", "Avventura", "Commedia"],
    rating: 8.7,
    year: 1999,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "East Blue", episodes: generateEpisodes(61, "https://cdn.myanimelist.net/images/anime/6/73245.jpg") },
      { id: "s2", number: 2, title: "Alabasta", episodes: generateEpisodes(73, "https://cdn.myanimelist.net/images/anime/6/73245.jpg") },
    ],
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    cover: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire1/2feff504543798a34bb91da2f7f2fb721649277048_main.jpg",
    description: "In un mondo dove l'80% della popolazione possiede superpoteri chiamati 'Quirk', Izuku Midoriya nasce senza alcun potere. Ma il suo sogno di diventare un eroe non muore mai, specialmente dopo aver incontrato il più grande eroe di tutti, All Might, che vede in lui il potenziale per ereditare il suo Quirk leggendario.",
    genres: ["Azione", "Supereroi", "Scolastico"],
    rating: 8.4,
    year: 2016,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(13, "https://cdn.myanimelist.net/images/anime/10/78745.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/10/78745.jpg") },
      { id: "s3", number: 3, title: "Stagione 3", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/10/78745.jpg") },
    ],
  },
  {
    id: "spy-x-family",
    title: "SPY×FAMILY",
    cover: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire2/70f3bfadd5f1483bce2b2c218b14df521648768228_main.jpg",
    description: "La spia di classe mondiale nota come 'Twilight' riceve il compito di indagare su un pericoloso politico. Per avvicinarsi al suo obiettivo, deve costruire una famiglia copertura. Senza saperlo, la figlia che adotta sa leggere la mente e sua moglie è un'assassina professionista. Insieme formano una famiglia tanto disfunzionale quanto esilarante.",
    genres: ["Azione", "Commedia", "Famiglia"],
    rating: 8.6,
    year: 2022,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/1441/122795.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1441/122795.jpg") },
    ],
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    cover: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire3/d11e8adfd6b68f5f3faa75a206dbb14b1656596825_main.jpg",
    description: "Denji è un ragazzo che vive in estrema povertà, costretto a lavorare come cacciatore di demoni per ripagare i debiti del padre defunto. La sua unica compagnia è Pochita, un demone motosega. Quando Denji viene ucciso e tradito, Pochita si fonde con lui, trasformandolo nel temibile Chainsaw Man, metà umano e metà demone.",
    genres: ["Azione", "Dark Fantasy", "Horror"],
    rating: 8.5,
    year: 2022,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1806/126216.jpg") },
    ],
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    cover: "https://cdn.myanimelist.net/images/anime/1808/141625.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire4/a8b09a5b8de1b3de73a9e3de1c6ae7041705599642_main.jpg",
    description: "In un mondo dove i cacciatori, umani con poteri magici, devono combattere mortali mostri per proteggere l'umanità, Sung Jinwoo è il cacciatore più debole di tutti. Un giorno, dopo una missione quasi fatale in un dungeon misterioso, riceve un potere unico: il 'Sistema', che gli permette di salire di livello come in un videogioco, diventando sempre più forte.",
    genres: ["Azione", "Fantasy", "Avventura"],
    rating: 8.3,
    year: 2024,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1808/141625.jpg") },
    ],
  },
  {
    id: "dr-stone",
    title: "Dr. Stone",
    cover: "https://cdn.myanimelist.net/images/anime/1613/102576.jpg",
    banner: "https://cdn.myanimelist.net/images/anime/1613/102576.jpg",
    description: "Una luce misteriosa pietrifica istantaneamente tutta l'umanità. Migliaia di anni dopo, il genio della scienza Senku Ishigami si risveglia in un mondo tornato all'età della pietra. Con la sua incredibile conoscenza scientifica, Senku decide di ricostruire la civiltà da zero, partendo dalle basi della chimica e della fisica.",
    genres: ["Avventura", "Sci-Fi", "Commedia"],
    rating: 8.3,
    year: 2019,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", episodes: generateEpisodes(24, "https://cdn.myanimelist.net/images/anime/1613/102576.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", episodes: generateEpisodes(11, "https://cdn.myanimelist.net/images/anime/1613/102576.jpg") },
      { id: "s3", number: 3, title: "Stagione 3", episodes: generateEpisodes(22, "https://cdn.myanimelist.net/images/anime/1613/102576.jpg") },
      { id: "s4", number: 4, title: "Stagione 4", episodes: generateEpisodes(10, "https://cdn.myanimelist.net/images/anime/1613/102576.jpg") },
    ],
  },
];

export const featuredAnime = animeList[3]; // One Piece as featured

export const popularAnime = animeList.slice(0, 6);
export const topRatedAnime = [...animeList].sort((a, b) => b.rating - a.rating);
export const recentAnime = [...animeList].filter(a => a.year >= 2022);
