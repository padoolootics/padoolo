"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  let message = "Something went wrong while logging in.";

  if (error === "account_exists_credentials") {
    message =
      "This email is already registered with Email & Password. Please log in with your credentials.";
  } else if (error === "account_exists_google") {
    message =
      "This email is already registered with Google. Please continue with Google login.";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold text-gray-600 mb-4">Login Error!</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 rounded-lg bg-yellow-600 cursor-pointer text-white font-medium hover:bg-yellow-700 transition"
        >
          Go back to Login
        </button>
      </div>
    </div>
  );
}
