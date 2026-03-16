// hooks/useRecipeScaler.ts
import { useMemo } from "react";
import { useCooking } from "@/context/cookingContext";
import type { Recipe, Ingredient, Nutrition } from "@/types";

interface UseRecipeScalerResult {
  scaledIngredients: Ingredient[];
  scaledServings: number;
  scaledNutrition: Nutrition | undefined;
}

export function useRecipeScaler(
  recipe: Recipe,
  multiplier: number
): UseRecipeScalerResult {
  const { scaleIngredient } = useCooking();

  // useMemo so it only recalculates when recipe or multiplier changes
  const scaledIngredients = useMemo<Ingredient[]>(() => {
    return recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: scaleIngredient(ingredient.quantity),
    }));
  }, [recipe.ingredients, scaleIngredient]);

  const scaledServings = useMemo<number>(() => {
    return Math.round(recipe.servings * multiplier * 100) / 100;
  }, [recipe.servings, multiplier]);

  const scaledNutrition = useMemo<Nutrition | undefined>(() => {
    if (!recipe.nutrition) return undefined;
    return {
      calories: Math.round(recipe.nutrition.calories * multiplier * 100) / 100,
      proteinG: Math.round(recipe.nutrition.proteinG * multiplier * 100) / 100,
      carbsG:   Math.round(recipe.nutrition.carbsG * multiplier * 100) / 100,
      fatG:     Math.round(recipe.nutrition.fatG * multiplier * 100) / 100,
      fiberG:   Math.round(recipe.nutrition.fiberG * multiplier * 100) / 100,
    };
  }, [recipe.nutrition, multiplier]);

  return { scaledIngredients, scaledServings, scaledNutrition };
}