import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  addToFavorites: (artifactId: string) => Promise<void>;
  removeFromFavorites: (artifactId: string) => Promise<void>;
  addToHistory: (artifactId: string) => Promise<void>;
  favorites: string[];
  history: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  // Check if user is admin
  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (!error && data) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // Fetch favorites
  const fetchFavorites = async (userId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .select('artifact_id')
      .eq('user_id', userId);
    
    if (!error && data) {
      setFavorites(data.map(f => f.artifact_id));
    }
  };

  // Fetch history
  const fetchHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from('history')
      .select('artifact_id')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(50);
    
    if (!error && data) {
      setHistory(data.map(h => h.artifact_id));
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout
          setTimeout(() => {
            fetchProfile(session.user.id);
            checkAdminRole(session.user.id);
            fetchFavorites(session.user.id);
            fetchHistory(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setFavorites([]);
          setHistory([]);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        checkAdminRole(session.user.id);
        fetchFavorites(session.user.id);
        fetchHistory(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string): Promise<{ error: string | null }> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name: name || email.split('@')[0] }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { error: 'This email is already registered. Please sign in instead.' };
      }
      return { error: error.message };
    }
    
    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password. Please try again.' };
      }
      return { error: error.message };
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setFavorites([]);
    setHistory([]);
  };

  const addToFavorites = async (artifactId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, artifact_id: artifactId });
    
    if (!error) {
      setFavorites(prev => [...prev, artifactId]);
    }
  };

  const removeFromFavorites = async (artifactId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('artifact_id', artifactId);
    
    if (!error) {
      setFavorites(prev => prev.filter(id => id !== artifactId));
    }
  };

  const addToHistory = async (artifactId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('history')
      .insert({ user_id: user.id, artifact_id: artifactId });
    
    if (!error && !history.includes(artifactId)) {
      setHistory(prev => [artifactId, ...prev].slice(0, 50));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isAuthenticated: !!user,
      isAdmin,
      isLoading,
      signUp,
      signIn,
      signOut,
      addToFavorites,
      removeFromFavorites,
      addToHistory,
      favorites,
      history,
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
