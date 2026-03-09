import { useState, useMemo } from "react";
import { Search, X, SlidersHorizontal, Calendar, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import { animeList, type Anime } from "@/data/animeData";
import { useTopAnime, useSeasonalAnime } from "@/hooks/useAnimeApi";

const STATUSES = ["Tutti", "In corso", "Completato"];
const SORT_OPTIONS = [
  { value: "rating", label: "Valutazione" },
  { value: "year", label: "Anno" },
  { value: "title", label: "Titolo A-Z" },
  { value: "popularity", label: "Popolarità" },
];

const SEASONS = ["Tutti", "Inverno", "Primavera", "Estate", "Autunno"];

// Genera anni disponibili
function getAvailableYears(animeArr: Anime[]): number[] {
  const years = new Set(animeArr.map(a => a.year));
  return Array.from(years).sort((a, b) => b - a);
}

// Determina la stagione di un anime in base al mese di uscita (approssimazione per anno)
function getAnimeSeason(year: number): string {
  // Senza dati precisi sul mese, usiamo l'anno come riferimento
  // In futuro si può mappare con dati API più precisi
  return "Tutti";
}

const ExplorePage = () => {
  const { anime: topAnime } = useTopAnime();
  const { anime: seasonalAnime } = useSeasonalAnime();

  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [status, setStatus] = useState("Tutti");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState("Tutti");
  const [ratingMin, setRatingMin] = useState(0);

  // Merge local + API anime, dedup by id
  const allAnime = useMemo(() => {
    const map = new Map<string, Anime>();
    for (const a of animeList) map.set(a.id, a);
    for (const a of topAnime) if (!map.has(a.id)) map.set(a.id, a);
    for (const a of seasonalAnime) if (!map.has(a.id)) map.set(a.id, a);
    return Array.from(map.values());
  }, [topAnime, seasonalAnime]);

  const allGenres = useMemo(() => {
    return Array.from(new Set(allAnime.flatMap((a) => a.genres))).sort();
  }, [allAnime]);

  const availableYears = useMemo(() => getAvailableYears(allAnime), [allAnime]);

  const filtered = useMemo(() => {
    let result = allAnime;

    // Search
    if (query.length >= 2) {
      const q = query.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q));
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      result = result.filter((a) =>
        selectedGenres.every((g) => a.genres.includes(g))
      );
    }

    // Status filter
    if (status !== "Tutti") {
      result = result.filter((a) => a.status === status);
    }

    // Year filter
    if (selectedYear !== null) {
      result = result.filter((a) => a.year === selectedYear);
    }

    // Rating filter
    if (ratingMin > 0) {
      result = result.filter((a) => a.rating >= ratingMin);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "year") return b.year - a.year;
      if (sortBy === "popularity") return b.rating - a.rating; // proxy
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [allAnime, query, selectedGenres, status, sortBy, selectedYear, ratingMin]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setStatus("Tutti");
    setSortBy("rating");
    setQuery("");
    setSelectedYear(null);
    setSelectedSeason("Tutti");
    setRatingMin(0);
  };

  const activeFilterCount =
    selectedGenres.length +
    (status !== "Tutti" ? 1 : 0) +
    (selectedYear !== null ? 1 : 0) +
    (ratingMin > 0 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0 || query.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
            Esplora
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Scopri il catalogo completo di anime
          </p>
        </div>

        {/* Search + Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca anime..."
              className="w-full bg-secondary text-foreground text-sm px-10 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              showFilters || hasActiveFilters
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-secondary text-secondary-foreground border border-border hover:border-primary/20"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filtri
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="gradient-card rounded-xl border border-border p-4 sm:p-5 mb-6 animate-fade-in">
            {/* Genres */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Generi</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`text-xs px-3 py-1 rounded-full transition-all ${
                      selectedGenres.includes(genre)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Year filter */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar size={12} /> Anno
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={() => setSelectedYear(null)}
                  className={`text-xs px-3 py-1 rounded-full transition-all ${
                    selectedYear === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tutti
                </button>
                {availableYears.slice(0, 12).map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year === selectedYear ? null : year)}
                    className={`text-xs px-3 py-1 rounded-full transition-all ${
                      selectedYear === year
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating filter */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp size={12} /> Valutazione minima
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[0, 7, 7.5, 8, 8.5, 9].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setRatingMin(rating === ratingMin ? 0 : rating)}
                    className={`text-xs px-3 py-1 rounded-full transition-all ${
                      ratingMin === rating
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {rating === 0 ? "Tutti" : `≥ ${rating}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Stato</h3>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`text-xs px-3 py-1 rounded-full transition-all ${
                      status === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ordina per</h3>
              <div className="flex gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`text-xs px-3 py-1 rounded-full transition-all ${
                      sortBy === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
              >
                <X size={12} /> Rimuovi filtri
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} anime trovati
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Nessun anime trovato con questi filtri</p>
            <button onClick={clearFilters} className="text-primary text-sm mt-2 hover:underline">
              Rimuovi filtri
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-4">
            {filtered.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
