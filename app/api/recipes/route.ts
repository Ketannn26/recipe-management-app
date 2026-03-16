// app/api/recipes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllRecipes, addRecipe, isSlugUnique } from "@/lib/recipeStore";
import { generateSlug } from "@/lib/utils";
import type { Recipe, DietaryTag, Difficulty } from "@/types";
import { randomUUID } from "crypto";

// ✅ Define type separately — clean and reusable
type CreateRecipeBody = Omit< 
  Recipe,
  "id" | "slug" | "rating" | "ratingCount" | "createdAt" | "updatedAt"
>;

// ---------- GET /api/recipes ----------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty") as Difficulty | null;
  const search = searchParams.get("search");
  const maxCookTime = searchParams.get("maxCookTime");
  const published = searchParams.get("published");
  const slug = searchParams.get("slug");
  const dietaryTagsParam = searchParams.get("dietaryTags");

  const dietaryTags: DietaryTag[] = dietaryTagsParam
    ? (dietaryTagsParam.split(",") as DietaryTag[])
    : [];

  let results = getAllRecipes();

  // Filter by slug (for recipe detail page)
  if (slug) {
    const found = results.find((r) => r.slug === slug);
    if (!found) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    return NextResponse.json(found);
  }

  // Apply filters
  if (category) {
    results = results.filter((r) => r.category === category);
  }
  if (difficulty) {
    results = results.filter((r) => r.difficulty === difficulty);
  }
  if (dietaryTags.length > 0) {
    results = results.filter((r) =>
      dietaryTags.every((tag) => r.dietaryTags.includes(tag)),
    );
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }
  if (maxCookTime) {
    const max = Number(maxCookTime);
    results = results.filter(
      (r) => r.prepTimeMinutes + r.cookTimeMinutes <= max,
    );
  }
  if (published !== null) {
    const isPublished = published === "true";
    results = results.filter((r) => r.published === isPublished);
  }

  // Sort by createdAt descending
  results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return NextResponse.json(results);
}

// ---------- POST /api/recipes ----------
export async function POST(req: NextRequest) {
  // ✅ Clean usage of the separately defined type
  const body = (await req.json()) as CreateRecipeBody;

  // Validation
  if (!body.title || body.title.trim().length < 3) {
    return NextResponse.json(
      { error: "Title must be at least 3 characters" },
      { status: 400 },
    );
  }
  if (!body.ingredients || body.ingredients.length < 1) {
    return NextResponse.json(
      { error: "At least 1 ingredient is required" },
      { status: 400 },
    );
  }
  if (!body.steps || body.steps.length < 1) {
    return NextResponse.json(
      { error: "At least 1 step is required" },
      { status: 400 },
    );
  }
  if (!body.servings || body.servings < 1) {
    return NextResponse.json(
      { error: "Servings must be at least 1" },
      { status: 400 },
    );
  }
  if (body.prepTimeMinutes < 0 || body.cookTimeMinutes < 0) {
    return NextResponse.json(
      { error: "Time values cannot be negative" },
      { status: 400 },
    );
  }

  // Generate unique slug
  let slug = generateSlug(body.title);
  let counter = 1;
  while (!isSlugUnique(slug)) {
    slug = `${generateSlug(body.title)}-${counter++}`;
  }

  // Build the full recipe
  const newRecipe: Recipe = {
    ...body,
    id: randomUUID(),
    slug,
    rating: 0,
    ratingCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  addRecipe(newRecipe);
  return NextResponse.json(newRecipe, { status: 201 });
}
