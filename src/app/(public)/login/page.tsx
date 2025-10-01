"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/Contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getLocalCart } from "@/lib/hooks/localCart";
import { useCartContext } from "@/lib/Contexts/CartContext";
import { signIn, useSession } from "next-auth/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const { syncLocalCartToWoo } = useCartContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // console.log("Session data:", session);

  useEffect(() => {
    if (status === "authenticated" && session) {
      // Handle successful Google authentication
      const user = session.user;
      const wpToken = (session as any).wpToken;
      const wooUserId = (session as any).wooUserId;

      // console.log("User signed in successfully with Google:", {
      //   user,
      //   wpToken,
      //   wooUserId,
      // });

      // Store tokens in localStorage for consistency
      if (wpToken) {
        localStorage.setItem("wpToken", wpToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Sync cart if needed
      const guestCart = getLocalCart();
      if (guestCart.length > 0) {
        syncLocalCartToWoo();
      }

      // Redirect to dashboard
      router.push("/dashboard");
    }
  }, [session, status, router, syncLocalCartToWoo]);

  const guestCart = getLocalCart();

  useEffect(() => {
    // If already logged in, redirect to home page
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Simple form validation
  const validateForm = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form before submission
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Use NextAuth credentials provider instead of custom login
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Handle specific error messages
        if (result.error.startsWith("account_exists_")) {
          const authType = result.error.replace("account_exists_", "");
          setError(
            `An account already exists with ${authType} authentication. Please use ${authType} login.`
          );
        } else {
          setError(result.error || "Invalid email or password");
        }
      } else {
        setSuccessMessage("Login successful! Redirecting to your dashboard...");

        // Sync cart if needed
        if (guestCart.length > 0) {
          await syncLocalCartToWoo();
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    signIn("google", {
      callbackUrl: "/dashboard", // Redirect after successful login
    });
  };

  // Show loading state for both credential and Google login
  if ( googleLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <ArrowPathIcon className="h-12 w-12 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-white h-full lg:min-h-screen">
      <div className="flex bg-white gap-6 p-8 rounded-lg w-full">
        {/* Left Side Illustration - visible only on desktop */}
        <div className="hidden lg:block flex-1 p-8">
          <Image
            src="/login-image.png"
            width={563}
            height={604}
            alt="Wishlist Illustration"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Login Form */}
        <div className="flex-1 p-0 sm:px-6 sm:py-8">
          <div className="border rounded-lg border-gray-200 p-4 sm:p-8">
            <h2 className="text-2xl font-bold text-left text-gray-800 mb-6">
              Welcome back!
            </h2>
            {error && (
              <div className="text-red-500 text-sm text-left mb-4">{error}</div>
            )}
            {successMessage && (
              <div className="text-green-500 text-sm text-left mb-4">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin border-t-2 border-yellow-600 w-6 h-6 border-solid rounded-full"></div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-[#D99E46] cursor-pointer text-white py-2 rounded-md hover:bg-[#D99E46] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  Log in
                </button>
              )}
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {googleLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <Image
                  src="/google.png"
                  width={40}
                  height={40}
                  alt="Google"
                  className="w-5 h-5"
                />
              )}
              Sign in with Google
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don{"'"}t have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
