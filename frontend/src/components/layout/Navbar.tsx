import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  RiGlobeLine,
  RiUserLine,
  RiStarLine,
  RiLogoutBoxLine,
} from "react-icons/ri";

export function Navbar() {
  const { isLoggedIn, email, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const linkStyle = (path: string) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    fontSize: "0.875rem",
    fontFamily: "var(--font-body)",
    color:
      pathname === path ? "var(--color-amber-400)" : "var(--color-slate-400)",
    textDecoration: "none",
    padding: "0.375rem 0.625rem",
    borderRadius: "0.5rem",
    background: pathname === path ? "rgba(251,191,36,0.08)" : "transparent",
    transition: "color 0.15s, background 0.15s",
  });

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--color-ink-700)",
        background: "rgba(10, 11, 15, 0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "3.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "var(--color-amber-400)",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RiGlobeLine size={16} color="var(--color-ink-950)" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--color-slate-200)",
              letterSpacing: "-0.02em",
            }}
          >
            Emigro
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <Link to="/" style={linkStyle("/")}>
            <RiGlobeLine size={15} />
            Countries
          </Link>

          {isLoggedIn && (
            <Link to="/recommendations" style={linkStyle("/recommendations")}>
              <RiStarLine size={15} />
              My Ranking
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <Link to="/profile" style={linkStyle("/profile")}>
                <RiUserLine size={15} />
                {email?.split("@")[0]}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-body)",
                  color: "var(--color-slate-400)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.375rem 0.625rem",
                  borderRadius: "0.5rem",
                  transition: "color 0.15s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "var(--color-rose-400)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "var(--color-slate-400)")
                }
              >
                <RiLogoutBoxLine size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle("/login")}>
                Log in
              </Link>
              <Link
                to="/register"
                style={{
                  ...linkStyle("/register"),
                  marginLeft: "0.25rem",
                  background: "var(--color-amber-400)",
                  color: "var(--color-ink-950)",
                  fontWeight: 600,
                  padding: "0.375rem 0.875rem",
                }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
