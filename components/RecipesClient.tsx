// components/RecipesClient.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setRecipes } from "@/store/recipeSlice";
import { useFilteredRecipes } from "@/hooks/useFilteredRecipes";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeFiltersBar } from "@/components/RecipeFiltersBar";
import type { Recipe } from "@/types";

interface RecipesClientProps {
  initialRecipes: Recipe[];
}

export function RecipesClient({ initialRecipes }: RecipesClientProps) {
  const dispatch = useAppDispatch();

  // Hydrate Redux store with server-fetched recipes
  useEffect(() => {
    dispatch(setRecipes(initialRecipes));
  }, [initialRecipes, dispatch]);

  const { filteredRecipes, count } = useFilteredRecipes();

  return (
    <div className="space-y-6">
      <RecipeFiltersBar />
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{count}</span>{" "}
        recipes
      </p>
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-4">🍽️</p>
          <p className="text-lg font-medium">No recipes found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} variant="public" />
          ))}
        </div>
      )}
    </div>
  );
}
