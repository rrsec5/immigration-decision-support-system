import client from "./client";
import type {
  RecommendationDto,
  RecommendationSession,
  SortDirection,
} from "../types";

export const recommendationsApi = {
  generate: () =>
    client
      .post<RecommendationDto[]>("/recommendations/generate")
      .then((r) => r.data),

  getSessions: () =>
    client.get<string[]>("/recommendations/sessions").then((r) => r.data),

  getLatestSession: (sortBy = "score", direction: SortDirection = "desc") =>
    client
      .get<RecommendationSession>("/recommendations/sessions/latest", {
        params: { sortBy, direction },
      })
      .then((r) => r.data),

  getSession: (
    sessionTime: string,
    sortBy = "score",
    direction: SortDirection = "desc",
  ) =>
    client
      .get<RecommendationSession>(
        `/recommendations/sessions/${encodeURIComponent(sessionTime)}`,
        {
          params: { sortBy, direction },
        },
      )
      .then((r) => r.data),
};
