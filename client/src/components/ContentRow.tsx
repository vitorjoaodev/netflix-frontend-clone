import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { Movie, TvShow } from '@/lib/tmdb';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Function to scroll the carousel
  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    const { scrollWidth, clientWidth } = sliderRef.current;
    const scrollAmount = clientWidth * 0.8; // Scroll by 80% of visible width
    
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(scrollWidth - clientWidth, scrollPosition + scrollAmount);
    
    sliderRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
    
    // Update arrows visibility
    setShowLeftArrow(newPosition > 0);
    setShowRightArrow(newPosition < (scrollWidth - clientWidth - 10)); // -10 for buffer
  };
  
  // Check if we need to show the right arrow (if content exceeds container)
  useEffect(() => {
    if (!sliderRef.current) return;
    
    const checkScrollability = () => {
      const { scrollWidth, clientWidth } = sliderRef.current!;
      setShowRightArrow(scrollWidth > clientWidth);
    };
    
    // Initial check
    checkScrollability();
    
    // Check again when window resizes
    window.addEventListener('resize', checkScrollability);
    
    // Add scroll event listener to update arrow visibility
    const handleScroll = () => {
      if (!sliderRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setScrollPosition(scrollLeft);
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < (scrollWidth - clientWidth - 10));
    };
    
    sliderRef.current.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkScrollability);
      sliderRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  // Handle loading state
  if (isLoading) {
    return (
      <section className="netflix-row mb-8">
        <h2 className="netflix-row-title pl-4">{title}</h2>
        <div className="relative group">
          <div className="carousel flex overflow-x-auto scrollbar-hide gap-2 pl-4 pr-4 pb-4"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] relative rounded overflow-hidden bg-netflix-dark-gray animate-pulse"
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
      <h2 className="netflix-row-title pl-4">{title}</h2>
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 h-full w-12 
                     opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            onClick={() => scroll('left')}
          >
            <FaChevronLeft className="text-white text-2xl" />
          </button>
        )}
        
        <div 
          ref={sliderRef} 
          className="carousel flex overflow-x-auto scrollbar-hide gap-2 pl-4 pr-4 pb-4 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="flex-shrink-0 snap-start">
              <MovieCard 
                item={item} 
                showProgress={showProgress}
                type={type}
                isTop10={isTop10}
                index={isTop10 ? index : undefined}
              />
            </div>
          ))}
        </div>
        
        {/* Right Arrow */}
        {showRightArrow && (
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 h-full w-12 
                     opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
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
