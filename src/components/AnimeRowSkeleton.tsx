const AnimeRowSkeleton = ({ title }: { title: string }) => {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <h2 className="text-lg sm:text-xl font-display font-bold text-foreground">{title}</h2>
      </div>
      <div className="flex gap-4 px-4 sm:px-6 max-w-[1400px] mx-auto">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[160px] sm:w-[200px]">
            <div className="aspect-[3/4] rounded-lg bg-secondary animate-pulse mb-2" />
            <div className="h-4 bg-secondary rounded animate-pulse mb-1 w-3/4" />
            <div className="h-3 bg-secondary rounded animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimeRowSkeleton;
