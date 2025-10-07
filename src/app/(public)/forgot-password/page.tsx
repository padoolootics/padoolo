"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import the useRouter hook

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1); // Track the step (1: email, 2: OTP, 3: set password)

  const router = useRouter(); // Initialize the router for navigation

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setError(null);
    setSuccessMessage(null);
    setOtpError("");

    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Make a POST request to request a password reset
      const response = await fetch(
        "https://api.padoolo.com/wp-json/bdpwr/v1/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          "Password reset link has been sent to your email. Please enter the OTP here."
        );
        setStep(2); // Go to OTP step
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setOtpError("");
    setError(null);
    setSuccessMessage(null);

    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      // Step 2: Verify OTP
      const response = await fetch(
        "https://api.padoolo.com/wp-json/bdpwr/v1/validate-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code: otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          "OTP verified successfully. You can now set your new password."
        );
        setStep(3); // Go to Set Password step
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password !== confirmPassword) {
      setError("Passwords do not match or are empty. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Step 3: Set the new password
      const response = await fetch(
        "https://api.padoolo.com/wp-json/bdpwr/v1/set-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, code: otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Your password has been successfully updated.");

        // Reset the form after password change
        setStep(1);
        setEmail("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");

        // Redirect to /login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Right Side Form */}
        <div className="flex-1 p-0 sm:px-6 sm:py-8">
          <div className="border rounded-lg border-gray-200 p-4 sm:p-8">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-left text-gray-800 mb-6">
                  Forgot Password
                </h2>
                {error && (
                  <div className="text-red-500 text-sm text-left mb-4">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-sm text-left mb-4">
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handleEmailSubmit} className="space-y-6">
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

                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="spinner-border animate-spin border-t-2 border-yellow-600 w-6 h-6 border-solid rounded-full"></div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-[#D99E46] cursor-pointer text-white py-2 rounded-md hover:bg-[#D99E46] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                    >
                      Reset Password
                    </button>
                  )}
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don{"'"}t have an account?{" "}
                  <a href="/register" className="text-blue-600 hover:underline">
                    Sign up
                  </a>
                  , Login Account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Login
                  </a>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-left text-gray-800 mb-6">
                  Enter OTP
                </h2>
                {error && (
                  <div className="text-red-500 text-sm text-left mb-4">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-sm text-left mb-4">
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      OTP
                    </label>
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter the OTP sent to your email"
                      className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        otpError ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {otpError && (
                      <p className="text-red-500 text-sm mt-1">{otpError}</p>
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
                      Verify OTP
                    </button>
                  )}
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don{"'"}t have an account?{" "}
                  <a href="/register" className="text-blue-600 hover:underline">
                    Sign up
                  </a>
                  , Login Account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Login
                  </a>
                </p>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold text-left text-gray-800 mb-6">
                  Set New Password
                </h2>
                {error && (
                  <div className="text-red-500 text-sm text-left mb-4">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-sm text-left mb-4">
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                      Set Password
                    </button>
                  )}
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don{"'"}t have an account?{" "}
                  <a href="/register" className="text-blue-600 hover:underline">
                    Sign up
                  </a>
                  , Login Account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Login
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
