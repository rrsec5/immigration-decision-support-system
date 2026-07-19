import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { recommendationsApi } from "../api/recommendations";
import { ScoreBadge } from "../components/ui/ScoreBadge";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";
import { formatDateTime, regionLabel } from "../utils/format";
import type { RecommendationSession } from "../types";
import { toast } from "sonner";
import { ApiError } from "../api/client";
import {
  RiSparklingLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiHistoryLine,
} from "react-icons/ri";

export function RecommendationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [session, setSession] = useState<RecommendationSession | null>(null);
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const loadSession = useCallback(
    async (date: string | null): Promise<RecommendationSession | null> => {
      try {
        return date
          ? await recommendationsApi.getSession(date, "score", sortDir)
          : await recommendationsApi.getLatestSession("score", sortDir);
      } catch {
        return null;
      }
    },
    [sortDir],
  );

  useEffect(() => {
    const init = async () => {
      try {
        const dates = await recommendationsApi.getSessions();
        setSessions(dates);
        if (dates.length > 0) {
          // If the URL has ?session=..., open that session; otherwise open the latest
          const sessionParam = searchParams.get("session");
          const target =
            sessionParam && dates.includes(sessionParam)
              ? sessionParam
              : dates[0];
          setSelectedDate(target);
          const sessionData = await loadSession(target);
          setSession(sessionData);
        }
      } catch {
        // No sessions yet — that's fine
      } finally {
        setLoadingPage(false);
      }
    };

    init();
  }, [loadSession, searchParams]);

  useEffect(() => {
    if (!selectedDate) return;

    const reload = async () => {
      const sessionData = await loadSession(selectedDate);

      setSession(sessionData);
    };

    reload();
  }, [selectedDate, sortDir, loadSession]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      toast.loading("Generating your ranking…", { id: "gen" });
      const rankings = await recommendationsApi.generate();
      toast.success("Ranking ready!", { id: "gen" });
      // Refresh sessions list
      const dates = await recommendationsApi.getSessions();
      setSessions(dates);
      const newDate = dates[0];
      setSelectedDate(newDate);
      setSession({ createdAt: newDate, rankings });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          toast.error(error.message, { id: "gen" });
        } else if (error.status === 403) {
          toast.error("You are not authorized.", { id: "gen" });
        } else {
          toast.error("Failed to generate ranking.", { id: "gen" });
        }
      } else {
        toast.error("Unexpected error.", { id: "gen" });
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectSession = async (date: string) => {
    setSelectedDate(date);
    setSearchParams({ session: date }, { replace: true });

    const sessionData = await loadSession(date);
    setSession(sessionData);
  };

  const displayed = session
    ? [...session.rankings].sort((a, b) =>
        sortDir === "desc" ? b.score - a.score : a.score - b.score,
      )
    : [];

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
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
            My Personal Ranking
          </h1>
          <p
            style={{
              color: "var(--color-slate-400)",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            Countries scored based on your profile, goals and preferences.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={generating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
          }}
        >
          {generating ? <Spinner size={16} /> : <RiSparklingLine size={16} />}
          Generate new ranking
        </button>
      </div>

      {loadingPage ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "40vh",
            gap: "0.75rem",
            color: "var(--color-slate-400)",
          }}
        >
          <Spinner size={22} /> Loading…
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={<RiSparklingLine />}
          title="No rankings yet"
          description="Generate your first personalised ranking to see which countries suit you best."
          action={
            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={generating}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
            >
              {generating ? (
                <Spinner size={14} />
              ) : (
                <RiSparklingLine size={14} />
              )}
              Generate ranking
            </button>
          }
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Sessions sidebar */}
          <div
            className="card"
            style={{ padding: "1rem", position: "sticky", top: "4.5rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                marginBottom: "0.875rem",
              }}
            >
              <RiHistoryLine size={15} color="var(--color-amber-400)" />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--color-slate-400)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                History
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              {sessions.map((date) => (
                <button
                  key={date}
                  onClick={() => handleSelectSession(date)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.625rem",
                    border: "none",
                    background:
                      selectedDate === date
                        ? "rgba(251,191,36,0.1)"
                        : "transparent",
                    color:
                      selectedDate === date
                        ? "var(--color-amber-400)"
                        : "var(--color-slate-400)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                    borderLeft:
                      selectedDate === date
                        ? "2px solid var(--color-amber-400)"
                        : "2px solid transparent",
                  }}
                >
                  {formatDateTime(date)}
                </button>
              ))}
            </div>
          </div>

          {/* Rankings table */}
          <div>
            {session && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.875rem",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--color-ink-500)",
                  }}
                >
                  {displayed.length} countries ·{" "}
                  {formatDateTime(session.createdAt)}
                </span>
                <button
                  className="btn-ghost"
                  onClick={() =>
                    setSortDir((d) => (d === "desc" ? "asc" : "desc"))
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.8rem",
                  }}
                >
                  {sortDir === "desc" ? (
                    <RiArrowDownLine size={15} />
                  ) : (
                    <RiArrowUpLine size={15} />
                  )}
                  {sortDir === "desc" ? "Best first" : "Worst first"}
                </button>
              </div>
            )}

            <div className="card" style={{ overflow: "hidden" }}>
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5rem 1fr auto auto",
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
                <span style={{ textAlign: "right" }}>Personal Score</span>
                <span></span>
              </div>

              {displayed.map((rec, i) => (
                <Link
                  key={rec.recommendationId}
                  to={`/countries/${rec.countryId}`}
                  state={{ from: "recommendations", sessionTime: selectedDate }}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2.5rem 1fr auto auto",
                      gap: "1rem",
                      padding: "0.875rem 1.25rem",
                      borderBottom: "1px solid var(--color-ink-800)",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-ink-800)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
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
                    <div>
                      <span
                        className={`fi fi-${rec.shortCountryName}`}
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
                        {rec.countryName}
                      </span>
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.75rem",
                          color: "var(--color-ink-500)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {regionLabel(rec.region)}
                      </span>
                    </div>
                    <ScoreBadge score={rec.score} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
