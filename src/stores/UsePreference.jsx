import { create } from "zustand";

const defaultPrefs = {
  theme: "light", // "dark"
  fontSize: "base", // "sm", "lg", etc.
  fontFamily: "arial", // "serif", "mono"
};

const usePreferences = create((set) => ({
  ...defaultPrefs,

  setTheme: (theme) => {
    // ✅ Apply to body
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);

    // ✅ Save to state and localStorage
    localStorage.setItem("theme", theme);
    set({ theme });
  },

  setFontSize: (fontSize) => {
    localStorage.setItem("fontSize", fontSize);
    set({ fontSize });
  },

  setFontFamily: (fontFamily) => {
    localStorage.setItem("fontFamily", fontFamily);
    set({ fontFamily });
  },

  loadPreferences: () => {
    const theme = localStorage.getItem("theme") || "light";
    const fontSize = localStorage.getItem("fontSize") || "base";
    const fontFamily = localStorage.getItem("fontFamily") || "sans";

    // Apply theme class on load
    document.body.classList.add(`theme-${theme}`);

    set({ theme, fontSize, fontFamily });
  },
}));

export default usePreferences;
