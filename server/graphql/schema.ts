import { makeExecutableSchema } from '@graphql-tools/schema';
import { tmdbAPI } from '../tmdb';
import { storage } from '../storage';
import { User, Profile, InsertUser } from '@shared/schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const typeDefs = `
  type User {
    id: Int!
    username: String!
    profiles: [Profile!]!
  }

  type Profile {
    id: Int!
    userId: Int!
    name: String!
    avatar: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Movie {
    id: Int!
    title: String!
    poster_path: String
    backdrop_path: String
    overview: String!
    release_date: String!
    vote_average: Float!
    popularity: Float!
    adult: Boolean!
    media_type: String
  }

  type TvShow {
    id: Int!
    name: String!
    poster_path: String
    backdrop_path: String
    overview: String!
    first_air_date: String!
    vote_average: Float!
    popularity: Float!
    adult: Boolean!
    number_of_seasons: Int
    media_type: String
  }

  type Genre {
    id: Int!
    name: String!
  }

  type MediaResult {
    page: Int!
    results: [Media!]!
    total_results: Int!
    total_pages: Int!
  }

  union Media = Movie | TvShow

  type Query {
    me: User
    trending: MediaResult!
    popularMovies: MediaResult!
    topRatedMovies: MediaResult!
    nowPlayingMovies: MediaResult!
    upcomingMovies: MediaResult!
    popularTvShows: MediaResult!
    topRatedTvShows: MediaResult!
    movieDetails(id: Int!): Movie
    tvShowDetails(id: Int!): TvShow
    similarMovies(id: Int!): MediaResult!
    similarTvShows(id: Int!): MediaResult!
    movieGenres: [Genre!]!
    tvGenres: [Genre!]!
    search(query: String!): MediaResult!
  }

  type Mutation {
    signup(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    createProfile(name: String!, avatar: String!): Profile!
    updateProfile(id: Int!, name: String, avatar: String): Profile!
    deleteProfile(id: Int!): Boolean!
  }
`;

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

// Context type for resolver functions
interface Context {
  userId?: number;
}

// Helper to handle user authentication
const getUserId = (context: Context): number => {
  if (!context.userId) {
    throw new Error('Authentication required');
  }
  return context.userId;
};

// GraphQL resolvers
const resolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      try {
        const userId = getUserId(context);
        const user = await storage.getUser(userId);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // For now, we're using mock profiles
        return {
          ...user,
          profiles: [
            {
              id: 1,
              userId: user.id,
              name: "John",
              avatar: "/assets/yble0xDFerMYRYRz9uUgrVhnBrzVULNvCX38QH1za_U.webp"
            },
            {
              id: 2,
              userId: user.id,
              name: "Sarah",
              avatar: "/assets/netflix-profile-pictures-5yup5hd2i60x7ew3.jpg"
            },
            {
              id: 3,
              userId: user.id,
              name: "Michael",
              avatar: "/assets/323ecca68b7105d23184e783b86b0c5a.jpg"
            },
            {
              id: 4,
              userId: user.id,
              name: "Kids",
              avatar: "/assets/images (9).jpg"
            }
          ]
        };
      } catch (error) {
        console.error('Error in me query:', error);
        throw error;
      }
    },
    trending: async () => tmdbAPI.getTrending(),
    popularMovies: async () => tmdbAPI.getPopularMovies(),
    topRatedMovies: async () => tmdbAPI.getTopRatedMovies(),
    nowPlayingMovies: async () => tmdbAPI.getNowPlayingMovies(),
    upcomingMovies: async () => tmdbAPI.getUpcomingMovies(),
    popularTvShows: async () => tmdbAPI.getPopularTvShows(),
    topRatedTvShows: async () => tmdbAPI.getTopRatedTvShows(),
    movieDetails: async (_: any, { id }: { id: number }) => tmdbAPI.getMovieDetails(id),
    tvShowDetails: async (_: any, { id }: { id: number }) => tmdbAPI.getTvShowDetails(id),
    similarMovies: async (_: any, { id }: { id: number }) => tmdbAPI.getSimilarMovies(id),
    similarTvShows: async (_: any, { id }: { id: number }) => tmdbAPI.getSimilarTvShows(id),
    movieGenres: async () => {
      const { genres } = await tmdbAPI.getMovieGenres();
      return genres;
    },
    tvGenres: async () => {
      const { genres } = await tmdbAPI.getTvGenres();
      return genres;
    },
    search: async (_: any, { query }: { query: string }) => tmdbAPI.search(query)
  },
  
  Mutation: {
    signup: async (_: any, args: { username: string; password: string }) => {
      try {
        // Check if user exists
        const existingUser = await storage.getUserByUsername(args.username);
        if (existingUser) {
          throw new Error('User already exists');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(args.password, 10);
        
        // Create user
        const userData: InsertUser = {
          username: args.username,
          password: hashedPassword
        };
        
        const newUser = await storage.createUser(userData);
        
        // Generate JWT token
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
          expiresIn: '7d'
        });
        
        // Return user and token
        return {
          token,
          user: {
            ...newUser,
            profiles: [] // New user has no profiles yet
          }
        };
      } catch (error) {
        console.error('Error in signup mutation:', error);
        throw error;
      }
    },
    
    login: async (_: any, args: { username: string; password: string }) => {
      try {
        // Find user
        const user = await storage.getUserByUsername(args.username);
        if (!user) {
          throw new Error('Invalid credentials');
        }
        
        // Check password
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error('Invalid credentials');
        }
        
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: '7d'
        });
        
        // Return user and token
        return {
          token,
          user: {
            ...user,
            profiles: [
              {
                id: 1,
                userId: user.id,
                name: "John",
                avatar: "/assets/yble0xDFerMYRYRz9uUgrVhnBrzVULNvCX38QH1za_U.webp"
              },
              {
                id: 2,
                userId: user.id,
                name: "Sarah",
                avatar: "/assets/netflix-profile-pictures-5yup5hd2i60x7ew3.jpg"
              },
              {
                id: 3,
                userId: user.id,
                name: "Michael",
                avatar: "/assets/323ecca68b7105d23184e783b86b0c5a.jpg"
              },
              {
                id: 4,
                userId: user.id,
                name: "Kids",
                avatar: "/assets/images (9).jpg"
              }
            ]
          }
        };
      } catch (error) {
        console.error('Error in login mutation:', error);
        throw error;
      }
    },
    
    // Profile mutations would go here in a full implementation
    createProfile: async (_: any, args: { name: string; avatar: string }, context: Context) => {
      const userId = getUserId(context);
      
      // In a real app, you would save this to the database
      // For now, just return a mock profile
      return {
        id: Math.floor(Math.random() * 1000), // Mock ID
        userId,
        name: args.name,
        avatar: args.avatar
      };
    },
    
    updateProfile: async (_: any, args: { id: number; name?: string; avatar?: string }, context: Context) => {
      getUserId(context); // Just check authentication
      
      // Mock response, in real app would update database
      return {
        id: args.id,
        userId: 1,
        name: args.name || "Updated Profile",
        avatar: args.avatar || "/assets/default-avatar.jpg"
      };
    },
    
    deleteProfile: async (_: any, args: { id: number }, context: Context) => {
      getUserId(context); // Just check authentication
      
      // Mock successful deletion
      return true;
    }
  },
  
  // Type resolvers for the Media union type
  Media: {
    __resolveType(obj: any) {
      if (obj.title) {
        return 'Movie';
      }
      if (obj.name) {
        return 'TvShow';
      }
      return null;
    }
  }
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

export const getContext = ({ req }: { req: any }): Context => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      return { userId: decoded.userId };
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
  return {};
};