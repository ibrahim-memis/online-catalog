import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { getCurrentUser, setCurrentUser } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const value = {
    user,
    login: (newUser: User) => setUser(newUser),
    logout: () => setUser(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}