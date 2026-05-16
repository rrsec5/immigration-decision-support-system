import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usersApi } from "../api/users";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";
import { regionLabel, climateEmoji } from "../utils/format";
import type { UserProfile } from "../types";
import { toast } from "sonner";
import {
  RiUserLine,
  RiEditLine,
  RiMapPinLine,
  RiBriefcaseLine,
  RiHeartPulseLine,
  RiTeamLine,
  RiTranslate2,
} from "react-icons/ri";

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.625rem 0",
        borderBottom: "1px solid var(--color-ink-800)",
      }}
    >
      <span
        style={{
          fontSize: "0.8rem",
          color: "var(--color-slate-400)",
          fontFamily: "var(--font-body)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.875rem",
          color: "var(--color-slate-200)",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
};

const SectionCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "var(--color-slate-300)",
          margin: "0 0 0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        <span style={{ color: "var(--color-amber-400)" }}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
};

const healthLabel: Record<string, string> = {
  healthy: "Healthy",
  minor_issues: "Minor issues",
  serious_conditions: "Serious conditions",
};
const goalLabel: Record<string, string> = {
  work: "Work",
  study: "Study",
  living: "Living",
};

export function ProfilePage() {
  const { email } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi
      .getMe()
      .then(setProfile)
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
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
        <Spinner size={22} /> Loading profile…
      </div>
    );
  }

  const isIncomplete = !profile?.professionId;

  return (
    <div
      style={{
        maxWidth: "42rem",
        margin: "0 auto",
        animation: "fadeUp 0.4s ease forwards",
      }}
    >
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "9999px",
              background:
                "linear-gradient(135deg, var(--color-amber-400), var(--color-emerald-400))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <RiUserLine size={24} color="var(--color-ink-950)" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--color-slate-200)",
                margin: "0 0 0.2rem",
                letterSpacing: "-0.02em",
              }}
            >
              {email?.split("@")[0]}
            </h1>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--color-slate-400)",
                margin: 0,
                fontFamily: "var(--font-mono)",
              }}
            >
              {email}
            </p>
          </div>
        </div>

        <Link
          to="/survey/edit"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            textDecoration: "none",
          }}
          className="btn-ghost"
        >
          <RiEditLine size={15} />
          Edit profile
        </Link>
      </div>

      {isIncomplete && (
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: "0.875rem",
            marginBottom: "1.5rem",
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-amber-300)",
              margin: 0,
            }}
          >
            Your profile is incomplete. Fill in the survey to unlock
            personalised rankings.
          </p>
          <Link
            to="/survey"
            className="btn-primary"
            style={{
              textDecoration: "none",
              fontSize: "0.8rem",
              padding: "0.5rem 1rem",
            }}
          >
            Complete survey
          </Link>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Professional */}
        <SectionCard icon={<RiBriefcaseLine size={15} />} title="Professional">
          <Row label="Profession" value={profile?.professionName ?? "—"} />
          <Row
            label="Work experience"
            value={
              profile?.workExperience != null
                ? `${profile.workExperience} years`
                : "—"
            }
          />
          <Row
            label="Financial savings"
            value={
              profile?.financialLevelAmount != null
                ? `$${profile.financialLevelAmount.toLocaleString()} (level ${profile.financialLevelId})`
                : "—"
            }
          />
        </SectionCard>

        {/* Personal */}
        <SectionCard icon={<RiTeamLine size={15} />} title="Personal">
          <Row label="Family members" value={profile?.familyMembers ?? "—"} />
          <Row
            label="State of health"
            value={
              profile?.stateOfHealth
                ? (healthLabel[profile.stateOfHealth] ?? profile.stateOfHealth)
                : "—"
            }
          />
        </SectionCard>

        {/* Preferences */}
        <SectionCard
          icon={<RiMapPinLine size={15} />}
          title="Location Preferences"
        >
          <Row
            label="Region"
            value={
              profile?.preferredRegion
                ? regionLabel(profile.preferredRegion)
                : "—"
            }
          />
          <Row
            label="Climate"
            value={
              profile?.preferredClimate
                ? `${climateEmoji(profile.preferredClimate)} ${profile.preferredClimate}`
                : "—"
            }
          />
          <Row
            label="Near ocean/sea"
            value={
              profile?.preferredOceanSea
                ? profile.preferredOceanSea.charAt(0).toUpperCase() +
                  profile.preferredOceanSea.slice(1)
                : "—"
            }
          />
          <Row
            label="Migration goal"
            value={
              profile?.migrationGoal
                ? (goalLabel[profile.migrationGoal] ?? profile.migrationGoal)
                : "—"
            }
          />
        </SectionCard>

        {/* Languages */}
        <SectionCard icon={<RiTranslate2 size={15} />} title="Language Skills">
          {!profile?.languageSkills?.length ? (
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-ink-500)",
                margin: 0,
              }}
            >
              No languages added.
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {profile.languageSkills.map((s) => (
                <div
                  key={s.languageId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.375rem 0.75rem",
                    background: "var(--color-ink-800)",
                    border: "1px solid var(--color-ink-600)",
                    borderRadius: "0.625rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-slate-300)",
                    }}
                  >
                    {s.languageName}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: "var(--color-amber-400)",
                      fontWeight: 600,
                    }}
                  >
                    {s.level}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Health note */}
        {profile?.stateOfHealth === "serious_conditions" && (
          <div
            style={{
              padding: "0.875rem 1rem",
              borderRadius: "0.75rem",
              background: "rgba(251,113,133,0.06)",
              border: "1px solid rgba(251,113,133,0.15)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <RiHeartPulseLine size={16} color="var(--color-rose-400)" />
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--color-rose-400)",
                margin: 0,
              }}
            >
              Healthcare quality is weighted more heavily in your rankings due
              to your health status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
