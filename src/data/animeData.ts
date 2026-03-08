export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
  fileName?: string; // Nome del file reale, es: "DrStone4_Ep_01_ITA.mp4"
}

export interface Season {
  id: string;
  number: number;
  title: string;
  folderName: string; // Nome reale della cartella stagione
  episodes: Episode[];
  filePrefix?: string; // Prefisso file, es: "DrStone4_Ep_" 
  fileSuffix?: string; // Suffisso file, es: "_ITA"
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
  folderName: string; // Nome reale della cartella anime in /DATA/AppData/anime/
  seasons: Season[];
}

// Genera episodi con nome file automatico basato su prefisso/suffisso
const generateEpisodes = (
  count: number, 
  thumbnail: string,
  filePrefix?: string,
  fileSuffix?: string
): Episode[] =>
  Array.from({ length: count }, (_, i) => {
    const epNum = String(i + 1).padStart(2, "0");
    const fileName = filePrefix 
      ? `${filePrefix}${epNum}${fileSuffix || ""}.mp4`
      : `episodio-${i + 1}.mp4`;
    return {
      id: `ep-${i + 1}`,
      number: i + 1,
      title: `Episodio ${i + 1}`,
      duration: `${20 + Math.floor(Math.random() * 5)} min`,
      thumbnail,
      fileName,
    };
  });

export const animeList: Anime[] = [
  {
    id: "dr-stone",
    title: "Dr. Stone",
    folderName: "Dr. Stone ITA",
    cover: "https://cdn.myanimelist.net/images/anime/1613/102576.jpg",
    banner: "https://cdn.myanimelist.net/images/anime/1613/102576.jpg",
    description: "Una luce misteriosa pietrifica istantaneamente tutta l'umanità. Migliaia di anni dopo, il genio della scienza Senku Ishigami si risveglia in un mondo tornato all'età della pietra. Con la sua incredibile conoscenza scientifica, Senku decide di ricostruire la civiltà da zero, partendo dalle basi della chimica e della fisica.",
    genres: ["Avventura", "Sci-Fi", "Commedia"],
    rating: 8.3,
    year: 2019,
    status: "Completato",
    seasons: [
      { 
        id: "s1", number: 1, title: "Stagione 1 - Stone World", 
        folderName: "Dr. STONE",
        filePrefix: "DrStone_Ep_", fileSuffix: "_ITA",
        episodes: generateEpisodes(24, "https://cdn.myanimelist.net/images/anime/1613/102576.jpg", "DrStone_Ep_", "_ITA") 
      },
      { 
        id: "s2", number: 2, title: "Stagione 2 - Stone Wars", 
        folderName: "Dr. STONE STONE WARS",
        filePrefix: "DrStone2_Ep_", fileSuffix: "_ITA",
        episodes: generateEpisodes(11, "https://cdn.myanimelist.net/images/anime/1952/116521.jpg", "DrStone2_Ep_", "_ITA") 
      },
      { 
        id: "s3", number: 3, title: "Stagione 3 - New World", 
        folderName: "Dr. STONE NEW WORLD",
        filePrefix: "DrStone3_Ep_", fileSuffix: "_ITA",
        episodes: generateEpisodes(22, "https://cdn.myanimelist.net/images/anime/1236/138696.jpg", "DrStone3_Ep_", "_ITA") 
      },
      { 
        id: "s4", number: 4, title: "Stagione 4 - Science Future Parte 1", 
        folderName: "Dr. STONE SCIENCE FUTURE",
        filePrefix: "DrStone4_Ep_", fileSuffix: "_ITA",
        episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1006/145704.jpg", "DrStone4_Ep_", "_ITA") 
      },
      { 
        id: "s5", number: 5, title: "Stagione 4 - Science Future Parte 2", 
        folderName: "Dr. STONE SCIENCE FUTURE parte 2",
        filePrefix: "DrStone4P2_Ep_", fileSuffix: "_ITA",
        episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1006/145704.jpg", "DrStone4P2_Ep_", "_ITA") 
      },
      { 
        id: "s6", number: 6, title: "Stagione 4 - Science Future Parte 3", 
        folderName: "Dr. STONE SCIENCE FUTURE parte 3",
        filePrefix: "DrStone4P3_Ep_", fileSuffix: "_ITA",
        episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1006/145704.jpg", "DrStone4P3_Ep_", "_ITA") 
      },
    ],
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    folderName: "Attack on Titan ITA",
    cover: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire2/abf1fa6637035ef511cf8050e54d62181652729022_main.jpg",
    description: "Secoli fa, l'umanità fu massacrata fino quasi all'estinzione da mostri enormi e terrificanti con una forma vagamente umana chiamati Titani. I pochi sopravvissuti si rifugiarono dietro tre enormi mura concentriche. Ora, la pace è minacciata quando un Titano Colossale appare e distrugge il muro esterno.",
    genres: ["Azione", "Dark Fantasy", "Post-apocalittico"],
    rating: 9.0,
    year: 2013,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", folderName: "Stagione 1", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/10/47347.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", folderName: "Stagione 2", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/10/47347.jpg") },
      { id: "s3", number: 3, title: "Stagione 3", folderName: "Stagione 3", episodes: generateEpisodes(22, "https://cdn.myanimelist.net/images/anime/10/47347.jpg") },
      { id: "s4", number: 4, title: "Stagione Finale", folderName: "Stagione 4", episodes: generateEpisodes(16, "https://cdn.myanimelist.net/images/anime/10/47347.jpg") },
    ],
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer: Kimetsu no Yaiba",
    folderName: "Demon Slayer ITA",
    cover: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire3/f2bc72cb7ce020dc8c40110cfba1a5a81656420494_main.jpg",
    description: "Sin dai tempi antichi circolano voci su demoni mangiauomini che si nascondono nel bosco. Tanjiro è un giovane carbonaio dalla gentilezza innata che un giorno trova la sua famiglia massacrata da un demone. L'unica sopravvissuta è sua sorella Nezuko, trasformata in un demone. Così inizia il suo viaggio per trovare una cura e vendicare la sua famiglia.",
    genres: ["Azione", "Fantasy", "Soprannaturale"],
    rating: 8.6,
    year: 2019,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", folderName: "Stagione 1", episodes: generateEpisodes(26, "https://cdn.myanimelist.net/images/anime/1286/99889.jpg") },
      { id: "s2", number: 2, title: "Distretto a Luci Rosse", folderName: "Distretto a Luci Rosse", episodes: generateEpisodes(11, "https://cdn.myanimelist.net/images/anime/1286/99889.jpg") },
      { id: "s3", number: 3, title: "Villaggio dei Fabbri", folderName: "Villaggio dei Fabbri", episodes: generateEpisodes(11, "https://cdn.myanimelist.net/images/anime/1286/99889.jpg") },
    ],
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    folderName: "Jujutsu Kaisen ITA",
    cover: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire1/2c42070c0a93b1ca5f8ade932b4d81d51603391446_main.jpg",
    description: "Yuji Itadori è uno studente con abilità fisiche straordinarie. Un giorno, per salvare un compagno attaccato da una Maledizione, ingoia un dito di Ryomen Sukuna, il Re delle Maledizioni, diventando il suo recipiente. Da quel momento entra nel mondo degli stregoni e deve affrontare maledizioni terrificanti.",
    genres: ["Azione", "Soprannaturale", "Scolastico"],
    rating: 8.7,
    year: 2020,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", folderName: "Stagione 1", episodes: generateEpisodes(24, "https://cdn.myanimelist.net/images/anime/1171/109222.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", folderName: "Stagione 2", episodes: generateEpisodes(23, "https://cdn.myanimelist.net/images/anime/1171/109222.jpg") },
    ],
  },
  {
    id: "one-piece",
    title: "One Piece",
    folderName: "One Piece ITA",
    cover: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire3/21af72e84d1c9e993c0f30da6c7955ad1648159498_main.jpg",
    description: "Gol D. Roger era noto come il Re dei Pirati. Le sue ultime parole prima della morte hanno rivelato l'esistenza del più grande tesoro del mondo, il One Piece. Il giovane Monkey D. Luffy parte per trovare il leggendario tesoro e diventare il nuovo Re dei Pirati.",
    genres: ["Azione", "Avventura", "Commedia"],
    rating: 8.7,
    year: 1999,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "East Blue", folderName: "East Blue", episodes: generateEpisodes(61, "https://cdn.myanimelist.net/images/anime/6/73245.jpg") },
      { id: "s2", number: 2, title: "Alabasta", folderName: "Alabasta", episodes: generateEpisodes(73, "https://cdn.myanimelist.net/images/anime/6/73245.jpg") },
    ],
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    folderName: "My Hero Academia ITA",
    cover: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire1/2feff504543798a34bb91da2f7f2fb721649277048_main.jpg",
    description: "In un mondo dove l'80% della popolazione possiede superpoteri chiamati 'Quirk', Izuku Midoriya nasce senza alcun potere. Ma il suo sogno di diventare un eroe non muore mai, specialmente dopo aver incontrato il più grande eroe di tutti, All Might.",
    genres: ["Azione", "Supereroi", "Scolastico"],
    rating: 8.4,
    year: 2016,
    status: "Completato",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", folderName: "Stagione 1", episodes: generateEpisodes(13, "https://cdn.myanimelist.net/images/anime/10/78745.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", folderName: "Stagione 2", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/10/78745.jpg") },
      { id: "s3", number: 3, title: "Stagione 3", folderName: "Stagione 3", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/10/78745.jpg") },
    ],
  },
  {
    id: "spy-x-family",
    title: "SPY×FAMILY",
    folderName: "Spy x Family ITA",
    cover: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire2/70f3bfadd5f1483bce2b2c218b14df521648768228_main.jpg",
    description: "La spia di classe mondiale 'Twilight' deve costruire una famiglia copertura per una missione. Senza saperlo, la figlia che adotta sa leggere la mente e sua moglie è un'assassina professionista. Insieme formano una famiglia tanto disfunzionale quanto esilarante.",
    genres: ["Azione", "Commedia", "Famiglia"],
    rating: 8.6,
    year: 2022,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", folderName: "Stagione 1", episodes: generateEpisodes(25, "https://cdn.myanimelist.net/images/anime/1441/122795.jpg") },
      { id: "s2", number: 2, title: "Stagione 2", folderName: "Stagione 2", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1441/122795.jpg") },
    ],
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    folderName: "Chainsaw Man ITA",
    cover: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire3/d11e8adfd6b68f5f3faa75a206dbb14b1656596825_main.jpg",
    description: "Denji è un ragazzo in estrema povertà, costretto a cacciare demoni per ripagare i debiti del padre. La sua unica compagnia è Pochita, un demone motosega. Quando viene ucciso e tradito, Pochita si fonde con lui, trasformandolo nel temibile Chainsaw Man.",
    genres: ["Azione", "Dark Fantasy", "Horror"],
    rating: 8.5,
    year: 2022,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", folderName: "Stagione 1", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1806/126216.jpg") },
    ],
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    folderName: "Solo Leveling ITA",
    cover: "https://cdn.myanimelist.net/images/anime/1808/141625.jpg",
    banner: "https://img1.ak.crunchyroll.com/i/spire4/a8b09a5b8de1b3de73a9e3de1c6ae7041705599642_main.jpg",
    description: "In un mondo dove i cacciatori con poteri magici combattono mostri mortali, Sung Jinwoo è il più debole di tutti. Dopo una missione quasi fatale, riceve il 'Sistema', un potere unico che gli permette di salire di livello come in un videogioco.",
    genres: ["Azione", "Fantasy", "Avventura"],
    rating: 8.3,
    year: 2024,
    status: "In corso",
    seasons: [
      { id: "s1", number: 1, title: "Stagione 1", folderName: "Stagione 1", episodes: generateEpisodes(12, "https://cdn.myanimelist.net/images/anime/1808/141625.jpg") },
    ],
  },
];

export const featuredAnime = animeList[1]; // Attack on Titan as featured

export const popularAnime = animeList.slice(0, 6);
export const topRatedAnime = [...animeList].sort((a, b) => b.rating - a.rating);
export const recentAnime = [...animeList].filter(a => a.year >= 2022);

// Helper: costruisce il percorso video per un episodio
export function getVideoPath(anime: Anime, season: Season, episode: Episode): string {
  const fileName = episode.fileName || `episodio-${episode.number}.mp4`;
  return `/anime/${encodeURIComponent(anime.folderName)}/${encodeURIComponent(season.folderName)}/${encodeURIComponent(fileName)}`;
}
