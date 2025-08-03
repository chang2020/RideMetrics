import { Button } from "@/components/ui/button";
import { useUnits } from "@/lib/units";
import { Ruler } from "lucide-react";

export default function UnitsToggle() {
  const { distanceUnit, setDistanceUnit } = useUnits();

  const toggleUnit = () => {
    setDistanceUnit(distanceUnit === "km" ? "miles" : "km");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleUnit}
      className="h-8 px-2 text-gray-600 hover:text-gray-900"
      data-testid="button-units-toggle"
    >
      <Ruler className="h-4 w-4 mr-1" />
      {distanceUnit === "km" ? "miles" : "km"}
    </Button>
  );
}