// app/page.tsx
import Link from "next/link";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/types";

async function getAllRecipes(): Promise<Recipe[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/recipes?published=true`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const all = (await res.json()) as Recipe[];
  return all.slice(0, 3);
}

export default async function HomePage() {
  const recipes = await getAllRecipes();

  return (
    <main className="min-h-screen">
      <section className="bg-linear-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold text-amber-900 dark:text-amber-100">
            Cook Something Amazing 🍳
          </h1>
          <p className="text-lg text-amber-700 dark:text-amber-300 max-w-xl mx-auto">
            Browse hundreds of vegetarian recipes, save your favourites, and
            cook with confidence using step-by-step timers.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Link href="/recipes">Browse Recipes</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/manage/create">Create Recipe</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recipes</h2>
          <Button asChild variant="ghost">
            <Link href="/recipes">View All →</Link>
          </Button>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="text-lg font-medium">No recipes yet</p>
            <p className="text-sm">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} variant="public" />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
