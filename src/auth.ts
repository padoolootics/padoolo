import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import { AuthOptions } from "next-auth/core/types";
import axios from "axios";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    authType?: "google" | "credentials";
    wooUserId?: number;
    wpToken?: string; // WordPress JWT token
    userId?: string; // Add userId to session
  }

  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    authType?: "google" | "credentials";
    wooUserId?: number;
    wpToken?: string; // WordPress JWT token
    wpTokenExpires?: number;
    userId?: string; // Add userId to JWT
  }

  interface User {
    id: string;
    email: string;
    name: string;
    authType?: "google" | "credentials";
    wooUserId?: number;
    wpToken?: string;
    userId?: string; // Add userId to User
  }
}

// API endpoint to check if user exists
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          // 1. First, try to get WordPress JWT token
          let wpToken = null;
          let userId = null;
          try {
            const wpTokenResponse = await axios.post(
              `${WORDPRESS_URL}/wp-json/jwt-auth/v1/token`,
              {
                username: credentials.email,
                password: credentials.password,
              }
            );
            wpToken = wpTokenResponse.data.token;
            userId = wpTokenResponse.data.user_id || wpTokenResponse.data.user?.id;
            console.log("WordPress userId:", userId);
          } catch (wpError: any) {
            console.error("WordPress JWT token generation failed:", wpError.response?.data || wpError.message);
            throw new Error("Invalid credentials");
          }

          // 2. Check if user exists in WooCommerce
          let wooUserId = null;
          try {
            const checkResponse = await axios.post(
              `${API_BASE_URL}/api/auth/check-user`,
              {
                email: credentials.email,
                authType: "credentials",
              }
            );

            if (checkResponse.data.exists) {
              if (checkResponse.data.authType !== "credentials") {
                throw new Error(`account_exists_${checkResponse.data.authType}`);
              }
              wooUserId = checkResponse.data.wooUserId;
            }
          } catch (error: any) {
            if (error.message?.startsWith('account_exists_')) {
              throw new Error(error.message);
            }
            console.warn("User check failed, proceeding with creation:", error);
          }

          // 3. If user doesn't exist in WooCommerce, create them
          if (!wooUserId) {
            try {
              // For credentials login, we need to get user info from WordPress
              const userInfoResponse = await axios.get(
                `${WORDPRESS_URL}/wp-json/wp/v2/users/me`,
                {
                  headers: {
                    Authorization: `Bearer ${wpToken}`
                  }
                }
              );

              const userInfo = userInfoResponse.data;
              
              const createResponse = await axios.post(
                `${API_BASE_URL}/api/auth/create-user`,
                {
                  email: credentials.email,
                  name: userInfo.name || userInfo.display_name || credentials.email,
                  password: credentials.password,
                  authType: "credentials",
                }
              );
              
              wooUserId = createResponse.data.wooUserId;
              console.log("User created in WooCommerce with ID:", wooUserId);
            } catch (createError) {
              console.error("Failed to create user in WooCommerce:", createError);
              // Continue without WooCommerce user ID
            }
          }

          // Return user object that will be encoded in the JWT
          const user: User = {
            id: userId?.toString() || credentials.email, // Use userId or fallback to email
            email: credentials.email,
            name: credentials.email, // You might want to get the actual name from WordPress
            authType: "credentials",
            wooUserId: wooUserId || undefined,
            wpToken: wpToken || undefined,
            userId: userId?.toString(), // Set userId explicitly
            image: '',
            phone: '',
            apiToken: '',
          };

          return user;
        } catch (error: any) {
          console.error("Credentials authorization failed:", error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google sign-ins
      if (account?.provider === "google") {
        try {
          // Check if user exists in WooCommerce
          const response = await axios.post(
            `${API_BASE_URL}/api/auth/check-user`,
            {
              email: user.email,
              authType: "google",
            }
          );

          const userData = response.data;

          if (userData.exists) {
            if (userData.authType !== "google") {
              // User exists but with different auth method
              throw new Error(`account_exists_${userData.authType}`);
            }
            // User exists with Google auth, allow sign in
            return true;
          }

          // User doesn't exist, allow sign in (will be created in WooCommerce)
          return true;
        } catch (error: any) {
          if (error.response?.data?.error) {
            // Forward specific error messages from backend
            console.error("SignIn error:", error.response.data.error);
            throw new Error(error.response.data.error);
          }
          if (error.message?.startsWith("account_exists_")) {
            console.error("SignIn error in here:", error.message);
            // Rethrow the account exists error
            throw new Error(error.message);
          }
          console.error("SignIn error:", error);
          return true;
        }
      }

      // For credentials provider, always allow sign in (errors are handled in authorize)
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log("User signed in:", user, "Account:", account);

        // Handle Google sign-in
        if (account.provider === "google") {
          try {
            // Check if user exists in WooCommerce and get their ID
            const checkResponse = await axios.post(
              `${API_BASE_URL}/api/auth/check-user`,
              {
                email: user.email,
                authType: "google",
              }
            );

            let wooUserId = checkResponse.data.wooUserId;
            let userPassword = checkResponse.data.password;

            // If user doesn't exist, create them in WooCommerce
            if (!wooUserId) {
              const createResponse = await axios.post(
                `${API_BASE_URL}/api/auth/create-user`,
                {
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  password: user.id, // Using Google ID as password
                  authType: "google",
                  googleId: user.id,
                }
              );
              wooUserId = createResponse.data.wooUserId;
              userPassword = createResponse.data.password;
            }

            let wpToken = null;
            let userId = null;

            // Generate WordPress JWT token using the Google ID as password
            try {
              const wpTokenResponse = await axios.post(
                `${WORDPRESS_URL}/wp-json/jwt-auth/v1/token`,
                {
                  username: user.email,
                  password: userPassword,
                }
              );

              wpToken = wpTokenResponse.data.token;
              userId = wpTokenResponse.data.user_id || wpTokenResponse.data.user?.id;
              console.log("Generated WordPress JWT token:", wpTokenResponse.data);
            } catch (wpError) {
              console.warn("Failed to generate WordPress JWT token:", wpError);
              // Continue without WP token
            }

            return {
              ...token,
              accessToken: account.access_token,
              accessTokenExpires: Date.now() + (Number(account.expires_in) || 3600) * 1000,
              authType: "google",
              wooUserId: wooUserId,
              wpToken: wpToken,
              wpTokenExpires: wpToken ? Date.now() + 24 * 60 * 60 * 1000 : undefined,
              userId: userId?.toString() || user.id, // Set userId from WordPress or use Google ID
            };
          } catch (error) {
            console.error("Error handling WooCommerce user:", error);
            // Still return basic token even if WooCommerce operations fail
            return {
              ...token,
              accessToken: account.access_token,
              accessTokenExpires: Date.now() + (Number(account.expires_in) || 3600) * 1000,
              authType: "google",
              userId: user.id, // At least set the Google ID
            };
          }
        }

        // Handle credentials sign-in
        if (account.provider === "credentials" && user) {
          const customUser = user as User;
          
          return {
            ...token,
            authType: "credentials",
            wooUserId: customUser.wooUserId,
            wpToken: customUser.wpToken,
            wpTokenExpires: customUser.wpToken ? Date.now() + 24 * 60 * 60 * 1000 : undefined,
            userId: customUser.userId || customUser.id, // Use userId or fallback to id
          };
        }
      }

      // Return previous token if the WordPress token has not expired yet
      if (
        typeof token.wpTokenExpires === "number" &&
        Date.now() < token.wpTokenExpires &&
        token.wpToken
      ) {
        return token;
      }

      // If token expired, just return it (no refresh logic)
      return token;
    },
    async session({ session, token }) {
       (session as any).accessToken = token.accessToken;
       (session as any).authType = token.authType;
       (session as any).wooUserId = token.wooUserId;
       (session as any).wpToken = token.wpToken;
       (session as any).userId = token.userId; // Add userId to session
      
      console.log("Session callback - User ID:", token.userId);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};