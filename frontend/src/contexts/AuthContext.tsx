import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiLogin, apiCheckLoggedIn, apiLogout, initializeAuth } from "../services/api";

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await apiCheckLoggedIn();
      
      // Handle the response from apiCheckLoggedIn
      setIsAuthenticated(response.success);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiLogin(username, password);
      
      if (response.success) {
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "Welcome to admin dashboard!",
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await apiLogout();
      setIsAuthenticated(false);
      
      toast({
        title: "Logged Out",
        description: response.message || "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout API fails, update local state
      setIsAuthenticated(false);
      toast({
        title: "Logged Out",
        description: "You have been logged out",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
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