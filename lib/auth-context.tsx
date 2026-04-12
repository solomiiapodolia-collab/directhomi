"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, Seeker, Owner, Admin, UserRole } from "./types";
import { mockSeekers, mockOwners } from "./mock-data";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerSeeker: (data: Partial<Seeker>) => Promise<boolean>;
  registerOwner: (data: Partial<Owner>) => Promise<boolean>;
  switchRole: (role: UserRole) => void; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Check seekers first
    const seeker = mockSeekers.find((s) => s.email === email);
    if (seeker) {
      setUser(seeker);
      setIsLoading(false);
      return true;
    }
    
    // Check owners
    const owner = mockOwners.find((o) => o.email === email);
    if (owner) {
      setUser(owner);
      setIsLoading(false);
      return true;
    }
    
    // Demo: accept any email for testing
    const demoSeeker: Seeker = {
      id: "demo-user",
      email,
      phone: "+380501234567",
      firstName: "Демо",
      lastName: "Користувач",
      role: "seeker",
      createdAt: new Date(),
      subscription: "free",
      applicationsToday: 0,
      savedListings: [],
    };
    setUser(demoSeeker);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const registerSeeker = useCallback(async (data: Partial<Seeker>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newSeeker: Seeker = {
      id: `seeker-${Date.now()}`,
      email: data.email || "",
      phone: data.phone || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      role: "seeker",
      createdAt: new Date(),
      subscription: "free",
      applicationsToday: 0,
      savedListings: [],
    };
    
    setUser(newSeeker);
    setIsLoading(false);
    return true;
  }, []);

  const registerOwner = useCallback(async (data: Partial<Owner>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newOwner: Owner = {
      id: `owner-${Date.now()}`,
      email: data.email || "",
      phone: data.phone || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      role: "owner",
      createdAt: new Date(),
      verificationStatus: "unverified",
      listingsCount: 0,
      moderatedListingsCount: 0,
      responseRate: 0,
      visibilityPenalty: false,
    };
    
    setUser(newOwner);
    setIsLoading(false);
    return true;
  }, []);

  // For demo purposes - switch between different user roles
  const switchRole = useCallback((role: UserRole) => {
    switch (role) {
      case "seeker":
        setUser(mockSeekers[0]);
        break;
      case "owner":
        setUser(mockOwners[0]);
        break;
      case "admin":
        const admin: Admin = {
          id: "admin-1",
          email: "admin@directhomi.ua",
          phone: "+380501111111",
          firstName: "Адмін",
          lastName: "Системи",
          role: "admin",
          createdAt: new Date(),
          permissions: ["moderate_listings", "moderate_users", "view_complaints", "manage_users"],
        };
        setUser(admin);
        break;
      default:
        setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        registerSeeker,
        registerOwner,
        switchRole,
      }}
    >
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
