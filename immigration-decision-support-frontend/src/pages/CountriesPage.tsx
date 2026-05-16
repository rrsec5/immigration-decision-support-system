import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { countriesApi } from "../api/countries";
import { useCountryFilters } from "../hooks/useCountryFilters";
import { ScoreBadge } from "../components/ui/ScoreBadge";
import { EmptyState } from "../components/ui/EmptyState";
import { formatCost, regionLabel, climateEmoji } from "../utils/format";
import type { Country, SortField } from "../types";
import {
  RiSearchLine,
  RiFilterLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiGlobeLine,
} from "react-icons/ri";
import { toast } from "sonner";

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "overallRating", label: "Overall Rating" },
  { value: "userRating", label: "User Rating" },
  { value: "qualityOfLife", label: "Quality of Life" },
  { value: "safetyLevel", label: "Safety" },
  { value: "educationLevel", label: "Education" },
  { value: "healthcareLevel", label: "Healthcare" },
  { value: "employmentOpportunities", label: "Employment" },
  { value: "immigrationPolicy", label: "Immigration Policy" },
  { value: "costOfLiving", label: "Cost of Living" },
];

const REGIONS = [
  "Europe",
  "Asia",
  "North America",
  "South America",
  "Australia",
];
const CLIMATES = ["cold", "moderate", "warm"];

function SkeletonRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.25rem",
      }}
    >
      <div className="shimmer-box" style={{ width: "28px", height: "20px" }} />
      <div className="shimmer-box" style={{ flex: 1, height: "20px" }} />
      <div className="shimmer-box" style={{ width: "80px", height: "20px" }} />
      <div className="shimmer-box" style={{ width: "60px", height: "20px" }} />
    </div>
  );
}

export function CountriesPage() {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { filters, filtered, setSort, setFilter, resetFilters } =
    useCountryFilters(allCountries);

  useEffect(() => {
    countriesApi
      .getAll("overallRating", "desc")
      .then(setAllCountries)
      .catch(() => toast.error("Failed to load countries"))
      .finally(() => setLoading(false));
  }, []);

  const displayed = search
    ? filtered.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      )
    : filtered;

  const hasFilters =
    filters.region || filters.climate || filters.isNearOceanSea !== undefined;

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--color-slate-200)",
            margin: "0 0 0.375rem",
            letterSpacing: "-0.03em",
          }}
        >
          Country Rankings
        </h1>
        <p
          style={{
            color: "var(--color-slate-400)",
            fontSize: "0.9rem",
            margin: 0,
          }}
        >
          Explore {allCountries.length} countries ranked by overall quality. Log
          in to get your personalised list.
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "180px" }}>
          <RiSearchLine
            size={15}
            style={{
              position: "absolute",
              left: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-ink-500)",
              pointerEvents: "none",
            }}
          />
          <input
            className="input-field"
            style={{ paddingLeft: "2.25rem" }}
            placeholder="Search countries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort */}
        <select
          className="select-field"
          style={{ width: "auto" }}
          value={filters.sortBy}
          onChange={(e) =>
            setSort(e.target.value as SortField, filters.direction)
          }
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Direction toggle */}
        <button
          className="btn-ghost"
          onClick={() =>
            setSort(
              filters.sortBy,
              filters.direction === "desc" ? "asc" : "desc",
            )
          }
          title={filters.direction === "desc" ? "Descending" : "Ascending"}
        >
          {filters.direction === "desc" ? (
            <RiArrowDownLine size={16} />
          ) : (
            <RiArrowUpLine size={16} />
          )}
        </button>

        {/* Filter toggle */}
        <button
          className={showFilters ? "btn-primary" : "btn-ghost"}
          onClick={() => setShowFilters((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
        >
          <RiFilterLine size={15} />
          Filters
          {hasFilters && (
            <span
              style={{
                background: showFilters
                  ? "var(--color-ink-950)"
                  : "var(--color-amber-400)",
                color: showFilters
                  ? "var(--color-amber-300)"
                  : "var(--color-ink-950)",
                borderRadius: "9999px",
                width: "18px",
                height: "18px",
                fontSize: "0.7rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                lineHeight: 1,
              }}
            >
              !
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="card"
          style={{
            padding: "1.25rem",
            marginBottom: "1rem",
            display: "flex",
            gap: "1.25rem",
            flexWrap: "wrap",
            alignItems: "flex-end",
            animation: "fadeIn 0.2s ease forwards",
          }}
        >
          <div style={{ minWidth: "140px" }}>
            <label className="label">Region</label>
            <select
              className="select-field"
              value={filters.region ?? ""}
              onChange={(e) =>
                setFilter("region", regionLabel(e.target.value) || undefined)
              }
            >
              <option value="">All regions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: "130px" }}>
            <label className="label">Climate</label>
            <select
              className="select-field"
              value={filters.climate ?? ""}
              onChange={(e) =>
                setFilter("climate", e.target.value || undefined)
              }
            >
              <option value="">All climates</option>
              {CLIMATES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: "130px" }}>
            <label className="label">Near Ocean/Sea</label>
            <select
              className="select-field"
              value={
                filters.isNearOceanSea === undefined
                  ? ""
                  : String(filters.isNearOceanSea)
              }
              onChange={(e) =>
                setFilter(
                  "isNearOceanSea",
                  e.target.value === "" ? undefined : e.target.value === "true",
                )
              }
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          {hasFilters && (
            <button
              className="btn-ghost"
              onClick={resetFilters}
              style={{ marginBottom: "2px" }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.5rem 1fr auto auto auto auto",
            gap: "1rem",
            padding: "0.75rem 1.25rem",
            borderBottom: "1px solid var(--color-ink-700)",
            fontSize: "0.7rem",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "var(--color-slate-400)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <span>#</span>
          <span>Country</span>
          <span style={{ textAlign: "right" }}>Overall</span>
          <span style={{ textAlign: "right" }}>Users</span>
          <span style={{ textAlign: "right" }}>Cost/mo</span>
          <span style={{ textAlign: "right" }}>Climate</span>
        </div>

        {loading ? (
          Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
        ) : displayed.length === 0 ? (
          <EmptyState
            icon={<RiGlobeLine />}
            title="No countries match your search"
            description="Try adjusting your filters or search query."
            action={
              <button
                className="btn-ghost"
                onClick={() => {
                  setSearch("");
                  resetFilters();
                }}
              >
                Reset all
              </button>
            }
          />
        ) : (
          displayed.map((country, i) => (
            <Link
              key={country.id}
              to={`/countries/${country.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5rem 1fr auto auto auto auto",
                  gap: "1rem",
                  padding: "0.875rem 1.25rem",
                  borderBottom: "1px solid var(--color-ink-800)",
                  alignItems: "center",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "var(--color-ink-800)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Rank */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--color-ink-500)",
                    fontWeight: 500,
                  }}
                >
                  {i + 1}
                </span>

                {/* Name + region */}
                <div>
                  <span
                    className={`fi fi-${country.shortName}`}
                    style={{
                      width: "22px",
                      height: "16px",
                      display: "inline-block",
                      borderRadius: "2px",
                    }}
                  />{" "}
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "var(--color-slate-200)",
                    }}
                  >
                    {country.name}
                  </span>
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      fontSize: "0.75rem",
                      color: "var(--color-ink-500)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {regionLabel(country.region)}
                  </span>
                </div>

                {/* Overall */}
                <ScoreBadge score={country.overallRating} size="sm" />

                {/* User rating */}
                <ScoreBadge
                  score={
                    country.userRating && country.userRating > 0
                      ? country.userRating
                      : null
                  }
                  size="sm"
                />

                {/* Cost */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--color-slate-400)",
                  }}
                >
                  {formatCost(country.costOfLiving)}
                </span>

                {/* Climate */}
                <span style={{ fontSize: "0.8rem" }}>
                  {climateEmoji(country.climate)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      <p
        style={{
          marginTop: "0.75rem",
          fontSize: "0.75rem",
          color: "var(--color-ink-500)",
          textAlign: "right",
          fontFamily: "var(--font-mono)",
        }}
      >
        Showing {displayed.length} of {allCountries.length} countries
      </p>
    </div>
  );
}
