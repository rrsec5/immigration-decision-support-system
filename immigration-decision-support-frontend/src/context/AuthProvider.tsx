import { useCallback, useEffect, useState, type ReactNode } from "react";

import { type AuthState, AuthContext } from "./AuthContext";
import { authApi } from "../api/auth";
import type { LoginRequest, RegisterRequest } from "../types";
import { toast } from "sonner";
import { ApiError } from "../api/client";

function readStorage(): AuthState {
  return {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId")
      ? Number(localStorage.getItem("userId"))
      : null,
    email: localStorage.getItem("email"),
    profileComplete: localStorage.getItem("profileComplete") === "true",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(readStorage);

  const isLoggedIn = Boolean(auth.token);

  const persist = useCallback((state: AuthState) => {
    if (state.token) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("userId", String(state.userId));
      localStorage.setItem("email", state.email ?? "");
      localStorage.setItem("profileComplete", String(state.profileComplete));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("profileComplete");
    }

    setAuth(state);
  }, []);

  const register = useCallback(
    async (data: RegisterRequest) => {
      const res = await authApi.register(data);
      persist({
        token: res.token,
        userId: res.userId,
        email: res.email,
        profileComplete: res.profileComplete,
      });
      return res;
    },
    [persist],
  );

  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        const res = await authApi.login(data);
        persist({
          token: res.token,
          userId: res.userId,
          email: res.email,
          profileComplete: res.profileComplete,
        });
        return res;
      } catch (err) {
        if (
          err instanceof ApiError &&
          (err.status === 401 || err.status === 403)
        ) {
          throw new Error("Invalid email or password", { cause: err });
        }

        throw err;
      }
    },
    [persist],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* stateless — ignore */
    }

    persist({
      token: null,
      userId: null,
      email: null,
      profileComplete: false,
    });

    toast.success("Logged out successfully");
  }, [persist]);

  const markProfileComplete = useCallback(() => {
    persist({
      ...auth,
      profileComplete: true,
    });
  }, [auth, persist]);

  useEffect(() => {
    const handler = () => setAuth(readStorage());

    window.addEventListener("storage", handler);

    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        isLoggedIn,
        register,
        login,
        logout,
        markProfileComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
