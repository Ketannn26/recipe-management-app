// types/recipe.ts

export type DietaryTag =
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "dairy-free"
  | "keto"
  | "paleo"
  | "nut-free";

export type Difficulty = "easy" | "medium" | "hard";

export type MeasurementUnit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "tsp"
  | "tbsp"
  | "cup"
  | "piece"
  | "pinch"
  | "to taste";

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: MeasurementUnit;
  optional: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number; // optional timer
  tip?: string;
}

export interface Nutrition {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  authorId: string;
  category: string;
  dietaryTags: DietaryTag[];
  difficulty: Difficulty;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  nutrition?: Nutrition;
  published: boolean;
  rating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFilters {
  category: string;
  dietaryTags: DietaryTag[];
  difficulty: Difficulty | "all";
  search: string;
  maxCookTime: number | null;
  published: boolean | null;
}