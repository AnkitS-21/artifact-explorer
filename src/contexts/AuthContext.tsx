import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/museum';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  addToFavorites: (artifactId: string) => void;
  removeFromFavorites: (artifactId: string) => void;
  addToHistory: (artifactId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, isAdmin?: boolean): Promise<boolean> => {
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password.length >= 6) {
      setUser({
        id: '1',
        email,
        name: email.split('@')[0],
        role: isAdmin ? 'admin' : 'visitor',
        favorites: [],
        history: [],
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addToFavorites = (artifactId: string) => {
    if (user && !user.favorites.includes(artifactId)) {
      setUser({ ...user, favorites: [...user.favorites, artifactId] });
    }
  };

  const removeFromFavorites = (artifactId: string) => {
    if (user) {
      setUser({ ...user, favorites: user.favorites.filter(id => id !== artifactId) });
    }
  };

  const addToHistory = (artifactId: string) => {
    if (user && !user.history.includes(artifactId)) {
      setUser({ ...user, history: [artifactId, ...user.history].slice(0, 50) });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      addToFavorites,
      removeFromFavorites,
      addToHistory,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
