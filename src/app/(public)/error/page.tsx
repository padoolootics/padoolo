"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let message = "Something went wrong.";

  if (error === "account_exists_credentials") {
    message = "This email is already registered using Email & Password. Please log in with your credentials instead of Google.";
  } else if (error === "account_exists_google") {
    message = "This email is already registered with Google. Please continue with Google login.";
  }

  return (
    <div>
      <h1>Login Error</h1>
      <p>{message}</p>
    </div>
  );
}
