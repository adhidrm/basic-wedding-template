import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("elegant-dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("wedding-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wedding-theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  const themes = {
    "elegant-dark": {
      name: "Elegant Dark",
      primary: "from-slate-900 to-slate-800",
      secondary: "from-rose-900 to-pink-900",
      accent: "rose-400",
      text: "white",
      textSecondary: "slate-300",
      card: "slate-800/50",
      border: "slate-700"
    },
    "romantic-blush": {
      name: "Romantic Blush",
      primary: "from-pink-50 to-rose-50",
      secondary: "from-rose-400 to-pink-500",
      accent: "rose-500",
      text: "slate-800",
      textSecondary: "slate-600",
      card: "white/80",
      border: "rose-200"
    },
    "golden-luxury": {
      name: "Golden Luxury",
      primary: "from-amber-900 to-yellow-900",
      secondary: "from-amber-600 to-yellow-600",
      accent: "amber-400",
      text: "white",
      textSecondary: "amber-100",
      card: "amber-900/50",
      border: "amber-700"
    },
    "forest-green": {
      name: "Forest Elegance",
      primary: "from-emerald-900 to-green-900",
      secondary: "from-emerald-600 to-green-600",
      accent: "emerald-400",
      text: "white",
      textSecondary: "emerald-100",
      card: "emerald-900/50",
      border: "emerald-700"
    }
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const currentTheme = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, themes, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};