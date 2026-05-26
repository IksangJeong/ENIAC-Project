import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Admin identifiers (emails or GitHub usernames)
const ADMIN_IDENTIFIERS = ["seru1027", "IksangJeong", "admin@eniac.com", "sch@example.com"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login, // GitHub username
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }: any) {
      if (user) {
        // user.login is available because we added it in the profile() mapping above
        const identifier = (user as any).login || user.email;
        token.role = ADMIN_IDENTIFIERS.includes(identifier) ? "admin" : "member";
        token.login = (user as any).login;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).login = token.login;
      }
      return session;
    },
  },
});
