import { Link } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";

export function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        background: "var(--color-ink-950)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "5rem",
          fontWeight: 700,
          color: "var(--color-ink-700)",
          lineHeight: 1,
        }}
      >
        404
      </span>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "var(--color-slate-300)",
          margin: 0,
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-slate-400)",
          margin: 0,
        }}
      >
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="btn-ghost"
        style={{
          marginTop: "0.5rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          textDecoration: "none",
        }}
      >
        <RiArrowLeftLine size={15} /> Back to home
      </Link>
    </div>
  );
}
