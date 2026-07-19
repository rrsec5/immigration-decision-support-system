import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { countriesApi } from "../api/countries";
import { useAuth } from "../hooks/useAuth";
import { ScoreBadge } from "../components/ui/ScoreBadge";
import { StatBar } from "../components/ui/StatBar";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";
import {
  formatCost,
  formatDate,
  formatDateTime,
  regionLabel,
  climateEmoji,
  scoreColor,
} from "../utils/format";
import { countryPhoto } from "../utils/countryAssets";
import type { Country, Review } from "../types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  RiArrowLeftLine,
  RiMapPinLine,
  RiThumbUpLine,
  RiDeleteBinLine,
  RiEditLine,
  RiWaterFlashLine,
  RiGlobalLine,
  RiStarLine,
} from "react-icons/ri";

type ReviewSort = "newest" | "best" | "worst";

interface ReviewFormData {
  rating: number;
  comment: string;
}

interface LocationState {
  from?: "recommendations";
  sessionTime?: string;
}

export function CountryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const countryId = Number(id);
  const { isLoggedIn, userId } = useAuth();
  const location = useLocation();
  const locationState = (location.state ?? {}) as LocationState;

  // Back-navigation: if came from recommendations, go back there (to the right session)
  const backTo =
    locationState.from === "recommendations"
      ? locationState.sessionTime
        ? `/recommendations?session=${encodeURIComponent(locationState.sessionTime)}`
        : "/recommendations"
      : "/";
  const backLabel =
    locationState.from === "recommendations"
      ? "Back to ranking"
      : "All countries";

  const [country, setCountry] = useState<Country | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [reviewSort, setReviewSort] = useState<ReviewSort>("newest");
  const [loadingPage, setLoadingPage] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>();

  const loadReviews = async (sort: ReviewSort = reviewSort) => {
    const data = await countriesApi.getReviews(countryId, sort);
    setReviews(data);
    if (isLoggedIn && userId) {
      const mine = data.find((r) => r.userId === userId) ?? null;
      setMyReview(mine);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [c] = await Promise.all([countriesApi.getById(countryId)]);
        setCountry(c);
        await loadReviews("newest");
      } catch {
        toast.error("Country not found");
      } finally {
        setLoadingPage(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  const handleSortChange = async (sort: ReviewSort) => {
    setReviewSort(sort);
    await loadReviews(sort);
  };

  const onSubmitReview = async (data: ReviewFormData) => {
    setSubmitting(true);
    try {
      if (editMode && myReview) {
        await countriesApi.updateReview(countryId, {
          rating: Number(data.rating),
          comment: data.comment || undefined,
        });
        toast.success("Review updated");
      } else {
        await countriesApi.addReview(countryId, {
          rating: Number(data.rating),
          comment: data.comment || undefined,
        });
        toast.success("Review added!");
      }
      // Refresh country to get updated ratings
      const updatedCountry = await countriesApi.getById(countryId);
      setCountry(updatedCountry);
      await loadReviews(reviewSort);
      setEditMode(false);
      reset();
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm("Delete your review?")) return;
    try {
      await countriesApi.deleteReview(countryId);
      toast.success("Review deleted");
      const updatedCountry = await countriesApi.getById(countryId);
      setCountry(updatedCountry);
      setMyReview(null);
      await loadReviews(reviewSort);
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const startEdit = () => {
    if (!myReview) return;
    setValue("rating", myReview.rating);
    setValue("comment", myReview.comment ?? "");
    setEditMode(true);
  };

  if (loadingPage) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "0.75rem",
          color: "var(--color-slate-400)",
        }}
      >
        <Spinner size={22} /> Loading…
      </div>
    );
  }

  if (!country) {
    return (
      <EmptyState
        title="Country not found"
        action={
          <Link to="/" className="btn-ghost">
            Back to rankings
          </Link>
        }
      />
    );
  }

  const publicReviews = reviews.filter((r) => r.userId !== userId);

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Back */}
      <Link
        to={backTo}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          color: "var(--color-slate-400)",
          textDecoration: "none",
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
          transition: "color 0.15s",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.color = "var(--color-slate-200)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.color = "var(--color-slate-400)")
        }
      >
        <RiArrowLeftLine size={16} /> {backLabel}
      </Link>

      {/* Hero info card */}
      <div
        className="card"
        style={{
          padding: "2rem",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "100%",
            background: `radial-gradient(ellipse at 80% 50%, ${scoreColor(country.overallRating)}12 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.25rem",
                fontWeight: 800,
                color: "var(--color-slate-200)",
                margin: "0 0 0.5rem",
                letterSpacing: "-0.03em",
              }}
            >
              <span
                className={`fi fi-${country.shortName}`}
                style={{
                  width: "44px",
                  height: "32px",
                  display: "inline-block",
                  borderRadius: "2px",
                }}
              />{" "}
              {country.name}
            </h1>
            <div
              style={{
                display: "flex",
                gap: "0.625rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span className="tag">
                <RiMapPinLine size={12} />
                {regionLabel(country.region)}
              </span>
              <span className="tag">
                {climateEmoji(country.climate)} {country.climate}
              </span>
              {country.isNearOceanSea && (
                <span className="tag">
                  <RiWaterFlashLine size={12} />
                  Coastal
                </span>
              )}
              <span className="tag">
                {country.primaryLanguageName}
                {country.secondaryLanguageName
                  ? ` / ${country.secondaryLanguageName}`
                  : ""}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--color-slate-400)",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.375rem",
                }}
              >
                Overall
              </div>
              <ScoreBadge score={country.overallRating} size="lg" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--color-slate-400)",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.375rem",
                }}
              >
                Users
              </div>
              <ScoreBadge
                score={
                  country.userRating && country.userRating > 0
                    ? country.userRating
                    : null
                }
                size="lg"
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--color-slate-400)",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.375rem",
                }}
              >
                Cost/mo
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                  color: "var(--color-slate-300)",
                  fontWeight: 500,
                }}
              >
                {formatCost(country.costOfLiving)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Hero photo */}
      {(() => {
        const photo = countryPhoto(country.name);
        return photo ? (
          <div
            style={{
              width: "100%",
              height: "620px",
              marginBottom: "1.5rem",
              borderRadius: "1rem",
              overflow: "hidden",
              border: "1px solid var(--color-ink-700)",
              position: "relative",
            }}
          >
            <img
              src={photo}
              alt={country.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* subtle dark gradient at bottom so hero card text is legible */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent 40%, rgba(10,11,15,0.55) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        ) : null;
      })()}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Stats */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--color-slate-300)",
              margin: "0 0 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <RiGlobalLine size={16} color="var(--color-amber-400)" /> Key
            Indicators
          </h3>
          <StatBar label="Economy" value={country.economyIndex} />
          <StatBar label="Quality of Life" value={country.qualityOfLife} />
          <StatBar label="Safety" value={country.safetyLevel} />
          <StatBar label="Healthcare" value={country.healthcareLevel} />
          <StatBar label="Education" value={country.educationLevel} />
          <StatBar label="Employment" value={country.employmentOpportunities} />
          <StatBar
            label="Immigration Policy"
            value={country.immigrationPolicy}
          />
          <StatBar
            label="Social Institutions"
            value={country.socialInstitutions}
          />
        </div>

        {/* Summary cards */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
        >
          {[
            { label: "Economy Index", value: country.economyIndex, icon: "📈" },
            {
              label: "Quality of Life",
              value: country.qualityOfLife,
              icon: "🏡",
            },
            { label: "Safety Level", value: country.safetyLevel, icon: "🛡️" },
            { label: "Healthcare", value: country.healthcareLevel, icon: "🏥" },
            { label: "Education", value: country.educationLevel, icon: "🎓" },
            {
              label: "Employment",
              value: country.employmentOpportunities,
              icon: "💼",
            },
            {
              label: "Immigration Policy",
              value: country.immigrationPolicy,
              icon: "📋",
            },
            {
              label: "Social Institutions",
              value: country.socialInstitutions,
              icon: "🏛️",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 0.875rem",
                background: "var(--color-ink-800)",
                borderRadius: "0.75rem",
                border: "1px solid var(--color-ink-700)",
              }}
            >
              <span
                style={{ fontSize: "0.8rem", color: "var(--color-slate-400)" }}
              >
                {item.icon} {item.label}
              </span>
              <ScoreBadge score={item.value} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews section */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--color-slate-200)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <RiStarLine size={17} color="var(--color-amber-400)" />
            User Reviews
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--color-ink-500)",
                fontWeight: 400,
              }}
            >
              ({reviews.length})
            </span>
          </h3>
          <div style={{ display: "flex", gap: "0.375rem" }}>
            {(["newest", "best", "worst"] as ReviewSort[]).map((s) => (
              <button
                key={s}
                className={reviewSort === s ? "btn-primary" : "btn-ghost"}
                style={{ padding: "0.375rem 0.75rem", fontSize: "0.8rem" }}
                onClick={() => handleSortChange(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* My review */}
        {isLoggedIn && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1.25rem",
              background: "rgba(251,191,36,0.04)",
              border: "1px solid rgba(251,191,36,0.15)",
              borderRadius: "0.875rem",
            }}
          >
            {myReview && !editMode ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-amber-400)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Your review
                    </span>
                    <div style={{ marginTop: "0.25rem" }}>
                      <ScoreBadge score={myReview.rating} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-ghost"
                      style={{
                        padding: "0.375rem 0.75rem",
                        fontSize: "0.8rem",
                      }}
                      onClick={startEdit}
                    >
                      <RiEditLine size={14} /> Edit
                    </button>
                    <button
                      className="btn-danger"
                      style={{
                        padding: "0.375rem 0.75rem",
                        fontSize: "0.8rem",
                      }}
                      onClick={handleDeleteReview}
                    >
                      <RiDeleteBinLine size={14} /> Delete
                    </button>
                  </div>
                </div>
                {myReview.comment && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-slate-300)",
                      margin: 0,
                    }}
                  >
                    {myReview.comment}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-ink-500)",
                    marginTop: "0.5rem",
                    marginBottom: 0,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {formatDate(myReview.createdAt)}
                </p>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmitReview)} noValidate>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "var(--color-slate-300)",
                    margin: "0 0 0.875rem",
                  }}
                >
                  {editMode ? "Edit your review" : "Leave a review"}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: "0.75rem",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <label className="label">Rating (1–10)</label>
                    <input
                      className="input-field"
                      type="number"
                      min={1}
                      max={10}
                      step={0.5}
                      placeholder="8.0"
                      {...register("rating", {
                        required: "Required",
                        min: { value: 1, message: "Min 1" },
                        max: { value: 10, message: "Max 10" },
                      })}
                    />
                    {errors.rating && (
                      <p className="error-text">{errors.rating.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Comment (optional)</label>
                    <input
                      className="input-field"
                      placeholder="Share your experience…"
                      {...register("comment")}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.625rem",
                    marginTop: "0.875rem",
                  }}
                >
                  <button
                    className="btn-primary"
                    type="submit"
                    disabled={submitting}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    {submitting ? (
                      <Spinner size={14} />
                    ) : (
                      <RiThumbUpLine size={14} />
                    )}
                    {editMode ? "Update" : "Submit"}
                  </button>
                  {editMode && (
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => {
                        setEditMode(false);
                        reset();
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {!isLoggedIn && (
          <div
            style={{
              marginBottom: "1.25rem",
              padding: "1rem",
              background: "var(--color-ink-800)",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              color: "var(--color-slate-400)",
            }}
          >
            <Link
              to="/login"
              style={{
                color: "var(--color-amber-400)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Log in
            </Link>{" "}
            to leave a review.
          </div>
        )}

        {/* All reviews */}
        {publicReviews.length === 0 &&
        reviews.filter((r) => r.userId !== userId).length === 0 ? (
          <EmptyState
            icon="💬"
            title="No reviews yet"
            description="Be the first to share your experience."
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            {publicReviews.map((r) => (
              <div
                key={`${r.userId}-${r.countryId}`}
                style={{
                  padding: "1rem",
                  background: "var(--color-ink-800)",
                  borderRadius: "0.875rem",
                  border: "1px solid var(--color-ink-700)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: r.comment ? "0.5rem" : 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "9999px",
                        background: "var(--color-ink-600)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--color-slate-400)",
                      }}
                    >
                      {r.userId}
                    </div>
                    <ScoreBadge score={r.rating} size="sm" />
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--color-ink-500)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {formatDateTime(r.createdAt)}
                  </span>
                </div>
                {r.comment && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-slate-300)",
                      margin: 0,
                    }}
                  >
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
