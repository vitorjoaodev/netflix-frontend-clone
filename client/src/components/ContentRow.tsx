import { useState, useRef } from 'react';
import MovieCard from './MovieCard';
import { Movie, TvShow } from '@/lib/tmdb';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ContentRowProps {
  title: string;
  items: (Movie | TvShow)[];
  isLoading?: boolean;
  type?: 'movie' | 'tv';
  showProgress?: boolean;
}

const ContentRow = ({ 
  title, 
  items, 
  isLoading = false, 
  type = 'movie',
  showProgress = false 
}: ContentRowProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, clientWidth } = sliderRef.current;
    const scrollTo = direction === 'left' 
      ? scrollLeft - clientWidth * 0.75
      : scrollLeft + clientWidth * 0.75;
    
    sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <section className="content-row mb-8 px-4">
        <h2 className="text-lg md:text-xl font-bold mb-2">{title}</h2>
        <div className="relative group">
          <div className="carousel flex space-x-2 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="flex-none w-[160px] sm:w-[180px] md:w-[200px] relative rounded overflow-hidden bg-gray-800 animate-pulse"
                style={{ aspectRatio: '2/3' }}
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="content-row mb-8 px-4">
      <h2 className="text-lg md:text-xl font-bold mb-2">{title}</h2>
      <div className="relative group">
        <div 
          ref={sliderRef} 
          className="carousel flex space-x-2 overflow-x-auto pb-4"
          onScroll={handleScroll}
        >
          {items.map((item) => (
            <MovieCard 
              key={item.id} 
              item={item} 
              showProgress={showProgress}
              type={type}
            />
          ))}
        </div>
        
        {/* Left Control */}
        {showLeftArrow && (
          <button 
            className="absolute top-0 bottom-4 left-0 w-12 bg-black bg-opacity-50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <FaChevronLeft className="text-white text-2xl" />
          </button>
        )}
        
        {/* Right Control */}
        {showRightArrow && (
          <button 
            className="absolute top-0 bottom-4 right-0 w-12 bg-black bg-opacity-50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <FaChevronRight className="text-white text-2xl" />
          </button>
        )}
      </div>
    </section>
  );
};

export default ContentRow;
