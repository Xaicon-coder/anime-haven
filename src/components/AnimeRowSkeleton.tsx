import type { LucideIcon } from "lucide-react";

interface AnimeRowSkeletonProps {
  title: string;
  icon?: LucideIcon;
}

const AnimeRowSkeleton = ({ title, icon: Icon }: AnimeRowSkeletonProps) => {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="flex items-center gap-2 mb-3 sm:mb-4 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
        {Icon && <Icon size={20} className="text-primary" />}
        <h2 className="text-base sm:text-lg lg:text-xl font-display font-bold text-foreground">{title}</h2>
      </div>
      <div className="flex gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[210px]">
            <div className="aspect-[2/3] rounded-lg bg-secondary animate-pulse mb-2" />
            <div className="h-3 sm:h-4 bg-secondary rounded animate-pulse mb-1 w-3/4" />
            <div className="h-2.5 sm:h-3 bg-secondary rounded animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimeRowSkeleton;
