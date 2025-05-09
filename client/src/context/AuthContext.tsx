import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

interface Profile {
  id: number;
  name: string;
  avatar: string;
}

interface User {
  id: number;
  email: string;
  profiles: Profile[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  currentUser: Profile | null;
  profiles: Profile[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addProfile: (name: string) => void;
  deleteProfile: (id: number) => void;
  setCurrentProfile: (id: number) => void;
  updateProfileAvatar: (profileId: number, avatarUrl: string) => void;
}

// Avatares personalizados com as imagens anexadas
import { avatars as customAvatars } from "@/lib/data";

// Avatares específicos para cada perfil
const profileAvatars = {
  john: customAvatars[0],    // Robô azul
  sarah: customAvatars[1],   // Cara sorridente laranja
  michael: customAvatars[2], // Cara sorridente verde
  kids: customAvatars[3]     // Logo colorido kids
};

// Todos os avatares disponíveis para escolha
const avatarImages = customAvatars;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  
  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      try {
        const res = await apiRequest("GET", "/api/auth/me", undefined);
        const userData = await res.json();
        
        setUser(userData);
        setProfiles(userData.profiles);
        setIsAuthenticated(true);
        
        // Get current profile from localStorage if it exists
        const savedProfileId = localStorage.getItem('currentProfileId');
        if (savedProfileId) {
          const profileId = parseInt(savedProfileId, 10);
          const profile = userData.profiles.find((p: Profile) => p.id === profileId);
          if (profile) {
            setCurrentUser(profile);
          }
        }
      } catch (error) {
        console.error("Not authenticated:", error);
        setIsAuthenticated(false);
        setUser(null);
        setCurrentUser(null);
        setProfiles([]);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      
      try {
        const userData = await res.json();
        
        setUser(userData);
        setProfiles(userData.profiles || []);
        setIsAuthenticated(true);
        
        return userData;
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        throw new Error("Failed to parse the server response. Please try again later.");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error((error as Error).message || "Failed to log in");
    }
  };
  
  const signup = async (email: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/auth/signup", { email, password });
      
      try {
        const userData = await res.json();
        
        // Create default profile
        const defaultProfile = {
          id: 1,
          name: "User",
          avatar: avatarImages[0]
        };
        
        const userWithProfiles = {
          ...userData,
          profiles: userData.profiles || [defaultProfile]
        };
        
        setUser(userWithProfiles);
        setProfiles(userWithProfiles.profiles);
        setIsAuthenticated(true);
        
        return userWithProfiles;
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        throw new Error("Failed to parse the server response. Please try again later.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error((error as Error).message || "Failed to sign up");
    }
  };
  
  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", undefined);
      
      setUser(null);
      setCurrentUser(null);
      setProfiles([]);
      setIsAuthenticated(false);
      localStorage.removeItem('currentProfileId');
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear the user data on the client side even if the API call fails
      setUser(null);
      setCurrentUser(null);
      setProfiles([]);
      setIsAuthenticated(false);
      localStorage.removeItem('currentProfileId');
    }
  };
  
  const addProfile = (name: string) => {
    const newProfile = {
      id: Date.now(),
      name,
      avatar: avatarImages[profiles.length % avatarImages.length]
    };
    
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    
    if (user) {
      setUser({
        ...user,
        profiles: updatedProfiles
      });
    }
  };
  
  const deleteProfile = (id: number) => {
    const updatedProfiles = profiles.filter(profile => profile.id !== id);
    setProfiles(updatedProfiles);
    
    if (currentUser?.id === id) {
      setCurrentUser(updatedProfiles[0] || null);
      localStorage.setItem('currentProfileId', (updatedProfiles[0]?.id || '').toString());
    }
    
    if (user) {
      setUser({
        ...user,
        profiles: updatedProfiles
      });
    }
  };
  
  const setCurrentProfileById = (id: number) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setCurrentUser(profile);
      localStorage.setItem('currentProfileId', id.toString());
    }
  };
  
  const updateProfileAvatar = (profileId: number, avatarUrl: string) => {
    const updatedProfiles = profiles.map(profile => 
      profile.id === profileId ? { ...profile, avatar: avatarUrl } : profile
    );
    
    setProfiles(updatedProfiles);
    
    if (currentUser?.id === profileId) {
      setCurrentUser({ ...currentUser, avatar: avatarUrl });
    }
    
    if (user) {
      setUser({
        ...user,
        profiles: updatedProfiles
      });
    }
  };
  
  // If we don't have a real user yet (during development), create a mock one
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isAuthenticated) {
      const mockProfiles = [
        { id: 1, name: "John", avatar: profileAvatars.john },
        { id: 2, name: "Sarah", avatar: profileAvatars.sarah },
        { id: 3, name: "Michael", avatar: profileAvatars.michael },
        { id: 4, name: "Kids", avatar: profileAvatars.kids },
      ];
      
      setProfiles(mockProfiles);
      setUser({
        id: 1,
        email: "user@example.com",
        profiles: mockProfiles
      });
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);
  
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      currentUser,
      profiles,
      login,
      signup,
      logout,
      addProfile,
      deleteProfile,
      setCurrentProfile: setCurrentProfileById,
      updateProfileAvatar
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
