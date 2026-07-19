import client from "./client";
import type {
  Country,
  Review,
  ReviewRequest,
  SortDirection,
  SortField,
} from "../types";

export const countriesApi = {
  getAll: (
    sortBy: SortField = "overallRating",
    direction: SortDirection = "desc",
  ) =>
    client
      .get<Country[]>("/countries", { params: { sortBy, direction } })
      .then((r) => r.data),

  getById: (id: number) =>
    client.get<Country>(`/countries/${id}`).then((r) => r.data),

  getReviews: (
    countryId: number,
    sort: "newest" | "best" | "worst" = "newest",
  ) =>
    client
      .get<Review[]>(`/reviews/${countryId}`, { params: { sort } })
      .then((r) => r.data),

  addReview: (countryId: number, data: ReviewRequest) =>
    client.post<Review>(`/reviews/${countryId}`, data).then((r) => r.data),

  updateReview: (countryId: number, data: ReviewRequest) =>
    client.put<Review>(`/reviews/${countryId}`, data).then((r) => r.data),

  deleteReview: (countryId: number) => client.delete(`/reviews/${countryId}`),

  hasMyReview: (countryId: number) =>
    client.get<boolean>(`/reviews/${countryId}/my`).then((r) => r.data),
};
