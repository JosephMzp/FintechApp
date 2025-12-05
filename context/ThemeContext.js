import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Cargar tema guardado
  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem("appTheme");
      if (stored !== null) setIsDark(stored === "dark");
    };
    loadTheme();
  }, []);

  // Guardar cuando cambia
  useEffect(() => {
    AsyncStorage.setItem("appTheme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
