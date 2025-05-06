import { useRef } from 'react';
import MovieCard from './MovieCard';
import { Movie, TvShow } from '@/lib/tmdb';

interface ContentRowProps {
  title: string;
  items: (Movie | TvShow)[];
  isLoading?: boolean;
  type?: 'movie' | 'tv';
  showProgress?: boolean;
  isTop10?: boolean;
}

const ContentRow = ({ 
  title, 
  items, 
  isLoading = false, 
  type = 'movie',
  showProgress = false,
  isTop10 = false
}: ContentRowProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Handle loading state
  if (isLoading) {
    return (
      <section className="netflix-row mb-8">
        <h2 className="netflix-row-title">{title}</h2>
        <div className="relative group">
          <div className="carousel flex space-x-2 overflow-x-auto pl-4 pr-4 pb-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="flex-none w-[160px] sm:w-[180px] md:w-[200px] relative rounded overflow-hidden bg-netflix-dark-gray animate-pulse"
                style={{ aspectRatio: '2/3' }}
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="netflix-row mb-8">
      <h2 className="netflix-row-title">{title}</h2>
      <div className="relative group">
        <div 
          ref={sliderRef} 
          className="carousel flex flex-wrap gap-4 pl-4 pr-4 pb-4"
        >
          {items.map((item, index) => (
            <MovieCard 
              key={item.id} 
              item={item} 
              showProgress={showProgress}
              type={type}
              isTop10={isTop10}
              index={isTop10 ? index : undefined}
            />
          ))}
        </div>
        
        {/* Left Control */}
        {showLeftArrow && (
          <button 
            className="absolute top-0 bottom-4 left-0 w-16 bg-black bg-opacity-50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <FaChevronLeft className="text-white text-3xl" />
          </button>
        )}
        
        {/* Right Control */}
        {showRightArrow && (
          <button 
            className="absolute top-0 bottom-4 right-0 w-16 bg-black bg-opacity-50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <FaChevronRight className="text-white text-3xl" />
          </button>
        )}
      </div>
    </section>
  );
};

export default ContentRow;
