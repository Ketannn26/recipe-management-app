// components/RecipeCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Pencil, Trash2, Clock, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { saveRecipe, unsaveRecipe } from "@/store/cookbookSlice";
import { cn, formatTime } from "@/lib/utils";
import type { Recipe } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
  variant: "public" | "manage";
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const DIFFICULTY_COLOR = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export function RecipeCard({
  recipe,
  variant,
  onEdit,
  onDelete,
  className,
}: RecipeCardProps) {
  const dispatch = useAppDispatch();
  const savedIds = useAppSelector((s) => s.cookbook.savedIds);
  const isSaved = savedIds.includes(recipe.id);

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const visibleTags = recipe.dietaryTags.slice(0, 3);
  const extraTags = recipe.dietaryTags.length - 3;

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault(); // prevent Link navigation
    if (isSaved) {
      dispatch(unsaveRecipe(recipe.id));
    } else {
      dispatch(saveRecipe(recipe.id));
    }
  }

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card shadow-sm",
        "hover:shadow-md transition-shadow overflow-hidden",
        className,
      )}
    >
      {/* Cover Image */}
      <Link href={`/recipes/${recipe.slug}`}>
        <div className="relative h-48 w-full bg-linear-to-br from-orange-100 to-amber-200">
          {recipe.coverImageUrl ? (
            <Image
              src={recipe.coverImageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ChefHat className="w-16 h-16 text-amber-400 opacity-50" />
            </div>
          )}
        </div>
      </Link>

      {/* Heart / Save Button */}
      <button
        onClick={toggleSave}
        className={cn(
          "absolute top-3 right-3 p-2 rounded-full",
          "bg-white/80 backdrop-blur-sm shadow",
          "hover:scale-110 transition-transform",
        )}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-colors",
            isSaved ? "fill-red-500 text-red-500" : "text-gray-400",
          )}
        />
      </button>

      {/* Published / Draft Badge (manage only) */}
      {variant === "manage" && (
        <div className="absolute top-3 left-3">
          <Badge
            className={cn(
              recipe.published
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-white",
            )}
          >
            {recipe.published ? "Published" : "Draft"}
          </Badge>
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Category + Difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {recipe.category}
          </span>
          <Badge className={cn("text-xs", DIFFICULTY_COLOR[recipe.difficulty])}>
            {recipe.difficulty}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/recipes/${recipe.slug}`}>
          <h3 className="font-semibold text-base leading-snug hover:text-primary transition-colors line-clamp-2">
            {recipe.title}
          </h3>
        </Link>

        {/* Time + Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatTime(totalTime)}</span>
          </div>
          <StarRating
            rating={recipe.rating}
            ratingCount={recipe.ratingCount}
            size="sm"
          />
        </div>

        {/* Dietary Tag Pills */}
        <div className="flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs capitalize">
              {tag}
            </Badge>
          ))}
          {extraTags > 0 && (
            <Badge variant="outline" className="text-xs">
              +{extraTags}
            </Badge>
          )}
        </div>

        {/* Manage Actions */}
        {variant === "manage" && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onEdit?.(recipe)}
            >
              <Pencil className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={() => onDelete?.(recipe.id)}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
