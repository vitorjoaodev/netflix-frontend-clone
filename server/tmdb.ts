import fetch from "node-fetch";

class TMDBApi {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || "";
    this.baseUrl = "https://api.themoviedb.org/3";
  }

  private async fetchFromTMDB(endpoint: string) {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${endpoint}${separator}api_key=${this.apiKey}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getTrending() {
    return this.fetchFromTMDB("/trending/all/day");
  }

  async getPopularMovies() {
    return this.fetchFromTMDB("/movie/popular");
  }

  async getTopRatedMovies() {
    return this.fetchFromTMDB("/movie/top_rated");
  }

  async getNowPlayingMovies() {
    return this.fetchFromTMDB("/movie/now_playing");
  }

  async getUpcomingMovies() {
    return this.fetchFromTMDB("/movie/upcoming");
  }

  async getPopularTvShows() {
    return this.fetchFromTMDB("/tv/popular");
  }

  async getTopRatedTvShows() {
    return this.fetchFromTMDB("/tv/top_rated");
  }

  async getMovieDetails(movieId: number) {
    return this.fetchFromTMDB(`/movie/${movieId}`);
  }

  async getTvShowDetails(tvId: number) {
    return this.fetchFromTMDB(`/tv/${tvId}`);
  }

  async getSimilarMovies(movieId: number) {
    return this.fetchFromTMDB(`/movie/${movieId}/similar`);
  }

  async getSimilarTvShows(tvId: number) {
    return this.fetchFromTMDB(`/tv/${tvId}/similar`);
  }

  async getMovieGenres() {
    return this.fetchFromTMDB("/genre/movie/list");
  }

  async getTvGenres() {
    return this.fetchFromTMDB("/genre/tv/list");
  }

  async search(query: string) {
    return this.fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}`);
  }
}

export const tmdbAPI = new TMDBApi();
