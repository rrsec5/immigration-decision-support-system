import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWatch, useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { usersApi } from "../api/users";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";
import { RiAddLine, RiDeleteBinLine, RiArrowRightLine } from "react-icons/ri";
import type {
  FinancialLevel,
  Language,
  Profession,
  UserProfileRequest,
  LanguageLevel,
} from "../types";
import { regionLabel } from "../utils/format";

const CLIMATES = ["cold", "moderate", "warm", "any"] as const;
const SEA_PREFS = ["yes", "no", "any"] as const;
const REGIONS = [
  "Europe",
  "Asia",
  "North_America",
  "South_America",
  "Australia",
  "any",
] as const;
const GOALS = ["work", "study", "living"] as const;
const HEALTH = ["healthy", "minor_issues", "serious_conditions"] as const;
const LANG_LEVELS: LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function goalLabel(g: string) {
  return { work: "Work", study: "Study", living: "Living" }[g] ?? g;
}
function healthLabel(h: string) {
  return (
    {
      healthy: "Healthy",
      minor_issues: "Minor issues",
      serious_conditions: "Serious conditions",
    }[h] ?? h
  );
}
function finLabel(f: FinancialLevel) {
  return `Level ${f.level} — $${f.amount.toLocaleString()}`;
}

interface Props {
  isEditing?: boolean;
}

const SectionHead = ({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        marginBottom: "0.25rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--color-amber-400)",
          background: "rgba(251,191,36,0.1)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: "0.375rem",
          padding: "0.1rem 0.5rem",
        }}
      >
        {step}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "var(--color-slate-200)",
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
    <p
      style={{ fontSize: "0.8rem", color: "var(--color-slate-400)", margin: 0 }}
    >
      {desc}
    </p>
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
    {children}
  </div>
);

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="label">{label}</label>
    {children}
    {error && <p className="error-text">{error}</p>}
  </div>
);

export function SurveyPage({ isEditing = false }: Props) {
  const { markProfileComplete } = useAuth();
  const navigate = useNavigate();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [financialLevels, setFinancialLevels] = useState<FinancialLevel[]>([]);
  const [loadingRef, setLoadingRef] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserProfileRequest>({ defaultValues: { languageSkills: [] } });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languageSkills",
  });

  const watchedLanguages = useWatch({
    control,
    name: "languageSkills",
  });

  // Load reference data and (if editing) existing profile
  useEffect(() => {
    const load = async () => {
      try {
        const [langs, profs, fins] = await Promise.all([
          usersApi.getLanguages(),
          usersApi.getProfessions(),
          usersApi.getFinancialLevels(),
        ]);
        setLanguages(langs);
        setProfessions(profs);
        setFinancialLevels(fins);

        if (isEditing) {
          const profile = await usersApi.getMe();
          reset({
            financialLevelId: profile.financialLevelId ?? undefined,
            professionId: profile.professionId ?? undefined,
            workExperience: profile.workExperience ?? undefined,
            familyMembers: profile.familyMembers ?? undefined,
            preferredClimate: profile.preferredClimate ?? undefined,
            preferredOceanSea: profile.preferredOceanSea ?? undefined,
            preferredRegion: profile.preferredRegion ?? undefined,
            migrationGoal: profile.migrationGoal ?? undefined,
            stateOfHealth: profile.stateOfHealth ?? undefined,
            languageSkills: profile.languageSkills.map((s) => ({
              languageId: s.languageId,
              level: s.level,
            })),
          } as UserProfileRequest);
        }
      } catch {
        toast.error("Failed to load form data");
      } finally {
        setLoadingRef(false);
      }
    };
    load();
  }, [isEditing, reset]);

  const onSubmit = async (data: UserProfileRequest) => {
    setSubmitting(true);
    try {
      await usersApi.updateProfile(data);
      markProfileComplete();
      toast.success(isEditing ? "Profile updated!" : "Profile complete!");
      navigate(isEditing ? "/profile" : "/");
    } catch {
      toast.error("Failed to save profile. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRef) {
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
        <Spinner size={22} /> Loading form…
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "42rem",
        margin: "0 auto",
        padding: "2rem 0",
        animation: "fadeUp 0.4s ease forwards",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--color-slate-200)",
            margin: "0 0 0.375rem",
          }}
        >
          {isEditing ? "Edit your profile" : "Set up your profile"}
        </h1>
        <p
          style={{
            color: "var(--color-slate-400)",
            fontSize: "0.9rem",
            margin: 0,
          }}
        >
          {isEditing
            ? "Update your preferences to regenerate personalised rankings."
            : "Tell us about yourself so we can build your personalised country ranking."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* Section 1 — Professional */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <SectionHead
            step="01"
            title="Professional background"
            desc="Your job and financial situation"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Row>
              <Field label="Profession" error={errors.professionId?.message}>
                <select
                  className="select-field"
                  {...register("professionId", {
                    required: "Required",
                    valueAsNumber: true,
                  })}
                >
                  <option value="">Select…</option>
                  {professions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Work experience (years)"
                error={errors.workExperience?.message}
              >
                <input
                  className="input-field"
                  type="number"
                  min={0}
                  max={60}
                  placeholder="0"
                  {...register("workExperience", {
                    required: "Required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Min 0" },
                  })}
                />
              </Field>
            </Row>
            <Field
              label="Financial savings level (how much money are you willing to take with you)"
              error={errors.financialLevelId?.message}
            >
              <select
                className="select-field"
                {...register("financialLevelId", {
                  required: "Required",
                  valueAsNumber: true,
                })}
              >
                <option value="">Select…</option>
                {financialLevels.map((f) => (
                  <option key={f.id} value={f.id}>
                    {finLabel(f)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Section 2 — Personal */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <SectionHead
            step="02"
            title="Personal situation"
            desc="Family and health"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Row>
              <Field
                label="Family members moving with you (including you)"
                error={errors.familyMembers?.message}
              >
                <input
                  className="input-field"
                  type="number"
                  min={1}
                  max={20}
                  placeholder="1"
                  {...register("familyMembers", {
                    required: "Required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Min 1" },
                  })}
                />
              </Field>
              <Field
                label="State of health"
                error={errors.stateOfHealth?.message}
              >
                <select
                  className="select-field"
                  {...register("stateOfHealth", { required: "Required" })}
                >
                  <option value="">Select…</option>
                  {HEALTH.map((h) => (
                    <option key={h} value={h}>
                      {healthLabel(h)}
                    </option>
                  ))}
                </select>
              </Field>
            </Row>
          </div>
        </div>

        {/* Section 3 — Preferences */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <SectionHead
            step="03"
            title="Location preferences"
            desc="Where do you want to go?"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Row>
              <Field
                label="Preferred region"
                error={errors.preferredRegion?.message}
              >
                <select
                  className="select-field"
                  {...register("preferredRegion", { required: "Required" })}
                >
                  <option value="">Select…</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {regionLabel(r)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Preferred climate"
                error={errors.preferredClimate?.message}
              >
                <select
                  className="select-field"
                  {...register("preferredClimate", { required: "Required" })}
                >
                  <option value="">Select…</option>
                  {CLIMATES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
            </Row>
            <Row>
              <Field
                label="Near ocean / sea?"
                error={errors.preferredOceanSea?.message}
              >
                <select
                  className="select-field"
                  {...register("preferredOceanSea", { required: "Required" })}
                >
                  <option value="">Select…</option>
                  {SEA_PREFS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Migration goal"
                error={errors.migrationGoal?.message}
              >
                <select
                  className="select-field"
                  {...register("migrationGoal", { required: "Required" })}
                >
                  <option value="">Select…</option>
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {goalLabel(g)}
                    </option>
                  ))}
                </select>
              </Field>
            </Row>
          </div>
        </div>

        {/* Section 4 — Languages */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <SectionHead
            step="04"
            title="Language skills"
            desc="Languages you speak (optional but improves your ranking)"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {fields.map((field, index) => (
              <div
                key={field.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr auto",
                  gap: "0.75rem",
                  alignItems: "end",
                }}
              >
                <div>
                  {index === 0 && <label className="label">Language</label>}
                  <select
                    className="select-field"
                    {...register(`languageSkills.${index}.languageId`, {
                      required: true,
                      valueAsNumber: true,
                    })}
                  >
                    <option value="">Select…</option>
                    {languages
                      .filter((l) => {
                        const selected = watchedLanguages?.some(
                          (skill, i) =>
                            i !== index && Number(skill?.languageId) === l.id,
                        );

                        return !selected;
                      })
                      .map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  {index === 0 && <label className="label">Level</label>}
                  <select
                    className="select-field"
                    {...register(`languageSkills.${index}.level`, {
                      required: true,
                    })}
                  >
                    {LANG_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  style={{
                    background: "rgba(251,113,133,0.08)",
                    border: "1px solid rgba(251,113,133,0.2)",
                    color: "var(--color-rose-400)",
                    borderRadius: "0.75rem",
                    padding: "0.625rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginTop: index === 0 ? "1.375rem" : "0",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(251,113,133,0.15)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(251,113,133,0.08)")
                  }
                >
                  <RiDeleteBinLine size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ languageId: 0, level: "B1" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.75rem",
                border: "1px dashed var(--color-ink-600)",
                background: "transparent",
                color: "var(--color-slate-400)",
                fontSize: "0.875rem",
                cursor: "pointer",
                width: "fit-content",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--color-amber-400)";
                e.currentTarget.style.color = "var(--color-amber-400)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--color-ink-600)";
                e.currentTarget.style.color = "var(--color-slate-400)";
              }}
            >
              <RiAddLine size={16} /> Add language
            </button>
          </div>
        </div>

        <button
          className="btn-primary"
          type="submit"
          disabled={submitting}
          style={{
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 2rem",
          }}
        >
          {submitting ? (
            <Spinner size={16} />
          ) : (
            <>
              {isEditing ? "Save changes" : "Complete profile"}
              <RiArrowRightLine size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
