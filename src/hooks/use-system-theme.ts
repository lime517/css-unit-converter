import { useEffect } from "react";

export function useSystemTheme() {
  useEffect(() => {
    const root = window.document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    function apply(dark: boolean) {
      root.classList.toggle("dark", dark);
    }

    apply(mq.matches);
    mq.addEventListener("change", (e) => apply(e.matches));
    return () => mq.removeEventListener("change", (e) => apply(e.matches));
  }, []);
}
