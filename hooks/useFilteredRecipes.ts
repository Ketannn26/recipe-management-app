// hooks/useFilteredRecipes.ts
import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";

export function useFilteredRecipes() {
  const recipes = useAppSelector((state) => state.recipes.recipes);
  const filters = useAppSelector((state) => state.recipes.filters);

  // Get all unique categories from FULL unfiltered list
  const categories = useMemo<string[]>(() => {
    const all = recipes.map((r) => r.category);
    return Array.from(new Set(all)).sort();
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {

      // 1. Category filter
      if (filters.category && recipe.category !== filters.category)
        return false;

      // 2. Dietary tags — recipe must have ALL selected tags
      if (filters.dietaryTags.length > 0) {
        const hasAll = filters.dietaryTags.every((tag) =>
          recipe.dietaryTags.includes(tag)
        );
        if (!hasAll) return false;
      }

      // 3. Difficulty filter
      if (filters.difficulty !== "all" && recipe.difficulty !== filters.difficulty)
        return false;

      // 4. Search filter — checks title and description
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const inTitle = recipe.title.toLowerCase().includes(query);
        const inDesc = recipe.description.toLowerCase().includes(query);
        if (!inTitle && !inDesc) return false;
      }

      // 5. Max cook time filter
      if (filters.maxCookTime !== null) {
        const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
        if (totalTime > filters.maxCookTime) return false;
      }

      // 6. Published filter
      if (filters.published !== null && recipe.published !== filters.published)
        return false;

      return true;
    });
  }, [recipes, filters]);

  return {
    filteredRecipes,
    count: filteredRecipes.length,
    categories,
  };
}