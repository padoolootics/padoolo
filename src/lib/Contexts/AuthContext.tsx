"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import AuthServices from "../api/services/AuthServices";
import { UserResponse } from "../api/types";
import { setAuthToken } from "../api/services/httpServices";
import { clearLocalCart } from "../hooks/localCart";
import { signIn, signOut, useSession } from "next-auth/react";

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Use NextAuth session
  const { data: session, status } = useSession();

  // Sync NextAuth session with your AuthContext
  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "authenticated" && session) {
      // Extract data from NextAuth session
      const extendedSession = session as any;
      const wpToken = extendedSession.wpToken;
      const userData = extendedSession.user;

      // console.log("Authenticated session:******* session extendedSession", extendedSession);
      
      if (wpToken) {
        setToken(wpToken);
        setAuthToken(wpToken);
        
        // Create a UserResponse object from session data
        const userResponse: UserResponse = {
          id: extendedSession.userId || '',
          email: userData.email || '',
          name: userData.name || '',
          username: "",
          role: ""
        };

        
        
        setUser(userResponse);
        
        // Store in localStorage for consistency
        localStorage.setItem("user", JSON.stringify(userResponse));
        localStorage.setItem("token", wpToken);
      }
    } else if (status === "unauthenticated") {
      // Clear auth state if not authenticated
      setUser(null);
      setToken(null);
      setAuthToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    
    setIsLoading(false);
  }, [session, status]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For credentials login, use NextAuth's signIn instead of direct API call
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login failed", result.error);
        return false;
      }

      // The session will be updated automatically by NextAuth
      // which will trigger our useEffect to update the context state
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear local state first
      setUser(null);
      setToken(null);
      setAuthToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("wpToken");

      // Sign out from NextAuth
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: manual redirect
      router.push("/login");
    }
  };

  const isAuthenticated = !!token || status === "authenticated";

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        isAuthenticated,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};