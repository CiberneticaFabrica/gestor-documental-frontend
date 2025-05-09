"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  id: string;
  username: string;
  nombre: string;
  apellidos: string;
  email: string;
  roles: { id_rol: string; nombre_rol: string }[];
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('session_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('session_token');
    setUser(null);
    setToken(null);
    window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
