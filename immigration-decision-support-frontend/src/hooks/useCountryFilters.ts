import { useState, useMemo } from "react";
import type {
  Country,
  CountryFilters,
  SortDirection,
  SortField,
} from "../types";

const DEFAULT_FILTERS: CountryFilters = {
  sortBy: "overallRating",
  direction: "desc",
};

export function useCountryFilters(countries: Country[]) {
  const [filters, setFilters] = useState<CountryFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let result = [...countries];

    if (filters.region) {
      result = result.filter((c) => c.region === filters.region);
    }
    if (filters.climate) {
      result = result.filter((c) => c.climate === filters.climate);
    }
    if (filters.isNearOceanSea !== undefined) {
      result = result.filter(
        (c) => c.isNearOceanSea === filters.isNearOceanSea,
      );
    }

    result.sort((a, b) => {
      const field = filters.sortBy as keyof Country;
      const av = (a[field] ?? 0) as number;
      const bv = (b[field] ?? 0) as number;
      return filters.direction === "desc" ? bv - av : av - bv;
    });

    return result;
  }, [countries, filters]);

  const setSort = (sortBy: SortField, direction: SortDirection) =>
    setFilters((f) => ({ ...f, sortBy, direction }));

  const setFilter = (
    key: keyof CountryFilters,
    value: CountryFilters[keyof CountryFilters],
  ) => setFilters((f) => ({ ...f, [key]: value }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return { filters, filtered, setSort, setFilter, resetFilters };
}
