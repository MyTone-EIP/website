import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email ou Username", type: "text" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Identifiant et mot de passe requis");
        }

        try {
          // Préparer les données pour le backend avec URL encoding approprié
          const params = new URLSearchParams();
          params.append("username", credentials.identifier);
          params.append("password", credentials.password);

          // Appel à l'API backend pour authentifier l'utilisateur
          const response = await fetch("https://api-mytone.onrender.com/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(), // URLSearchParams encode automatiquement les caractères spéciaux
          });

          if (!response.ok) {
            let errorMessage = "Identifiant ou mot de passe incorrect";
            try {
              const error = await response.json();
              if (error.detail) {
                errorMessage = Array.isArray(error.detail) 
                  ? (error.detail[0]?.msg || error.detail[0]) 
                  : error.detail;
              } else if (error.error) {
                errorMessage = error.error;
              }
            } catch (e) {
              console.error("Erreur lors du parsing:", e);
            }
            throw new Error(errorMessage);
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
          console.error("Auth error:", error);
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
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.name = token.name;
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
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
