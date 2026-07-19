import client from "./client";
import type {
  FinancialLevel,
  Language,
  Profession,
  UserProfile,
  UserProfileRequest,
} from "../types";

export const usersApi = {
  getMe: () => client.get<UserProfile>("/users/me").then((r) => r.data),

  updateProfile: (data: UserProfileRequest) =>
    client.put<UserProfile>("/users/me/profile", data).then((r) => r.data),

  getLanguages: () => client.get<Language[]>("/languages").then((r) => r.data),

  getProfessions: () =>
    client.get<Profession[]>("/professions").then((r) => r.data),

  getFinancialLevels: () =>
    client.get<FinancialLevel[]>("/financial-levels").then((r) => r.data),
};
