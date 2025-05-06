import { useState } from 'react';
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from 'react-icons/fa';
import { Movie, TvShow, getImageUrl } from '@/lib/tmdb';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface MovieCardProps {
  item: Movie | TvShow;
  showProgress?: boolean;
  progress?: number;
  type?: 'movie' | 'tv';
}

const MovieCard = ({ 
  item, 
  showProgress = false, 
  progress = Math.floor(Math.random() * 90) + 10,
  type = 'movie'
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const posterPath = item.poster_path;
  
  // Calculate match percentage (mocked for demonstration)
  const match = Math.floor(Math.random() * 15) + 85;
  
  // Determine maturity rating (mocked)
  const maturityRating = item.adult ? '18+' : Math.random() > 0.5 ? '16+' : '12+';
  
  // Duration info (mocked)
  const duration = type === 'movie' 
    ? `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 59) + 1}m` 
    : `S${Math.floor(Math.random() * 5) + 1}:E${Math.floor(Math.random() * 10) + 1}`;
  
  // Genres (mocked)
  const genres = [
    ['Action', 'Adventure', 'Fantasy'],
    ['Drama', 'Thriller', 'Mystery'],
    ['Comedy', 'Romance', 'Family'],
    ['Sci-Fi', 'Horror', 'Fantasy'],
    ['Crime', 'Documentary', 'Biography']
  ][Math.floor(Math.random() * 5)];

  return (
    <div 
      className="netflix-card flex-none w-[160px] sm:w-[180px] md:w-[200px] relative rounded overflow-hidden hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
    >
      <img 
        src={getImageUrl(posterPath, 'w500')} 
        alt={title} 
        className="w-full h-auto object-cover aspect-[2/3]"
        loading="lazy"
      />
      
      {/* Progress bar for continue watching */}
      {showProgress && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
          <div className="h-full bg-netflix-red" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      
      <Dialog>
        <div 
          className={`card-info absolute inset-0 bg-netflix-light-black bg-opacity-80 p-3 flex flex-col justify-end ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          style={{ transition: 'all 0.3s ease' }}
        >
          <div className="flex justify-between mb-2">
            <div className="flex space-x-2">
              <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition">
                <FaPlay className="text-black" />
              </button>
              <button className="border-2 border-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-white hover:border-white transition">
                <FaPlus />
              </button>
              <button className="border-2 border-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-white hover:border-white transition">
                <FaThumbsUp />
              </button>
            </div>
            <DialogTrigger asChild>
              <button className="border-2 border-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-white hover:border-white transition">
                <FaChevronDown />
              </button>
            </DialogTrigger>
          </div>
          <div className="text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-green-500 font-bold">{match}% Match</span>
              <span className="border px-1 text-[10px]">{maturityRating}</span>
              <span>{duration}</span>
            </div>
            <div className="mt-1 space-x-1">
              {genres.map((genre, index) => (
                <span key={index}>
                  {genre}{index < genres.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <DialogContent className="sm:max-w-3xl bg-netflix-dark-gray text-white border-gray-700">
          <div className="relative">
            <div 
              className="w-full h-[25vh] md:h-[30vh] bg-cover bg-center mb-4 rounded-t"
              style={{ 
                backgroundImage: `url(${getImageUrl(item.backdrop_path || posterPath, 'original')})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-gray to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white bg-opacity-30 hover:bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center transition">
                  <FaPlay className="text-white text-3xl" />
                </button>
              </div>
            </div>
            
            <div className="px-4 pb-6">
              <h2 className="text-3xl font-bold mb-2">{title}</h2>
              
              <div className="flex items-center space-x-2 mb-4 text-sm">
                <span className="text-green-500 font-semibold">{match}% Match</span>
                <span>{new Date(releaseDate || '').getFullYear()}</span>
                <span className="border px-1 text-xs">{maturityRating}</span>
                <span>{duration}</span>
              </div>
              
              <p className="text-base mb-6">{item.overview}</p>
              
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Genres:</p>
                  <p className="text-sm">
                    {genres.join(', ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm mb-1">Cast:</p>
                  <p className="text-sm">
                    {['Chris Evans', 'Scarlett Johansson', 'Robert Downey Jr', 'Chris Hemsworth', 'Mark Ruffalo']
                      .slice(0, 3)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieCard;
