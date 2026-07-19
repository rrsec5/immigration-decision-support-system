import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          maxWidth: "72rem",
          margin: "0 auto",
          width: "100%",
          padding: "2rem 1.5rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}
