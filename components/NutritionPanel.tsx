// components/NutritionPanel.tsx
import { cn } from "@/lib/utils";
import type { Nutrition } from "@/types";

interface NutritionPanelProps {
  nutrition: Nutrition;
  servingMultiplier?: number;
  className?: string;
}

interface MacroBarProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  max: number;
}

function MacroBar({ label, value, unit, color, max }: MacroBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}
          <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function NutritionPanel({
  nutrition,
  servingMultiplier = 1,
  className,
}: NutritionPanelProps) {
  // Scale all values by multiplier
  const scaled = {
    calories: Math.round(nutrition.calories * servingMultiplier),
    proteinG: Math.round(nutrition.proteinG * servingMultiplier * 10) / 10,
    carbsG: Math.round(nutrition.carbsG * servingMultiplier * 10) / 10,
    fatG: Math.round(nutrition.fatG * servingMultiplier * 10) / 10,
    fiberG: Math.round(nutrition.fiberG * servingMultiplier * 10) / 10,
  };

  return (
    <div className={cn("rounded-xl border bg-card p-4 space-y-4", className)}>
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
        Nutrition Facts
      </h3>

      {/* Calories — big display */}
      <div className="text-center py-2 border-b">
        <p className="text-4xl font-bold text-primary">{scaled.calories}</p>
        <p className="text-xs text-muted-foreground mt-1">calories</p>
      </div>

      {/* Macro Bars */}
      <div className="space-y-3">
        <MacroBar
          label="Protein"
          value={scaled.proteinG}
          unit="g"
          color="bg-blue-500"
          max={scaled.calories / 4}
        />
        <MacroBar
          label="Carbs"
          value={scaled.carbsG}
          unit="g"
          color="bg-amber-500"
          max={scaled.calories / 4}
        />
        <MacroBar
          label="Fat"
          value={scaled.fatG}
          unit="g"
          color="bg-red-400"
          max={scaled.calories / 9}
        />
        <MacroBar
          label="Fiber"
          value={scaled.fiberG}
          unit="g"
          color="bg-green-500"
          max={30}
        />
      </div>

      <p className="text-xs text-center text-muted-foreground">per serving</p>
    </div>
  );
}
