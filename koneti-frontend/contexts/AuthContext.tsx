"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";

interface Admin {
  _id: string;
  email: string;
  name?: string;
}

interface IAuthContext {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  user: Admin | null;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Admin | null>(null);

  const checkAuth = async () => {
    try {
      const res = await apiRequest('/admin/me');
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.admin || data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Greška pri proveri autentikacije:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiRequest('/admin/login', {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Sačuvaj token za mobilne uređaje
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        }
        
        setUser(data.admin || data);
        setIsAuthenticated(true);
        router.push("/admin"); // preusmeri na admin panel
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (err) {
      console.error("Greška prilikom logovanja:", err);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/admin/logout', {
        method: "POST",
      });
      
      // Ukloni token iz localStorage
      localStorage.removeItem('adminToken');
      
      setUser(null);
      setIsAuthenticated(false);
      router.push("/");
    } catch (err) {
      console.error("Greška prilikom logout-a:", err);
      // Ukloni token čak i ako logout zahtev ne uspe
      localStorage.removeItem('adminToken');
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, logout, checkAuth, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
