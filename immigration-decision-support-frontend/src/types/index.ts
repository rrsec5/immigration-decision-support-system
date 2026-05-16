// ── Auth ────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  profileComplete: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ── Reference data ───────────────────────────────────────────────────────────
export interface Language {
  id: number;
  name: string;
}

export interface Profession {
  id: number;
  name: string;
}

export interface FinancialLevel {
  id: number;
  level: number;
  amount: number;
}

// ── User ─────────────────────────────────────────────────────────────────────
export type Climate = "cold" | "moderate" | "warm" | "any";
export type OceanSeaPref = "yes" | "no" | "any";
export type Region =
  | "Europe"
  | "Asia"
  | "North_America"
  | "South_America"
  | "Australia"
  | "any";
export type MigrationGoal = "work" | "study" | "living";
export type HealthState = "healthy" | "minor_issues" | "serious_conditions";
export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface LanguageSkillResponse {
  languageId: number;
  languageName: string;
  level: LanguageLevel;
}

export interface UserProfile {
  id: number;
  email: string;
  financialLevelId: number | null;
  financialLevelAmount: number | null;
  professionId: number | null;
  professionName: string | null;
  workExperience: number | null;
  familyMembers: number | null;
  preferredClimate: Climate | null;
  preferredOceanSea: OceanSeaPref | null;
  preferredRegion: Region | null;
  migrationGoal: MigrationGoal | null;
  stateOfHealth: HealthState | null;
  languageSkills: LanguageSkillResponse[];
}

export interface LanguageSkillDto {
  languageId: number;
  level: LanguageLevel;
}

export interface UserProfileRequest {
  financialLevelId: number;
  professionId: number;
  workExperience: number;
  familyMembers: number;
  preferredClimate: Climate;
  preferredOceanSea: OceanSeaPref;
  preferredRegion: Region;
  migrationGoal: MigrationGoal;
  stateOfHealth: HealthState;
  languageSkills: LanguageSkillDto[];
}

// ── Country ───────────────────────────────────────────────────────────────────
export interface Country {
  id: number;
  name: string;
  shortName: string;
  region: string;
  overallRating: number | null;
  userRating: number | null;
  costOfLiving: number;
  economyIndex: number;
  qualityOfLife: number;
  climate: string;
  isNearOceanSea: boolean;
  safetyLevel: number;
  educationLevel: number;
  healthcareLevel: number;
  employmentOpportunities: number;
  immigrationPolicy: number;
  socialInstitutions: number;
  primaryLanguageId: number;
  primaryLanguageName: string;
  secondaryLanguageId: number | null;
  secondaryLanguageName: string | null;
}

// ── Review ────────────────────────────────────────────────────────────────────
export interface Review {
  userId: number;
  countryId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment?: string;
}

// ── Recommendations ───────────────────────────────────────────────────────────
export interface RecommendationDto {
  recommendationId: number;
  userId: number;
  countryId: number;
  countryName: string;
  shortCountryName: string;
  region: string;
  score: number;
  createdAt: string;
}

export interface RecommendationSession {
  createdAt: string;
  rankings: RecommendationDto[];
}

// ── Sort / Filter ─────────────────────────────────────────────────────────────
export type SortField =
  | "overallRating"
  | "userRating"
  | "costOfLiving"
  | "safetyLevel"
  | "qualityOfLife"
  | "educationLevel"
  | "healthcareLevel"
  | "employmentOpportunities"
  | "immigrationPolicy";

export type SortDirection = "asc" | "desc";

export interface CountryFilters {
  region?: string;
  climate?: string;
  isNearOceanSea?: boolean;
  sortBy: SortField;
  direction: SortDirection;
}
