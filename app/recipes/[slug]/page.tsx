// app/recipes/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Recipe } from "@/types";
import { RecipeDetailClient } from "@/components/RecipeDetailClient";

async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/recipes?slug=${slug}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.json() as Promise<Recipe>;
}

interface RecipeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe || !recipe.published) notFound();

  return <RecipeDetailClient recipe={recipe} />;
}
