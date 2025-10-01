"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Dashboard/Breadcrumb";
import Sidebar from "@/components/Dashboard/Sidebar";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/Contexts/AuthContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log("Auth state:", { isAuthenticated, user, session, status });

  // Check authentication status
  useEffect(() => {
    // If either auth method is authenticated, allow access
    if (isAuthenticated || status === "authenticated") {
      console.log("User is authenticated via", isAuthenticated ? "AuthContext" : "NextAuth");
      setAuthChecked(true);
      return;
    }

    // If both auth methods have definitely failed, redirect
    if (status === "unauthenticated" && !isAuthenticated) {
      console.log("User is not authenticated, redirecting to login");
      setAuthChecked(true);
      router.push("/login");
    }
  }, [isAuthenticated, status, router]);

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
          <p className="text-sm text-gray-500">
            Status: {status}, Auth: {isAuthenticated ? "true" : "false"}
          </p>
        </div>
      </div>
    );
  }

  // Final check before rendering
  const isUserAuthenticated = isAuthenticated || status === "authenticated";
  
  if (!isUserAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p>You must be logged in to view this page.</p>
          <p>Redirecting to login...</p>
          <p className="text-sm">Status: {status}, Auth: {isAuthenticated ? "true" : "false"}</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render the dashboard
  return (
    <div className="bg-gray-100 h-full lg:min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Hamburger Button */}
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md bg-white shadow"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="lg:flex xl:flex gap-6">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } lg:block w-full lg:w-auto`}
          >
            <Sidebar />
          </div>

          {/* Main content */}
          <main className="flex-1 p-0 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}