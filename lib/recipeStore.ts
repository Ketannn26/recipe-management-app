// lib/recipeStore.ts
import type { Recipe } from "@/types";

const recipes: Recipe[] = [
  {
    id: "1",
    title: "Paneer Butter Masala",
    slug: "paneer-butter-masala",
    description: "A rich and creamy North Indian curry made with soft paneer cubes.",
    coverImageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
    authorId: "chef-1",
    category: "Dinner",
    dietaryTags: ["vegetarian", "gluten-free"],
    difficulty: "medium",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    ingredients: [
      { id: "i1", name: "Paneer", quantity: 250, unit: "g", optional: false },
      { id: "i2", name: "Butter", quantity: 2, unit: "tbsp", optional: false },
      { id: "i3", name: "Tomato Puree", quantity: 200, unit: "ml", optional: false },
      { id: "i4", name: "Heavy Cream", quantity: 100, unit: "ml", optional: false },
      { id: "i5", name: "Garam Masala", quantity: 1, unit: "tsp", optional: false },
      { id: "i6", name: "Kasuri Methi", quantity: 1, unit: "tsp", optional: true },
    ],
    steps: [
      { stepNumber: 1, instruction: "Heat butter in a pan and sauté onions until golden.", durationMinutes: 5 },
      { stepNumber: 2, instruction: "Add tomato puree and cook until oil separates.", durationMinutes: 10, tip: "Cook on medium flame for best results." },
      { stepNumber: 3, instruction: "Add paneer cubes and garam masala. Mix gently.", durationMinutes: 5 },
      { stepNumber: 4, instruction: "Pour in cream and simmer for 5 minutes.", durationMinutes: 5, tip: "Don't boil after adding cream." },
    ],
    nutrition: {
      calories: 380, proteinG: 18, carbsG: 14, fatG: 28, fiberG: 3,
    },
    published: true,
    rating: 4.7,
    ratingCount: 34,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Masala Dosa",
    slug: "masala-dosa",
    description: "Crispy South Indian crepe stuffed with spiced potato filling.",
    coverImageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
    authorId: "chef-1",
    category: "Breakfast",
    dietaryTags: ["vegetarian", "vegan", "dairy-free"],
    difficulty: "hard",
    servings: 4,
    prepTimeMinutes: 480,
    cookTimeMinutes: 20,
    ingredients: [
      { id: "i7", name: "Rice", quantity: 2, unit: "cup", optional: false },
      { id: "i8", name: "Urad Dal", quantity: 1, unit: "cup", optional: false },
      { id: "i9", name: "Potato", quantity: 3, unit: "piece", optional: false },
      { id: "i10", name: "Mustard Seeds", quantity: 1, unit: "tsp", optional: false },
      { id: "i11", name: "Turmeric", quantity: 1, unit: "tsp", optional: false },
      { id: "i12", name: "Green Chili", quantity: 2, unit: "piece", optional: true },
    ],
    steps: [
      { stepNumber: 1, instruction: "Soak rice and urad dal for 8 hours, then grind to a smooth batter.", durationMinutes: 480, tip: "Ferment batter overnight for best results." },
      { stepNumber: 2, instruction: "Boil and mash potatoes. Temper with mustard seeds and turmeric.", durationMinutes: 15 },
      { stepNumber: 3, instruction: "Spread batter on hot tawa in a circular motion.", durationMinutes: 3, tip: "Tawa must be very hot before pouring batter." },
      { stepNumber: 4, instruction: "Add potato filling and fold the dosa.", durationMinutes: 2 },
    ],
    nutrition: {
      calories: 320, proteinG: 9, carbsG: 58, fatG: 6, fiberG: 5,
    },
    published: true,
    rating: 4.5,
    ratingCount: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Palak Paneer",
    slug: "palak-paneer",
    description: "Creamy spinach curry with soft paneer — a classic North Indian favourite.",
    coverImageUrl: "https://images.unsplash.com/photo-1604152135912-04a022e23696",
    authorId: "chef-2",
    category: "Dinner",
    dietaryTags: ["vegetarian", "gluten-free"],
    difficulty: "easy",
    servings: 3,
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    ingredients: [
      { id: "i13", name: "Spinach", quantity: 300, unit: "g", optional: false },
      { id: "i14", name: "Paneer", quantity: 200, unit: "g", optional: false },
      { id: "i15", name: "Onion", quantity: 1, unit: "piece", optional: false },
      { id: "i16", name: "Garlic", quantity: 4, unit: "piece", optional: false },
      { id: "i17", name: "Fresh Cream", quantity: 2, unit: "tbsp", optional: true },
      { id: "i18", name: "Cumin Seeds", quantity: 1, unit: "tsp", optional: false },
    ],
    steps: [
      { stepNumber: 1, instruction: "Blanch spinach in boiling water for 2 minutes, then blend smooth.", durationMinutes: 5, tip: "Add ice water after blanching to keep the green color." },
      { stepNumber: 2, instruction: "Sauté onion and garlic in oil until golden.", durationMinutes: 8 },
      { stepNumber: 3, instruction: "Add spinach puree and cook for 5 minutes.", durationMinutes: 5 },
      { stepNumber: 4, instruction: "Add paneer and cream. Simmer for 5 minutes.", durationMinutes: 5 },
    ],
    nutrition: {
      calories: 290, proteinG: 16, carbsG: 10, fatG: 20, fiberG: 4,
    },
    published: true,
    rating: 4.6,
    ratingCount: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Mango Lassi",
    slug: "mango-lassi",
    description: "Refreshing Indian yogurt-based mango drink — perfect for summer.",
    coverImageUrl: "https://images.unsplash.com/photo-1527661591475-527312dd65f5",
    authorId: "chef-2",
    category: "Drinks",
    dietaryTags: ["vegetarian", "gluten-free"],
    difficulty: "easy",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    ingredients: [
      { id: "i19", name: "Mango Pulp", quantity: 200, unit: "ml", optional: false },
      { id: "i20", name: "Yogurt", quantity: 1, unit: "cup", optional: false },
      { id: "i21", name: "Milk", quantity: 100, unit: "ml", optional: false },
      { id: "i22", name: "Sugar", quantity: 2, unit: "tbsp", optional: true },
      { id: "i23", name: "Cardamom Powder", quantity: 1, unit: "pinch", optional: true },
    ],
    steps: [
      { stepNumber: 1, instruction: "Add mango pulp, yogurt and milk to a blender.", durationMinutes: 1 },
      { stepNumber: 2, instruction: "Add sugar and cardamom. Blend until smooth.", durationMinutes: 2, tip: "Chill all ingredients before blending for best taste." },
      { stepNumber: 3, instruction: "Pour into glasses and serve chilled.", durationMinutes: 1 },
    ],
    nutrition: {
      calories: 210, proteinG: 6, carbsG: 38, fatG: 4, fiberG: 2,
    },
    published: true,
    rating: 4.8,
    ratingCount: 41,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Chana Masala",
    slug: "chana-masala",
    description: "Hearty and spicy chickpea curry — a popular North Indian street food.",
    coverImageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    authorId: "chef-1",
    category: "Lunch",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    difficulty: "medium",
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 35,
    ingredients: [
      { id: "i24", name: "Chickpeas", quantity: 400, unit: "g", optional: false },
      { id: "i25", name: "Onion", quantity: 2, unit: "piece", optional: false },
      { id: "i26", name: "Tomato", quantity: 3, unit: "piece", optional: false },
      { id: "i27", name: "Chana Masala Powder", quantity: 2, unit: "tbsp", optional: false },
      { id: "i28", name: "Ginger Garlic Paste", quantity: 1, unit: "tbsp", optional: false },
      { id: "i29", name: "Coriander Leaves", quantity: 1, unit: "tbsp", optional: true },
    ],
    steps: [
      { stepNumber: 1, instruction: "Sauté onions until deep golden brown.", durationMinutes: 10, tip: "The darker the onions, the richer the curry." },
      { stepNumber: 2, instruction: "Add ginger garlic paste and cook for 2 minutes.", durationMinutes: 2 },
      { stepNumber: 3, instruction: "Add tomatoes and chana masala powder. Cook until oil separates.", durationMinutes: 10 },
      { stepNumber: 4, instruction: "Add chickpeas and 1 cup water. Simmer for 15 minutes.", durationMinutes: 15 },
      { stepNumber: 5, instruction: "Garnish with coriander and serve hot.", tip: "Squeeze lemon juice on top before serving." },
    ],
    nutrition: {
      calories: 310, proteinG: 14, carbsG: 46, fatG: 8, fiberG: 12,
    },
    published: true,
    rating: 4.4,
    ratingCount: 19,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ---------- CRUD helpers ----------
export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function addRecipe(recipe: Recipe): Recipe {
  recipes.unshift(recipe);
  return recipe;
}

export function updateRecipeById(id: string, data: Partial<Recipe>): Recipe | null {
  const index = recipes.findIndex((r) => r.id === id);
  if (index === -1) return null;
  recipes[index] = { ...recipes[index], ...data, updatedAt: new Date().toISOString() };
  return recipes[index];
}

export function deleteRecipeById(id: string): boolean {
  const index = recipes.findIndex((r) => r.id === id);
  if (index === -1) return false;
  recipes.splice(index, 1);
  return true;
}

export function isSlugUnique(slug: string, excludeId?: string): boolean {
  return !recipes.some((r) => r.slug === slug && r.id !== excludeId);
}