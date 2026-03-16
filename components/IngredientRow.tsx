// components/IngredientRow.tsx
"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCooking } from "@/context/cookingContext";
import { cn } from "@/lib/utils";
import type { Ingredient, MeasurementUnit } from "@/types";

const UNITS: MeasurementUnit[] = [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "piece",
  "pinch",
  "to taste",
];

interface IngredientRowProps {
  ingredient: Ingredient;
  index: number;
  scaled?: boolean;
  editable?: boolean;
  onChange?: (
    index: number,
    field: keyof Ingredient,
    value: string | number | boolean,
  ) => void;
  onRemove?: (index: number) => void;
  canRemove?: boolean;
  className?: string;
}

export function IngredientRow({
  ingredient,
  index,
  scaled = false,
  editable = false,
  onChange,
  onRemove,
  canRemove = true,
  className,
}: IngredientRowProps) {
  const { scaleIngredient, convertUnit } = useCooking();

  // Display quantity — scaled or raw
  const displayQty = scaled
    ? scaleIngredient(ingredient.quantity)
    : ingredient.quantity;

  // Display with unit conversion
  const displayValue = convertUnit(displayQty, ingredient.unit);

  // ---------- Read Mode ----------
  if (!editable) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 py-2 border-b last:border-0",
          className,
        )}
      >
        <span className="font-medium text-sm w-24 shrink-0 text-right">
          {displayValue}
        </span>
        <span className="text-sm flex-1">{ingredient.name}</span>
        {ingredient.optional && (
          <span className="text-xs text-muted-foreground italic">optional</span>
        )}
      </div>
    );
  }

  // ---------- Edit Mode ----------
  return (
    <div className={cn("flex items-center gap-2 py-2", className)}>
      {/* Quantity */}
      <Input
        type="number"
        min={0}
        step={0.1}
        value={ingredient.quantity}
        onChange={(e) => onChange?.(index, "quantity", Number(e.target.value))}
        className="w-20 shrink-0"
        placeholder="Qty"
      />

      {/* Unit */}
      <Select
        value={ingredient.unit}
        onValueChange={(val) =>
          onChange?.(index, "unit", val as MeasurementUnit)
        }
      >
        <SelectTrigger className="w-28 shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {UNITS.map((u) => (
            <SelectItem key={u} value={u}>
              {u}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Name */}
      <Input
        type="text"
        value={ingredient.name}
        onChange={(e) => onChange?.(index, "name", e.target.value)}
        className="flex-1"
        placeholder="Ingredient name"
      />

      {/* Optional checkbox */}
      <div className="flex items-center gap-1 shrink-0">
        <Checkbox
          id={`optional-${index}`}
          checked={ingredient.optional}
          onCheckedChange={(checked) =>
            onChange?.(index, "optional", Boolean(checked))
          }
        />
        <label
          htmlFor={`optional-${index}`}
          className="text-xs text-muted-foreground cursor-pointer"
        >
          Optional
        </label>
      </div>

      {/* Remove Button */}
      {canRemove && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => onRemove?.(index)}
          className="shrink-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
