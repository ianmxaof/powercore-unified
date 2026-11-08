"use client";

/**
 * User Context Provider
 * Manages global user authentication state
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { api, User } from "@/lib/api";

// ============================================================================
// Types
// ============================================================================

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  referralCode?: string;
}

interface UserProviderProps {
  children: ReactNode;
}

// ============================================================================
// Context
// ============================================================================

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await api.users.me();
        setUser(userData);
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem("auth_token");
        console.error("Failed to load user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { token, user: userData } = await api.auth.login({ email, password });
      localStorage.setItem("auth_token", token);
      setUser(userData);
    } catch (err: any) {
      const message = err?.message || "Login failed. Please try again.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { token, user: userData } = await api.auth.register(data);
      localStorage.setItem("auth_token", token);
      setUser(userData);
    } catch (err: any) {
      const message = err?.message || "Registration failed. Please try again.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await api.auth.logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // Update user profile
  const updateUser = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await api.users.update(data);
      setUser(updatedUser);
    } catch (err: any) {
      const message = err?.message || "Failed to update profile.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!user) return;

    try {
      const userData = await api.users.me();
      setUser(userData);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useUser(): UserContextType {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook that requires authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo = "/auth/login") {
  const { user, isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store intended destination
      sessionStorage.setItem("auth_redirect", window.location.pathname);
      window.location.href = redirectTo;
    }
  }, [isLoading, isAuthenticated, redirectTo]);

  return { user, isLoading, isAuthenticated };
}

/**
 * Hook to get user's credits balance
 */
export function useCredits() {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      setCredits(0);
      setIsLoading(false);
      return;
    }

    const loadCredits = async () => {
      try {
        const { balance } = await api.users.credits();
        setCredits(balance);
      } catch (err) {
        console.error("Failed to load credits:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCredits();
  }, [isAuthenticated]);

  return { credits, isLoading };
}

/**
 * Hook to check if user owns a specific item
 */
export function useOwnership(itemType: "agent" | "skill", itemId: string) {
  const [isOwned, setIsOwned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      setIsOwned(false);
      setIsLoading(false);
      return;
    }

    const checkOwnership = async () => {
      try {
        const items =
          itemType === "agent"
            ? await api.users.myAgents()
            : await api.users.mySkills();
        
        setIsOwned(items.some((item) => item.id === itemId));
      } catch (err) {
        console.error("Failed to check ownership:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkOwnership();
  }, [isAuthenticated, itemType, itemId]);

  return { isOwned, isLoading };
}
