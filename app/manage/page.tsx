// app/manage/page.tsx
import type { Recipe } from "@/types";
import { ManageDashboardClient } from "@/components/ManageDashboardClient";

async function getAllMyRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/recipes`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json() as Promise<Recipe[]>;
}

export default async function ManagePage() {
  const recipes = await getAllMyRecipes();
  return <ManageDashboardClient initialRecipes={recipes} />;
}
