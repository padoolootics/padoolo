import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    image: string;
    phone: string;
    email: string;
    apiToken: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      image: any;
      phone: string;
      email: string;
      apiToken: string;
      accessToken?: string;
    };
    // apiToken: string;
  }

  interface JWT {
    apiToken: string; // Add apiToken to the JWT token
  }
}