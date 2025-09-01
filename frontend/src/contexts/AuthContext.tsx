import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthResponse, ApiResponse } from "../types/index";
import * as authApi from "../services/authApi";
import { socketService } from "../services/socketService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authApi
        .verifyToken()
        .then((response) => {
          if (response.success && response.data) {
            setUser(response.data.user);
            // Connect to WebSocket when user is authenticated
            socketService.connect(response.data.user._id);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    if (response.success && response.data) {
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      // Connect to WebSocket when user logs in
      socketService.connect(response.data.user._id);
    } else {
      throw new Error(response.message || "Login failed");
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await authApi.register(username, email, password);
    if (response.success && response.data) {
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      // Connect to WebSocket when user registers
      socketService.connect(response.data.user._id);
    } else {
      throw new Error(response.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    // Disconnect from WebSocket when user logs out
    socketService.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
