"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function GoogleSignInButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="w-full flex items-center justify-center gap-2 mt-6 cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Image src="/google.png" width={40} height={40} alt="Google" className="w-5 h-5 mr-2" />
      Sign in with Google
    </button>
  );
}