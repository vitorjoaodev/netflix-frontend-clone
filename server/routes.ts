import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tmdbAPI } from "./tmdb";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Create user
      const user = await storage.createUser(validatedData);
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json({
        ...userWithoutPassword,
        // Add default profiles (in a real app, this would be stored in DB)
        profiles: [
          {
            id: 1,
            name: "User",
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
          }
        ]
      });
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to sign up" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Validate request body
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string()
      });
      
      const validatedData = loginSchema.parse(req.body);
      
      // Check if user exists (we store as username instead of email for simplicity)
      const user = await storage.getUserByUsername(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password (in real app, we would compare hashed passwords)
      if (user.password !== validatedData.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        ...userWithoutPassword,
        // Add mock profiles (in a real app, this would be stored in DB)
        profiles: [
          {
            id: 1,
            name: "User",
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
          },
          {
            id: 2,
            name: "Sarah",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
          },
          {
            id: 3,
            name: "Michael",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
          },
          {
            id: 4,
            name: "Kids",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
          }
        ]
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to log in" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    return res.status(200).json({ message: "Logged out successfully" });
  });
  
  app.get("/api/auth/me", (req, res) => {
    // This would normally check the session/token
    // For this demo, we'll just return a mock user
    return res.status(200).json({
      id: 1,
      username: "user@example.com",
      profiles: [
        {
          id: 1,
          name: "John",
          avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
        },
        {
          id: 2,
          name: "Sarah",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
        },
        {
          id: 3,
          name: "Michael",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
        },
        {
          id: 4,
          name: "Kids",
          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
        }
      ]
    });
  });
  
  // TMDB API routes
  app.get("/api/trending", async (req, res) => {
    try {
      const data = await tmdbAPI.getTrending();
      res.json(data);
    } catch (error) {
      console.error("Error fetching trending:", error);
      res.status(500).json({ message: "Failed to fetch trending content" });
    }
  });
  
  app.get("/api/movies/popular", async (req, res) => {
    try {
      const data = await tmdbAPI.getPopularMovies();
      res.json(data);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      res.status(500).json({ message: "Failed to fetch popular movies" });
    }
  });
  
  app.get("/api/movies/top_rated", async (req, res) => {
    try {
      const data = await tmdbAPI.getTopRatedMovies();
      res.json(data);
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      res.status(500).json({ message: "Failed to fetch top rated movies" });
    }
  });
  
  app.get("/api/movies/now_playing", async (req, res) => {
    try {
      const data = await tmdbAPI.getNowPlayingMovies();
      res.json(data);
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      res.status(500).json({ message: "Failed to fetch now playing movies" });
    }
  });
  
  app.get("/api/movies/upcoming", async (req, res) => {
    try {
      const data = await tmdbAPI.getUpcomingMovies();
      res.json(data);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      res.status(500).json({ message: "Failed to fetch upcoming movies" });
    }
  });
  
  app.get("/api/tv/popular", async (req, res) => {
    try {
      const data = await tmdbAPI.getPopularTvShows();
      res.json(data);
    } catch (error) {
      console.error("Error fetching popular TV shows:", error);
      res.status(500).json({ message: "Failed to fetch popular TV shows" });
    }
  });
  
  app.get("/api/tv/top_rated", async (req, res) => {
    try {
      const data = await tmdbAPI.getTopRatedTvShows();
      res.json(data);
    } catch (error) {
      console.error("Error fetching top rated TV shows:", error);
      res.status(500).json({ message: "Failed to fetch top rated TV shows" });
    }
  });
  
  app.get("/api/movie/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = await tmdbAPI.getMovieDetails(id);
      res.json(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      res.status(500).json({ message: "Failed to fetch movie details" });
    }
  });
  
  app.get("/api/tv/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = await tmdbAPI.getTvShowDetails(id);
      res.json(data);
    } catch (error) {
      console.error("Error fetching TV show details:", error);
      res.status(500).json({ message: "Failed to fetch TV show details" });
    }
  });
  
  app.get("/api/movie/:id/similar", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = await tmdbAPI.getSimilarMovies(id);
      res.json(data);
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      res.status(500).json({ message: "Failed to fetch similar movies" });
    }
  });
  
  app.get("/api/tv/:id/similar", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = await tmdbAPI.getSimilarTvShows(id);
      res.json(data);
    } catch (error) {
      console.error("Error fetching similar TV shows:", error);
      res.status(500).json({ message: "Failed to fetch similar TV shows" });
    }
  });
  
  app.get("/api/genres/movie", async (req, res) => {
    try {
      const data = await tmdbAPI.getMovieGenres();
      res.json(data);
    } catch (error) {
      console.error("Error fetching movie genres:", error);
      res.status(500).json({ message: "Failed to fetch movie genres" });
    }
  });
  
  app.get("/api/genres/tv", async (req, res) => {
    try {
      const data = await tmdbAPI.getTvGenres();
      res.json(data);
    } catch (error) {
      console.error("Error fetching TV genres:", error);
      res.status(500).json({ message: "Failed to fetch TV genres" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
