// components/RecipeDetailClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { rateRecipe } from "@/store/recipeSlice";
import { useCooking } from "@/context/cookingContext";
import { useRecipeScaler } from "@/hooks/useRecipeScaler";
import { NutritionPanel } from "@/components/NutritionPanel";
import { IngredientRow } from "@/components/IngredientRow";
import { StepCard } from "@/components/StepCard";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChefHat, Clock, Users, Minus, Plus } from "lucide-react";
import { formatTime, cn } from "@/lib/utils";
import type { Recipe } from "@/types";

interface RecipeDetailClientProps {
  recipe: Recipe;
}

export function RecipeDetailClient({ recipe }: RecipeDetailClientProps) {
  const dispatch = useAppDispatch();
  const { servingMultiplier, setServingMultiplier, unitSystem, setUnitSystem } =
    useCooking();

  // Timer state — only one timer at a time
  const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null);

  const { scaledIngredients, scaledServings, scaledNutrition } =
    useRecipeScaler(recipe, servingMultiplier);

  async function handleRate(rating: number) {
    await dispatch(rateRecipe({ id: recipe.id, rating }));
  }

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Cover Image */}
      <div className="relative h-72 w-full rounded-2xl overflow-hidden bg-linear-to-br from-amber-100 to-orange-200">
        {recipe.coverImageUrl ? (
          <Image
            src={recipe.coverImageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ChefHat className="w-24 h-24 text-amber-300" />
          </div>
        )}
      </div>

      {/* Title + Meta */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{recipe.category}</Badge>
          <Badge
            className={cn(
              recipe.difficulty === "easy" && "bg-green-100 text-green-700",
              recipe.difficulty === "medium" && "bg-yellow-100 text-yellow-700",
              recipe.difficulty === "hard" && "bg-red-100 text-red-700",
            )}
          >
            {recipe.difficulty}
          </Badge>
          {recipe.dietaryTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl font-bold">{recipe.title}</h1>
        <p className="text-muted-foreground text-lg">{recipe.description}</p>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Prep: {formatTime(recipe.prepTimeMinutes)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Cook: {formatTime(recipe.cookTimeMinutes)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="font-medium">Total: {formatTime(totalTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{scaledServings} servings</span>
          </div>
        </div>

        <StarRating
          rating={recipe.rating}
          ratingCount={recipe.ratingCount}
          size="md"
        />
      </div>

      <Separator />

      {/* Controls — Serving Adjuster + Unit Toggle */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Serving Multiplier */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Servings:</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setServingMultiplier(servingMultiplier - 0.25)}
              disabled={servingMultiplier <= 0.25}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-16 text-center font-semibold">
              {scaledServings}
            </span>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setServingMultiplier(servingMultiplier + 0.25)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Unit System Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Units:</span>
          <div className="flex rounded-lg border overflow-hidden">
            <button
              type="button"
              onClick={() => setUnitSystem("metric")}
              className={cn(
                "px-3 py-1 text-sm transition-colors",
                unitSystem === "metric"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted",
              )}
            >
              Metric
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem("imperial")}
              className={cn(
                "px-3 py-1 text-sm transition-colors",
                unitSystem === "imperial"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted",
              )}
            >
              Imperial
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Ingredients</h2>
        <div className="rounded-xl border bg-card p-4">
          {scaledIngredients.map((ingredient, i) => (
            <IngredientRow
              key={ingredient.id}
              ingredient={ingredient}
              index={i}
              scaled
            />
          ))}
        </div>
      </section>

      {/* Nutrition Panel */}
      {scaledNutrition && (
        <NutritionPanel
          nutrition={recipe.nutrition!}
          servingMultiplier={servingMultiplier}
        />
      )}

      <Separator />

      {/* Steps */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Instructions</h2>
        {recipe.steps.map((step, i) => (
          <StepCard
            key={step.stepNumber}
            step={step}
            index={i}
            activeTimerIndex={activeTimerIndex}
            onTimerStart={(idx) => setActiveTimerIndex(idx)}
            onTimerStop={() => setActiveTimerIndex(null)}
          />
        ))}
      </section>

      <Separator />

      {/* Rate This Recipe */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Rate This Recipe</h2>
        <p className="text-muted-foreground text-sm">
          How would you rate this recipe?
        </p>
        <StarRating
          rating={recipe.rating}
          ratingCount={recipe.ratingCount}
          interactive
          onRate={handleRate}
          size="lg"
        />
      </section>
    </main>
  );
}
