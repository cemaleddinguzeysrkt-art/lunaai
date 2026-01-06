// src/types/next-auth.d.ts  (or /types, but MUST be included by tsconfig)
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    email: string;
    role: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: string;
  }
}
