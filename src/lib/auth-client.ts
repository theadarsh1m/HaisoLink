import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  user: {
    fields: {
      name: "fullName",
      image: "profileImage",
    },
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;
