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
    <div style={{ padding: "2rem" }}>
      <h1>Login Error!</h1>
      <p>{message}</p>
      <button onClick={() => router.push("/login")}>Go back to Login</button>
    </div>
  );
}