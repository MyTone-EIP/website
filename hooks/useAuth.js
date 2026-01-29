import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

/**
 * Hook pour gérer l'authentification et les tokens JWT
 */
export function useAuth() {
  const { data: session, status } = useSession();

  const login = useCallback(async (identifier, password) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  const getAccessToken = useCallback(() => {
    return session?.accessToken || null;
  }, [session]);

  const getRefreshToken = useCallback(() => {
    return session?.refreshToken || null;
  }, [session]);

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user || null,
    login,
    logout,
    getAccessToken,
    getRefreshToken,
  };
}
