"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
});

const applyThemeToDocument = (nextTheme) => {
  if (typeof document === "undefined") return;
  const sanitized = nextTheme === "light" ? "light" : "dark";
  
  console.log("Applying theme:", sanitized);
  
  // Set data-theme attribute
  document.documentElement.dataset.theme = sanitized;
  
  // Add/remove dark class for Tailwind
  if (sanitized === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  
  console.log("HTML classes:", document.documentElement.className);
  console.log("HTML data-theme:", document.documentElement.dataset.theme);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    
    // Check localStorage for saved theme
    const stored = localStorage.getItem("kh-theme");
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    
    setThemeState(initial);
    applyThemeToDocument(initial);
  }, []);

  const setTheme = (nextTheme) => {
    const normalized = nextTheme === "light" ? "light" : "dark";
    setThemeState(normalized);
    
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kh-theme", normalized);
    }
    
    applyThemeToDocument(normalized);
  };

  useEffect(() => {
    if (mounted) {
      applyThemeToDocument(theme);
    }
  }, [theme, mounted]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
