import { Toaster } from "sonner";

export const CustomToaster = () => (
  <Toaster
    position="bottom-right"
    richColors
    expand={true}
    toastOptions={{
      style: {
        background: "var(--color-ink-800)",
        border: "1px solid var(--color-ink-600)",
        color: "var(--color-slate-200)",
        fontFamily: "var(--font-body)",
      },
    }}
  />
);
