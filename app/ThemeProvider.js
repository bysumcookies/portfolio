"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent FOUC - read from localStorage before rendering
    const stored = localStorage.getItem("theme") || "dark";
    setTheme(stored);
    setMounted(true);
    
    // Apply theme immediately
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Always provide context, even before mount (prevents useTheme errors)
  // Initial value uses theme state (defaults to "dark")
  const contextValue = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    mounted, // Expose mounted state if needed
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
