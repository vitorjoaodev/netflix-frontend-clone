import { apiRequest } from "./queryClient";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  vote_count: number;
  adult: boolean;
  popularity: number;
  media_type?: string;
}

export interface MovieDetail extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
}

export interface TvShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  vote_count: number;
  adult: boolean;
  popularity: number;
  media_type?: string;
  number_of_seasons?: number;
}

export interface TvShowDetail extends TvShow {
  genres: { id: number; name: string }[];
  episode_run_time: number[];
  status: string;
  tagline: string;
  number_of_seasons: number;
  number_of_episodes: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export interface TvShowsResponse {
  page: number;
  results: TvShow[];
  total_results: number;
  total_pages: number;
}

export interface TrendingResponse {
  page: number;
  results: (Movie | TvShow)[];
  total_results: number;
  total_pages: number;
}

export const fetchTrending = async (): Promise<Movie[] | TvShow[]> => {
  const res = await apiRequest("GET", "/api/trending", undefined);
  const data = await res.json();
  return data.results;
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const res = await apiRequest("GET", "/api/movies/popular", undefined);
  const data = await res.json();
  return data.results;
};

export const fetchTopRatedMovies = async (): Promise<Movie[]> => {
  const res = await apiRequest("GET", "/api/movies/top_rated", undefined);
  const data = await res.json();
  return data.results;
};

export const fetchNowPlayingMovies = async (): Promise<Movie[]> => {
  const res = await apiRequest("GET", "/api/movies/now_playing", undefined);
  const data = await res.json();
  return data.results;
};

export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  const res = await apiRequest("GET", "/api/movies/upcoming", undefined);
  const data = await res.json();
  return data.results;
};

export const fetchPopularTvShows = async (): Promise<TvShow[]> => {
  const res = await apiRequest("GET", "/api/tv/popular", undefined);
  const data = await res.json();
  return data.results;
};

export const fetchTopRatedTvShows = async (): Promise<TvShow[]> => {
  const res = await apiRequest("GET", "/api/tv/top_rated", undefined);
  const data = await res.json();
  return data.results;
};

export const fetchMovieDetails = async (id: number): Promise<MovieDetail> => {
  const res = await apiRequest("GET", `/api/movie/${id}`, undefined);
  return await res.json();
};

export const fetchTvShowDetails = async (id: number): Promise<TvShowDetail> => {
  const res = await apiRequest("GET", `/api/tv/${id}`, undefined);
  return await res.json();
};

export const fetchSimilarMovies = async (id: number): Promise<Movie[]> => {
  const res = await apiRequest("GET", `/api/movie/${id}/similar`, undefined);
  const data = await res.json();
  return data.results;
};

export const fetchSimilarTvShows = async (id: number): Promise<TvShow[]> => {
  const res = await apiRequest("GET", `/api/tv/${id}/similar`, undefined);
  const data = await res.json();
  return data.results;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const resMovies = await apiRequest("GET", "/api/genres/movie", undefined);
  const dataMovies = await resMovies.json();
  
  const resTv = await apiRequest("GET", "/api/genres/tv", undefined);
  const dataTv = await resTv.json();
  
  // Merge and remove duplicates
  const allGenres = [...dataMovies.genres, ...dataTv.genres];
  const uniqueGenres = Array.from(new Map(allGenres.map(item => [item.id, item])).values());
  
  return uniqueGenres;
};

export const getImageUrl = (path: string | null, size: string = "original"): string => {
  if (!path) return "https://via.placeholder.com/300x450?text=No+Image";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getGenreNameById = (genreId: number, genres: Genre[]): string => {
  const genre = genres.find((genre) => genre.id === genreId);
  return genre ? genre.name : "Unknown";
};
