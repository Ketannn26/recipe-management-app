// components/ManageDashboardClient.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setRecipes,
  deleteRecipe,
  setSelectedRecipe,
} from "@/store/recipeSlice";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import type { Recipe } from "@/types";

interface ManageDashboardClientProps {
  initialRecipes: Recipe[];
}

export function ManageDashboardClient({
  initialRecipes,
}: ManageDashboardClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const recipes = useAppSelector((s) => s.recipes.recipes);

  useEffect(() => {
    dispatch(setRecipes(initialRecipes));
  }, [initialRecipes, dispatch]);

  function handleEdit(recipe: Recipe) {
    dispatch(setSelectedRecipe(recipe));
    router.push(`/manage/${recipe.id}/edit`);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this recipe?")) return;
    await dispatch(deleteRecipe(id));
  }

  return (
    <main className="px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <p className="text-muted-foreground mt-1">
            {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/manage/create">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Recipe
          </Link>
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-4">🍳</p>
          <p className="text-lg font-medium">No recipes yet</p>
          <p className="text-sm">Create your first recipe to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              variant="manage"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}
