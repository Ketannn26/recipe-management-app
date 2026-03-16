// app/cookbook/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSavedIds } from "@/store/cookbookSlice";
import { setRecipes } from "@/store/recipeSlice";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import type { Recipe } from "@/types";

export default function CookbookPage() {
  const dispatch = useAppDispatch();
  const savedIds = useAppSelector((s) => s.cookbook.savedIds);
  const recipes = useAppSelector((s) => s.recipes.recipes);

  // Hydrate savedIds from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("cookbook_savedIds");
    if (stored) {
      dispatch(setSavedIds(JSON.parse(stored) as string[]));
    }
  }, [dispatch]);

  // Persist savedIds to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cookbook_savedIds", JSON.stringify(savedIds));
  }, [savedIds]);

  // Fetch all recipes if store is empty
  useEffect(() => {
    if (recipes.length === 0) {
      fetch("/api/recipes?published=true")
        .then((r) => r.json())
        .then((data: Recipe[]) => dispatch(setRecipes(data)))
        .catch(console.error);
    }
  }, [recipes.length, dispatch]);

  const savedRecipes = recipes.filter((r) => savedIds.includes(r.id));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-amber-500" />
          My Cookbook
        </h1>
        <p className="text-muted-foreground mt-1">
          Your saved recipes — {savedIds.length} recipe
          {savedIds.length !== 1 ? "s" : ""}
        </p>
      </div>

      {savedRecipes.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="text-7xl">📖</div>
          <h2 className="text-2xl font-bold">Your cookbook is empty</h2>
          <p className="text-muted-foreground max-w-sm">
            Save recipes by clicking the heart icon on any recipe card.
          </p>
          <Button asChild className="mt-2 bg-amber-600 hover:bg-amber-700">
            <Link href="/recipes">Browse Recipes</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} variant="public" />
          ))}
        </div>
      )}
    </main>
  );
}
