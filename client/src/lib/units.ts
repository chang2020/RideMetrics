import { createContext, useContext } from "react";

export type DistanceUnit = "km" | "miles";

export interface UnitsContextType {
  distanceUnit: DistanceUnit;
  setDistanceUnit: (unit: DistanceUnit) => void;
  convertDistance: (meters: number) => number;
  getDistanceLabel: () => string;
  convertSpeed: (metersPerSecond: number) => number;
  getSpeedLabel: () => string;
}

export const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

export const useUnits = () => {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error("useUnits must be used within a UnitsProvider");
  }
  return context;
};

// Conversion functions
export const metersToKilometers = (meters: number): number => meters / 1000;
export const metersToMiles = (meters: number): number => meters * 0.000621371;
export const mpsToKmh = (mps: number): number => mps * 3.6;
export const mpsToMph = (mps: number): number => mps * 2.23694;