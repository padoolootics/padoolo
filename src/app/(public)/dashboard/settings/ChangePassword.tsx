"use client";

import React, { useState } from "react";
import { toast } from "react-toastify"; // For displaying success/error messages
import { useAuth } from "@/lib/Contexts/AuthContext"; // Custom AuthContext for getting user details

const ChangePassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user, logout } = useAuth(); // Retrieve logged-in user data

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side check for matching new password and confirm password
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Check for empty password fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          userId: user?.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Password changed successfully!");
        // Clear form fields
        setCurrentPassword("");
        // logout user after password change for security
        logout();
      } else {
        toast.error(result.message || "Failed to change password!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          id="current_password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          id="new_password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirm_password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto cursor-pointer px-6 py-3 text-white bg-yellow-600 hover:bg-yellow-500 rounded-md shadow-md"
      >
        {loading ? "Processing..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePassword;
