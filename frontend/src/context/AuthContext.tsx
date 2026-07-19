import { createContext } from "react";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types";

export interface AuthState {
  token: string | null;
  userId: number | null;
  email: string | null;
  profileComplete: boolean;
}

export interface AuthContextValue extends AuthState {
  isLoggedIn: boolean;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  markProfileComplete: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
