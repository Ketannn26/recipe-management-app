// app/manage/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { createRecipe } from "@/store/recipeSlice";
import { useRecipeForm } from "@/hooks/useRecipeForm";
import { IngredientRow } from "@/components/IngredientRow";
import { StepCard } from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DietaryTag, Difficulty } from "@/types";

const ALL_TAGS: DietaryTag[] = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "dairy-free",
  "keto",
  "paleo",
  "nut-free",
];

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Drinks",
  "Soup",
  "Salad",
];

export default function CreateRecipePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [nutritionOpen, setNutritionOpen] = useState(false);
  const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addStep,
    updateStep,
    removeStep,
    moveStep,
  } = useRecipeForm();

  const onSubmit = handleSubmit(async (formValues) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        createRecipe({
          ...formValues,
          authorId: "chef-1", // hardcoded for now
        }),
      ).unwrap();
      router.push("/manage");
    } catch (err) {
      console.error("Failed to create recipe:", err);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Basic Info</h2>

          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={values.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("title", e.target.value)
              }
              placeholder="e.g. Paneer Butter Masala"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={values.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("description", e.target.value)
              }
              placeholder="Short description of the recipe..."
              rows={3}
            />
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1">
            <Label htmlFor="coverImageUrl">Cover Image URL</Label>
            <Input
              id="coverImageUrl"
              value={values.coverImageUrl ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("coverImageUrl", e.target.value)
              }
              placeholder="https://..."
            />
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Category *</Label>
              <Select
                value={values.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Difficulty *</Label>
              <Select
                value={values.difficulty}
                onValueChange={(v) =>
                  handleChange("difficulty", v as Difficulty)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Servings + Prep Time + Cook Time */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="servings">Servings *</Label>
              <Input
                id="servings"
                type="number"
                min={1}
                value={values.servings}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("servings", Number(e.target.value))
                }
              />
              {errors.servings && (
                <p className="text-xs text-destructive">{errors.servings}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="prepTime">Prep Time (min)</Label>
              <Input
                id="prepTime"
                type="number"
                min={0}
                value={values.prepTimeMinutes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("prepTimeMinutes", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cookTime">Cook Time (min)</Label>
              <Input
                id="cookTime"
                type="number"
                min={0}
                value={values.cookTimeMinutes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("cookTimeMinutes", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="space-y-2">
            <Label>Dietary Tags</Label>
            <div className="flex flex-wrap gap-3">
              {ALL_TAGS.map((tag) => {
                const active = values.dietaryTags.includes(tag);
                return (
                  <div key={tag} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`create-tag-${tag}`}
                      checked={active}
                      onCheckedChange={() => {
                        const updated = active
                          ? values.dietaryTags.filter((t) => t !== tag)
                          : [...values.dietaryTags, tag];
                        handleChange("dietaryTags", updated);
                      }}
                    />
                    <label
                      htmlFor={`create-tag-${tag}`}
                      className="text-sm capitalize cursor-pointer"
                    >
                      {tag}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="published"
              checked={values.published}
              onCheckedChange={(checked) =>
                handleChange("published", Boolean(checked))
              }
            />
            <label htmlFor="published" className="text-sm cursor-pointer">
              Publish immediately
            </label>
            <Badge
              className={cn(
                "ml-2",
                values.published
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white",
              )}
            >
              {values.published ? "Published" : "Draft"}
            </Badge>
          </div>
        </section>

        {/* Ingredients */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b pb-2">Ingredients *</h2>
          {errors.ingredients && (
            <p className="text-xs text-destructive">{errors.ingredients}</p>
          )}
          {values.ingredients.map((ingredient, i) => (
            <IngredientRow
              key={ingredient.id}
              ingredient={ingredient}
              index={i}
              editable
              onChange={updateIngredient}
              onRemove={removeIngredient}
              canRemove={values.ingredients.length > 1}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIngredient}
            className="gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            Add Ingredient
          </Button>
        </section>

        {/* Steps */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b pb-2">
            Instructions *
          </h2>
          {errors.steps && (
            <p className="text-xs text-destructive">{errors.steps}</p>
          )}
          {values.steps.map((step, i) => (
            <StepCard
              key={step.stepNumber}
              step={step}
              index={i}
              editable
              onChange={updateStep}
              onRemove={removeStep}
              onMoveUp={(idx) => moveStep(idx, idx - 1)}
              onMoveDown={(idx) => moveStep(idx, idx + 1)}
              isFirst={i === 0}
              isLast={i === values.steps.length - 1}
              activeTimerIndex={activeTimerIndex}
              onTimerStart={setActiveTimerIndex}
              onTimerStop={() => setActiveTimerIndex(null)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStep}
            className="gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            Add Step
          </Button>
        </section>

        {/* Nutrition (collapsible) */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setNutritionOpen((p) => !p)}
            className="flex items-center gap-2 text-xl font-semibold border-b pb-2 w-full text-left"
          >
            Nutrition (optional)
            {nutritionOpen ? (
              <ChevronUp className="w-5 h-5 ml-auto" />
            ) : (
              <ChevronDown className="w-5 h-5 ml-auto" />
            )}
          </button>

          {nutritionOpen && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(
                [
                  ["calories", "Calories (kcal)"],
                  ["proteinG", "Protein (g)"],
                  ["carbsG", "Carbs (g)"],
                  ["fatG", "Fat (g)"],
                  ["fiberG", "Fiber (g)"],
                ] as const
              ).map(([field, label]) => (
                <div key={field} className="space-y-1">
                  <Label htmlFor={field}>{label}</Label>
                  <Input
                    id={field}
                    type="number"
                    min={0}
                    value={values.nutrition?.[field] ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange("nutrition", {
                        ...values.nutrition,
                        calories: values.nutrition?.calories ?? 0,
                        proteinG: values.nutrition?.proteinG ?? 0,
                        carbsG: values.nutrition?.carbsG ?? 0,
                        fatG: values.nutrition?.fatG ?? 0,
                        fiberG: values.nutrition?.fiberG ?? 0,
                        [field]: Number(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSubmitting ? "Creating..." : "Create Recipe"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/manage")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
