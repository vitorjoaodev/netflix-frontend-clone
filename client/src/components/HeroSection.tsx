import { useState, useEffect } from 'react';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import { Movie, TvShow, getImageUrl } from '@/lib/tmdb';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';

interface HeroSectionProps {
  featured?: Movie | TvShow;
}

const HeroSection = ({ featured }: HeroSectionProps) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  if (!featured) {
    return (
      <div className="relative w-full h-[80vh] bg-netflix-black/50 animate-pulse">
        <div className="absolute bottom-[20%] left-[4%] max-w-md md:max-w-lg lg:max-w-xl z-10 p-4">
          <div className="h-12 bg-gray-700 rounded mb-4 w-2/3"></div>
          <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-700 rounded mb-6 w-2/3"></div>
          <div className="flex space-x-3">
            <div className="h-10 bg-gray-700 rounded w-24"></div>
            <div className="h-10 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  const title = 'title' in featured ? featured.title : featured.name;
  const backdropPath = featured.backdrop_path;
  const overview = featured.overview;
  
  return (
    <section className="relative">
      {/* Hero Background Image */}
      <div 
        className="relative w-full h-[80vh]" 
        style={{ 
          backgroundImage: `url(${getImageUrl(backdropPath, 'original')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-[20%] left-[4%] max-w-md md:max-w-lg lg:max-w-xl z-10 p-4">
          {/* Featured Content Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{title}</h1>
          
          {/* Ranking Badge */}
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4 bg-netflix-red px-2 py-px rounded text-sm font-semibold">
              <span>TOP 10</span>
            </div>
            <span className="text-green-500 font-semibold">
              #{Math.floor(Math.random() * 10) + 1} in {Math.random() > 0.5 ? 'TV Shows' : 'Movies'} Today
            </span>
          </div>
          
          <p className="text-lg md:text-xl mb-6">{overview}</p>
          
          <div className="flex space-x-3">
            <button className="bg-white text-black py-2 px-6 rounded flex items-center hover:bg-opacity-80 transition">
              <FaPlay className="mr-2" />
              <span className="font-semibold">Play</span>
            </button>
            
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-gray-600 bg-opacity-70 text-white py-2 px-6 rounded flex items-center hover:bg-opacity-50 transition">
                  <FaInfoCircle className="mr-2" />
                  <span className="font-semibold">More Info</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl bg-netflix-dark-gray text-white border-gray-700">
                <div className="relative">
                  <div 
                    className="w-full h-[25vh] md:h-[30vh] bg-cover bg-center mb-4"
                    style={{ 
                      backgroundImage: `url(${getImageUrl(backdropPath, 'original')})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-gray to-transparent"></div>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-2">{title}</h2>
                  
                  <div className="flex items-center space-x-2 mb-4 text-sm">
                    <span className="text-green-500 font-semibold">{Math.floor(Math.random() * 30) + 70}% Match</span>
                    <span>{new Date(('release_date' in featured ? featured.release_date : featured.first_air_date) || '').getFullYear()}</span>
                    <span className="border px-1 text-xs">{'adult' in featured && featured.adult ? '18+' : 'TV-MA'}</span>
                    {'runtime' in featured ? 
                      <span>{Math.floor(featured.runtime / 60)}h {featured.runtime % 60}m</span> : 
                      ('number_of_seasons' in featured && featured.number_of_seasons ?
                        <span>{featured.number_of_seasons} Season{featured.number_of_seasons > 1 ? 's' : ''}</span> : 
                        null
                      )
                    }
                  </div>
                  
                  <p className="text-base mb-4">{overview}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {featured.genre_ids?.slice(0, 3).map((genreId, index) => (
                      <span key={index} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm">
                        {['Action', 'Drama', 'Thriller', 'Sci-Fi', 'Comedy'][genreId % 5]}
                      </span>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
