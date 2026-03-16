// app/api/recipes/[id]/rate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRecipeById, updateRecipeById } from "@/lib/recipeStore";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const body = (await req.json()) as { rating: unknown };

  // Validate rating value
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be an integer between 1 and 5" },
      { status: 400 },
    );
  }

  // Recalculate running average
  // Formula: newAvg = (oldAvg * oldCount + newRating) / (oldCount + 1)
  const newRatingCount = recipe.ratingCount + 1;
  const newRating =
    Math.round(
      ((recipe.rating * recipe.ratingCount + rating) / newRatingCount) * 10,
    ) / 10;

  const updated = updateRecipeById(id, {
    rating: newRating,
    ratingCount: newRatingCount,
  });

  if (!updated) {
    return NextResponse.json(
      { error: "Rating update failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    rating: updated.rating,
    ratingCount: updated.ratingCount,
  });
}
