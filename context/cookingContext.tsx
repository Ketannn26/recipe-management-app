// context/CookingContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { MeasurementUnit } from "@/types";

// ---------- Types ----------
interface CookingContextValue {
  servingMultiplier: number;
  setServingMultiplier: (n: number) => void;
  scaleIngredient: (qty: number) => number;
  unitSystem: "metric" | "imperial";
  setUnitSystem: (s: "metric" | "imperial") => void;
  convertUnit: (qty: number, unit: MeasurementUnit) => string;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// ---------- Conversion Map ----------
// Metric unit → Imperial equivalent
const UNIT_CONVERSIONS: Partial<
  Record<
    MeasurementUnit,
    {
      factor: number;
      imperialUnit: string;
    }
  >
> = {
  g: { factor: 0.035274, imperialUnit: "oz" },
  kg: { factor: 2.20462, imperialUnit: "lb" },
  ml: { factor: 0.033814, imperialUnit: "fl oz" },
  l: { factor: 33.814, imperialUnit: "fl oz" },
  tsp: { factor: 1, imperialUnit: "tsp" }, // same
  tbsp: { factor: 1, imperialUnit: "tbsp" }, // same
  cup: { factor: 1, imperialUnit: "cup" }, // same
};

// ---------- Context ----------
const CookingContext = createContext<CookingContextValue | null>(null);

// ---------- Provider ----------
export function CookingProvider({ children }: { children: ReactNode }) {
    
  // ✅ All 3 states read from localStorage directly — no useEffect needed
  const [servingMultiplier, setServingMultiplierState] = useState<number>(
    () => {
      if (typeof window === "undefined") return 1;
      const stored = localStorage.getItem("servingMultiplier");
      return stored ? Number(stored) : 1;
    },
  );

  const [unitSystem, setUnitSystemState] = useState<"metric" | "imperial">(
    () => {
      if (typeof window === "undefined") return "metric";
      const stored = localStorage.getItem("unitSystem");
      return stored === "imperial" ? "imperial" : "metric";
    },
  );

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
  });

  // -- Apply theme class to <html> --
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ---------- Setters (persist to localStorage) ----------
  const setServingMultiplier = useCallback((n: number) => {
    const value = Math.max(0.25, Math.round(n * 4) / 4); // min 0.25, steps of 0.25
    setServingMultiplierState(value);
    localStorage.setItem("servingMultiplier", String(value));
  }, []);

  const setUnitSystem = useCallback((s: "metric" | "imperial") => {
    setUnitSystemState(s);
    localStorage.setItem("unitSystem", s);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // ---------- Core Functions ----------

  // Scale ingredient quantity by multiplier, rounded to 2 decimal places
  const scaleIngredient = useCallback(
    (qty: number): number => {
      return Math.round(qty * servingMultiplier * 100) / 100;
    },
    [servingMultiplier],
  );

  // Convert metric → imperial if unitSystem is "imperial"
  const convertUnit = useCallback(
    (qty: number, unit: MeasurementUnit): string => {
      if (unitSystem === "metric") {
        return `${qty} ${unit}`;
      }
      const conversion = UNIT_CONVERSIONS[unit];
      if (!conversion) {
        // Units like "piece", "pinch", "to taste" don't convert
        return `${qty} ${unit}`;
      }
      const converted = Math.round(qty * conversion.factor * 100) / 100;
      return `${converted} ${conversion.imperialUnit}`;
    },
    [unitSystem],
  );

  // ---------- Context Value ----------
  const value: CookingContextValue = {
    servingMultiplier,
    setServingMultiplier,
    scaleIngredient,
    unitSystem,
    setUnitSystem,
    convertUnit,
    theme,
    toggleTheme,
  };

  return (
    <CookingContext.Provider value={value}>{children}</CookingContext.Provider>
  );
}

// ---------- Custom Hook ----------
export function useCooking(): CookingContextValue {
  const context = useContext(CookingContext);
  if (!context) {
    throw new Error("useCooking must be used inside <CookingProvider>");
  }
  return context;
}
