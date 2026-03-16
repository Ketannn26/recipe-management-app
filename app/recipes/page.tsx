// app/recipes/page.tsx
import type { Recipe } from "@/types";
import { RecipesClient } from "@/components/RecipesClient";

async function getPublishedRecipes(): Promise<Recipe[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/recipes?published=true`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  return res.json() as Promise<Recipe[]>;
}

export default async function RecipesPage() {
  const recipes = await getPublishedRecipes();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Recipes</h1>
        <p className="text-muted-foreground mt-1">
          Discover delicious vegetarian recipes
        </p>
      </div>
      <RecipesClient initialRecipes={recipes} />
    </main>
  );
}
