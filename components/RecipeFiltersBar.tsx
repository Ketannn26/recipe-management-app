// components/RecipeFiltersBar.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilters, clearFilters } from "@/store/recipeSlice";
import { useFilteredRecipes } from "@/hooks/useFilteredRecipes";
import { cn } from "@/lib/utils";
import type { DietaryTag, Difficulty } from "@/types";
import { X } from "lucide-react";

const ALL_TAGS: DietaryTag[] = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "dairy-free",
  "keto",
  "paleo",
  "nut-free",
];

interface RecipeFiltersBarProps {
  className?: string;
}

export function RecipeFiltersBar({ className }: RecipeFiltersBarProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.recipes.filters);
  const { categories } = useFilteredRecipes();

  // Count how many filters are active
  const activeCount = [
    filters.category,
    filters.search,
    filters.difficulty !== "all",
    filters.maxCookTime !== null,
    filters.dietaryTags.length > 0,
  ].filter(Boolean).length;

  function toggleTag(tag: DietaryTag) {
    const already = filters.dietaryTags.includes(tag);
    dispatch(
      setFilters({
        dietaryTags: already
          ? filters.dietaryTags.filter((t) => t !== tag)
          : [...filters.dietaryTags, tag],
      }),
    );
  }

  return (
    <div className={cn("space-y-4 p-4 rounded-xl border bg-card", className)}>
      {/* Top Row — Search + Clear */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search recipes..."
          value={filters.search}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
          className="flex-1"
        />
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFilters())}
            className="gap-1 text-muted-foreground"
          >
            <X className="w-3 h-3" />
            Clear All
            <Badge className="ml-1 bg-primary text-primary-foreground text-xs">
              {activeCount}
            </Badge>
          </Button>
        )}
      </div>

      {/* Second Row — Category + Difficulty + Max Time */}
      <div className="flex flex-wrap gap-3">
        {/* Category */}
        <Select
          value={filters.category || "all"}
          onValueChange={(v) =>
            dispatch(setFilters({ category: v === "all" ? "" : v }))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty */}
        <Select
          value={filters.difficulty}
          onValueChange={(v) =>
            dispatch(setFilters({ difficulty: v as Difficulty | "all" }))
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Max Cook Time */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Max time:
          </span>
          <Input
            type="number"
            min={0}
            placeholder="mins"
            value={filters.maxCookTime ?? ""}
            onChange={(e) =>
              dispatch(
                setFilters({
                  maxCookTime: e.target.value ? Number(e.target.value) : null,
                }),
              )
            }
            className="w-24"
          />
        </div>
      </div>

      {/* Dietary Tags */}
      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map((tag) => {
          const active = filters.dietaryTags.includes(tag);
          return (
            <div key={tag} className="flex items-center gap-1">
              <Checkbox
                id={`tag-${tag}`}
                checked={active}
                onCheckedChange={() => toggleTag(tag)}
              />
              <label
                htmlFor={`tag-${tag}`}
                className={cn(
                  "text-xs capitalize cursor-pointer",
                  active ? "text-primary font-medium" : "text-muted-foreground",
                )}
              >
                {tag}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
