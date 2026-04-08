import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiRequest, TOKEN_KEY } from '@/lib/api';

interface User {
  id: string;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  isSignedIn: boolean;
  isLoaded: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        const userData = await apiRequest('/api/users/me');
        if (userData?.user) {
          setUser(userData.user);
        } else {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } finally {
      setIsLoaded(true);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.token && response.user) {
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
        setUser(response.user);
        return {};
      }
      return { error: 'Invalid login response' };
    } catch (error: any) {
      console.error('Sign-in failed:', error);
      return { error: error.message || 'Sign-in failed' };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await apiRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.doc) {
        // Automatically sign in after sign up
        return signIn(email, password);
      }
      return { error: 'Registration failed' };
    } catch (error: any) {
      console.error('Sign-up failed:', error);
      return { error: error.message || 'Sign-up failed' };
    }
  };

  const signOut = async () => {
    try {
      // Optional: call logout endpoint if Payload needs to invalidate session
      // await apiRequest('/api/users/logout', { method: 'POST' });
    } catch (error) {
      console.error('Sign-out API call failed:', error);
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn: !!user,
        isLoaded,
        user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Compatibility hook for Clerk's useUser
export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useAuth();
  return { user, isLoaded, isSignedIn };
};
