import { useState, useEffect, ReactNode } from "react";
import { UnitsContext, DistanceUnit, metersToKilometers, metersToMiles, mpsToKmh, mpsToMph } from "@/lib/units";

interface UnitsProviderProps {
  children: ReactNode;
}

export default function UnitsProvider({ children }: UnitsProviderProps) {
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("km");

  useEffect(() => {
    // Load unit preference from localStorage
    const savedUnit = localStorage.getItem("distanceUnit") as DistanceUnit;
    if (savedUnit && (savedUnit === "km" || savedUnit === "miles")) {
      setDistanceUnit(savedUnit);
    }
  }, []);

  const handleSetDistanceUnit = (newUnit: DistanceUnit) => {
    setDistanceUnit(newUnit);
    localStorage.setItem("distanceUnit", newUnit);
  };

  const convertDistance = (meters: number): number => {
    return distanceUnit === "km" ? metersToKilometers(meters) : metersToMiles(meters);
  };

  const getDistanceLabel = (): string => {
    return distanceUnit === "km" ? "km" : "mi";
  };

  const convertSpeed = (metersPerSecond: number): number => {
    return distanceUnit === "km" ? mpsToKmh(metersPerSecond) : mpsToMph(metersPerSecond);
  };

  const getSpeedLabel = (): string => {
    return distanceUnit === "km" ? "km/h" : "mph";
  };

  return (
    <UnitsContext.Provider 
      value={{ 
        distanceUnit, 
        setDistanceUnit: handleSetDistanceUnit, 
        convertDistance,
        getDistanceLabel,
        convertSpeed,
        getSpeedLabel
      }}
    >
      {children}
    </UnitsContext.Provider>
  );
}