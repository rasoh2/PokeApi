import { createContext, useContext, useState, useEffect } from "react";

const PokemonThemeContext = createContext();

export function PokemonThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("pokedex-theme") || "dark",
  );
  const [activePokemonColors, setActivePokemonColors] = useState({
    primary: "#1a1a2e",
    secondary: "#16161a",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16161a 100%)",
  });

  useEffect(() => {
    localStorage.setItem("pokedex-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const updateActiveColors = (typeColors) => {
    if (typeColors && typeColors.bg) {
      const primary = typeColors.bg;
      const secondary = typeColors.bgSecondary || "#16161a";
      setActivePokemonColors({
        primary,
        secondary,
        gradient:
          typeColors.gradient ||
          `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
      });
    } else {
      // Valor por defecto
      setActivePokemonColors({
        primary: theme === "dark" ? "#1a1a2e" : "#f8f9fa",
        secondary: theme === "dark" ? "#16161a" : "#e8e8e8",
        gradient:
          theme === "dark"
            ? "linear-gradient(135deg, #1a1a2e 0%, #16161a 100%)"
            : "linear-gradient(135deg, #f8f9fa 0%, #e8e8e8 100%)",
      });
    }
  };

  return (
    <PokemonThemeContext.Provider
      value={{
        theme,
        activePokemonColors,
        toggleTheme,
        updateActiveColors,
      }}
    >
      {children}
    </PokemonThemeContext.Provider>
  );
}

export function usePokemonTheme() {
  const context = useContext(PokemonThemeContext);
  if (!context) {
    throw new Error(
      "usePokemonTheme debe usarse dentro de un PokemonThemeProvider",
    );
  }
  return context;
}
