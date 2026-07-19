import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";
import { RiGlobeLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { ApiError } from "../api/client";

interface FormData {
  email: string;
  password: string;
  confirm: string;
}

export function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormData>();
  const pw = watch("password");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await authRegister({ email: data.email, password: data.password });
      toast.success("Account created! Let's set up your profile.");
      navigate("/survey");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("email", { message: "This email is already registered" });
      } else {
        setError("root", { message: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--color-ink-950)",
        backgroundImage:
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(251,191,36,0.07) 0%, transparent 60%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "24rem",
          animation: "fadeUp 0.4s ease forwards",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "var(--color-amber-400)",
              borderRadius: "0.625rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RiGlobeLine size={20} color="var(--color-ink-950)" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.4rem",
              color: "var(--color-slate-200)",
            }}
          >
            Emigro
          </span>
        </Link>

        <div className="card" style={{ padding: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--color-slate-200)",
              margin: "0 0 0.25rem",
            }}
          >
            Create account
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-slate-400)",
              margin: "0 0 1.75rem",
            }}
          >
            Sign up to get your personalised country ranking
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ marginBottom: "1rem" }}>
              <label className="label">Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  style={{ paddingRight: "2.75rem" }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-ink-500)",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPw ? (
                    <RiEyeOffLine size={18} />
                  ) : (
                    <RiEyeLine size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPwConf ? "text" : "password"}
                  placeholder="Repeat password"
                  {...register("confirm", {
                    required: "Please confirm your password",
                    validate: (v) => v === pw || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwConf((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-ink-500)",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPwConf ? (
                    <RiEyeOffLine size={18} />
                  ) : (
                    <RiEyeLine size={18} />
                  )}
                </button>
              </div>

              {errors.confirm && (
                <p className="error-text">{errors.confirm.message}</p>
              )}
            </div>

            {errors.root && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  marginBottom: "1rem",
                  background: "rgba(251,113,133,0.08)",
                  border: "1px solid rgba(251,113,133,0.2)",
                  fontSize: "0.875rem",
                  color: "var(--color-rose-400)",
                }}
              >
                {errors.root.message}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {loading ? <Spinner size={16} /> : "Create account"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.875rem",
            color: "var(--color-slate-400)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--color-amber-400)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
