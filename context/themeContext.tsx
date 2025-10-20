import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SettingsData {
  apiKey: string;
  model: string;
  theme: "light" | "dark";
  language: string;
  autoSave: boolean;
}

interface ThemeContextProps {
  settings: SettingsData;
  setSettings: React.Dispatch<React.SetStateAction<SettingsData>>;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsData>({
    apiKey: "",
    model: "gpt-4",
    theme: "light",
    language: "en",
    autoSave: true,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("codetutor-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn("Failed to parse saved settings:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("codetutor-settings", JSON.stringify(settings));
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark"
    );
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, setSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
