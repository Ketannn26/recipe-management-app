// app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getRecipeById,
  updateRecipeById,
  deleteRecipeById,
  isSlugUnique,
} from "@/lib/recipeStore";
import { generateSlug } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

// ---------- GET /api/recipes/[id] ----------
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const recipe = getRecipeById(id);
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }
  return NextResponse.json(recipe);
}

// ---------- PUT /api/recipes/[id] ----------
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const body = (await req.json()) as Partial<typeof recipe>;

  // Recompute slug if title changed
  let slug = recipe.slug;
  if (body.title && body.title !== recipe.title) {
    slug = generateSlug(body.title);
    let counter = 1;
    while (!isSlugUnique(slug, id)) {
      slug = `${generateSlug(body.title)}-${counter++}`;
    }
  }

  const updated = updateRecipeById(id, { ...body, slug });
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(updated);
}

// ---------- DELETE /api/recipes/[id] ----------
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const deleted = deleteRecipeById(id);
  if (!deleted) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Recipe deleted successfully" });
}
