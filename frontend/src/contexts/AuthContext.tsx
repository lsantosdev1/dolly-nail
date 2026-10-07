import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types/index";
import { api } from "../services/api";
import type { ReactNode } from "react";
interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("@dolly_nail:user");
    const storedToken = localStorage.getItem("@dolly_nail:token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const response = await api.post("/auth/login", { email, password: pass });
    const { user: userData, token } = response.data;

    localStorage.setItem("@dolly_nail:token", token);
    localStorage.setItem("@dolly_nail:user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("@dolly_nail:token");
    localStorage.removeItem("@dolly_nail:user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
