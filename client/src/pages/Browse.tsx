import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContentRow from "@/components/ContentRow";
import MovieCard from "@/components/MovieCard";
import { 
  fetchTrending, 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchNowPlayingMovies,
  fetchPopularTvShows,
  fetchTopRatedTvShows,
  Movie,
  TvShow,
  TrendingResponse,
  MoviesResponse,
  TvShowsResponse
} from "@/lib/tmdb";
import { Button } from "@/components/ui/button";

const Browse = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!currentUser) {
      navigate("/profiles");
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  const handleError = (error: Error) => {
    console.error("API Error:", error);
    setHasError(true);
    toast({
      title: "Content Loading Error",
      description: "There was a problem loading movies and TV shows. Please try again later.",
      variant: "destructive",
    });
  };
  
  const { data: trending, isLoading: trendingLoading, error: trendingError } = useQuery<TrendingResponse>({
    queryKey: ['/api/trending'],
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
  
  const { data: popularMovies, isLoading: popularMoviesLoading, error: popularMoviesError } = useQuery<MoviesResponse>({
    queryKey: ['/api/movies/popular'],
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
  
  const { data: topRatedMovies, isLoading: topRatedMoviesLoading, error: topRatedMoviesError } = useQuery<MoviesResponse>({
    queryKey: ['/api/movies/top_rated'],
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
  
  const { data: nowPlayingMovies, isLoading: nowPlayingMoviesLoading, error: nowPlayingMoviesError } = useQuery<MoviesResponse>({
    queryKey: ['/api/movies/now_playing'],
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
  
  const { data: popularTvShows, isLoading: popularTvShowsLoading, error: popularTvShowsError } = useQuery<TvShowsResponse>({
    queryKey: ['/api/tv/popular'],
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
  
  const { data: topRatedTvShows, isLoading: topRatedTvShowsLoading, error: topRatedTvShowsError } = useQuery<TvShowsResponse>({
    queryKey: ['/api/tv/top_rated'],
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
  
  // Check for errors in any of the queries
  useEffect(() => {
    const errors = [
      trendingError, popularMoviesError, topRatedMoviesError, 
      nowPlayingMoviesError, popularTvShowsError, topRatedTvShowsError
    ];
    
    if (errors.some(error => error)) {
      handleError(errors.find(error => error) as Error);
    }
  }, [
    trendingError, popularMoviesError, topRatedMoviesError, 
    nowPlayingMoviesError, popularTvShowsError, topRatedTvShowsError
  ]);
  
  if (!isAuthenticated || !currentUser) {
    return null;
  }
  
  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-netflix-black text-white">
        <Header />
        
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Unable to Load Content</h2>
          <p className="text-lg text-gray-400 mb-8">
            There was a problem loading movies and TV shows. This could be due to a connection issue or API limitation.
          </p>
          <Button 
            className="bg-netflix-red hover:bg-[#f40612] text-white px-6 py-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Loading state - show a loading screen if all content is loading
  const isAllLoading = trendingLoading && popularMoviesLoading && topRatedMoviesLoading && 
                       nowPlayingMoviesLoading && popularTvShowsLoading && topRatedTvShowsLoading;
  
  if (isAllLoading) {
    return (
      <div className="min-h-screen bg-netflix-black text-white">
        <Header />
        
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading content...</p>
        </div>
      </div>
    );
  }
  
  // Get a featured item for the hero from trending
  const featuredItem = trending?.results?.[0];
  
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Header />
      
      <HeroSection featured={featuredItem} />
      
      <main className="pb-20 mt-2 md:mt-0 relative z-10">
        {/* Top 10 na Netflix Hoje */}
        <ContentRow 
          title="Top 10 na Netflix Hoje" 
          items={(trending?.results || []).slice(0, 10)} 
          isLoading={trendingLoading}
          isTop10={true}
        />
        
        <ContentRow 
          title={`Continue Assistindo: ${currentUser.name}`} 
          items={nowPlayingMovies?.results?.slice(0, 10) || []} 
          isLoading={nowPlayingMoviesLoading}
          showProgress={true}
        />
        
        {/* Séries coreanas */}
        <ContentRow 
          title="Séries Coreanas" 
          items={(popularTvShows?.results || []).slice(0, 7)} 
          isLoading={popularTvShowsLoading}
          type="tv"
        />
        
        {/* Séries aclamadas - usar as top rated TV shows */}
        <ContentRow 
          title="Séries Aclamadas" 
          items={topRatedTvShows?.results || []} 
          isLoading={topRatedTvShowsLoading}
          type="tv"
        />
        
        {/* Filmes recentes */}
        <ContentRow 
          title="Filmes Recentes" 
          items={nowPlayingMovies?.results || []} 
          isLoading={nowPlayingMoviesLoading}
        />
        
        {/* Em alta - usar trending */}
        <ContentRow 
          title="Em Alta" 
          items={trending?.results || []} 
          isLoading={trendingLoading} 
        />
        
        {/* Filmes de Ação */}
        <ContentRow 
          title="Filmes de Ação" 
          items={(popularMovies?.results || []).slice(5, 15)} 
          isLoading={popularMoviesLoading} 
        />
        
        {/* Dramas Baseados em Livros */}
        <ContentRow 
          title="Dramas Baseados em Livros" 
          items={(topRatedMovies?.results || []).slice(3, 13)} 
          isLoading={topRatedMoviesLoading} 
        />
        
        {/* Populares na Netflix */}
        <ContentRow 
          title="Populares na Netflix" 
          items={popularMovies?.results || []} 
          isLoading={popularMoviesLoading} 
        />
        
        {/* Sugestões para você */}
        <ContentRow 
          title="Sugestões para você" 
          items={topRatedMovies?.results?.slice(10, 20) || []} 
          isLoading={topRatedMoviesLoading} 
        />
      </main>
    </div>
  );
};

export default Browse;
