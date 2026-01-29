import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email ou Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Identifiant et mot de passe requis");
        }

        try {
          // Appel à l'API backend pour authentifier l'utilisateur
          const response = await fetch("https://api-mytone.onrender.com/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              username: credentials.identifier,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Identifiant ou mot de passe incorrect");
          }

          const data = await response.json();

          // Récupérer les informations de l'utilisateur via le token
          const userResponse = await fetch("https://api-mytone.onrender.com/auth/me", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${data.access_token}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error("Impossible de récupérer les informations de l'utilisateur");
          }

          const user = await userResponse.json();

          return {
            id: user.id,
            email: user.email || null,
            name: user.name || user.username,
            username: user.username || null,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
        } catch (error) {
          throw new Error(error.message || "Erreur d'authentification");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login/user',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
