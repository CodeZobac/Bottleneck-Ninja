import NextAuth from "next-auth";
import { SupabaseAdapter } from "../../../lib/database/supabaseAdapter";
import GoogleProvider from "next-auth/providers/google";

// Configure your authentication providers
const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
];

export default NextAuth({
  providers,
  adapter: SupabaseAdapter(),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
