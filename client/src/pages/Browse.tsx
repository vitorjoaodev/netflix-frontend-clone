import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContentRow from "@/components/ContentRow";
import { 
  fetchTrending, 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchNowPlayingMovies,
  fetchPopularTvShows,
  fetchTopRatedTvShows
} from "@/lib/tmdb";

const Browse = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!currentUser) {
      navigate("/profiles");
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['/api/trending'],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const { data: popularMovies, isLoading: popularMoviesLoading } = useQuery({
    queryKey: ['/api/movies/popular'],
    staleTime: 10 * 60 * 1000,
  });
  
  const { data: topRatedMovies, isLoading: topRatedMoviesLoading } = useQuery({
    queryKey: ['/api/movies/top_rated'],
    staleTime: 10 * 60 * 1000,
  });
  
  const { data: nowPlayingMovies, isLoading: nowPlayingMoviesLoading } = useQuery({
    queryKey: ['/api/movies/now_playing'],
    staleTime: 10 * 60 * 1000,
  });
  
  const { data: popularTvShows, isLoading: popularTvShowsLoading } = useQuery({
    queryKey: ['/api/tv/popular'],
    staleTime: 10 * 60 * 1000,
  });
  
  const { data: topRatedTvShows, isLoading: topRatedTvShowsLoading } = useQuery({
    queryKey: ['/api/tv/top_rated'],
    staleTime: 10 * 60 * 1000,
  });
  
  if (!isAuthenticated || !currentUser) {
    return null;
  }
  
  // Get a featured item for the hero from trending
  const featuredItem = trending?.results?.[0];
  
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Header />
      
      <HeroSection featured={featuredItem} />
      
      <main className="pb-20 mt-2 md:mt-0 relative z-10">
        <ContentRow 
          title="Popular on Netflix" 
          items={popularMovies?.results || []} 
          isLoading={popularMoviesLoading} 
        />
        
        <ContentRow 
          title={`Continue Watching for ${currentUser.name}`} 
          items={nowPlayingMovies?.results?.slice(0, 10) || []} 
          isLoading={nowPlayingMoviesLoading}
          showProgress={true}
        />
        
        <ContentRow 
          title="Trending Now" 
          items={trending?.results || []} 
          isLoading={trendingLoading} 
        />
        
        <ContentRow 
          title="Top Rated Movies" 
          items={topRatedMovies?.results || []} 
          isLoading={topRatedMoviesLoading} 
        />
        
        <ContentRow 
          title="Popular TV Shows" 
          items={popularTvShows?.results || []} 
          isLoading={popularTvShowsLoading}
          type="tv"
        />
        
        <ContentRow 
          title="Top Rated TV Shows" 
          items={topRatedTvShows?.results || []} 
          isLoading={topRatedTvShowsLoading}
          type="tv"
        />
        
        <ContentRow 
          title="Top Picks for You" 
          items={topRatedMovies?.results?.slice(10, 20) || []} 
          isLoading={topRatedMoviesLoading} 
        />
      </main>
    </div>
  );
};

export default Browse;
