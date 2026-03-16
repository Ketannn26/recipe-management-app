// store/recipeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Recipe, RecipeFilters, DietaryTag, Difficulty } from "@/types";

// ---------- State Shape ----------
interface RecipeState {
  recipes: Recipe[];
  filters: RecipeFilters;
  selectedRecipe: Recipe | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialFilters: RecipeFilters = {
  category: "",
  dietaryTags: [],
  difficulty: "all",
  search: "",
  maxCookTime: null,
  published: null,
};

const initialState: RecipeState = {
  recipes: [],
  filters: initialFilters,
  selectedRecipe: null,
  status: "idle",
  error: null,
};

// ---------- Async Thunks ----------

// Fetch all recipes (with optional filters)
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchAll",
  async (params?: Partial<RecipeFilters>) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.difficulty && params.difficulty !== "all")
      query.set("difficulty", params.difficulty);
    if (params?.search) query.set("search", params.search);
    if (params?.maxCookTime)
      query.set("maxCookTime", String(params.maxCookTime));
    if (params?.published !== null && params?.published !== undefined)
      query.set("published", String(params.published));
    if (params?.dietaryTags?.length)
      query.set("dietaryTags", params.dietaryTags.join(","));

    const res = await fetch(`/api/recipes?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch recipes");
    return (await res.json()) as Recipe[];
  }
);

// Create a new recipe
export const createRecipe = createAsyncThunk(
  "recipes/create",
  async (data: Omit<Recipe, "id" | "slug" | "rating" | "ratingCount" | "createdAt" | "updatedAt">) => {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create recipe");
    return (await res.json()) as Recipe;
  }
);

// Edit an existing recipe
export const editRecipe = createAsyncThunk(
  "recipes/edit",
  async ({ id, data }: { id: string; data: Partial<Recipe> }) => {
    const res = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update recipe");
    return (await res.json()) as Recipe;
  }
);

// Delete a recipe
export const deleteRecipe = createAsyncThunk(
  "recipes/delete",
  async (id: string) => {
    const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete recipe");
    return id;
  }
);

// Rate a recipe
export const rateRecipe = createAsyncThunk(
  "recipes/rate",
  async ({ id, rating }: { id: string; rating: number }) => {
    const res = await fetch(`/api/recipes/${id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
    if (!res.ok) throw new Error("Failed to rate recipe");
    const data = await res.json() as { rating: number; ratingCount: number };
    return { id, ...data };
  }
);

// ---------- Slice ----------
const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(state, action: PayloadAction<Recipe[]>) {
      state.recipes = action.payload;
    },
    addRecipe(state, action: PayloadAction<Recipe>) {
      state.recipes.unshift(action.payload); // add to top
    },
    updateRecipe(state, action: PayloadAction<Recipe>) {
      const index = state.recipes.findIndex(r => r.id === action.payload.id);
      if (index !== -1) state.recipes[index] = action.payload;
    },
    removeRecipe(state, action: PayloadAction<string>) {
      state.recipes = state.recipes.filter(r => r.id !== action.payload);
    },
    setSelectedRecipe(state, action: PayloadAction<Recipe | null>) {
      state.selectedRecipe = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<RecipeFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialFilters;
    },
  },
  extraReducers: (builder) => {
    // fetchRecipes
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      });

    // createRecipe
    builder.addCase(createRecipe.fulfilled, (state, action) => {
      state.recipes.unshift(action.payload);
    });

    // editRecipe
    builder.addCase(editRecipe.fulfilled, (state, action) => {
      const index = state.recipes.findIndex(r => r.id === action.payload.id);
      if (index !== -1) state.recipes[index] = action.payload;
    });

    // deleteRecipe
    builder.addCase(deleteRecipe.fulfilled, (state, action) => {
      state.recipes = state.recipes.filter(r => r.id !== action.payload);
    });

    // rateRecipe — update rating + ratingCount on success
    builder.addCase(rateRecipe.fulfilled, (state, action) => {
      const index = state.recipes.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index].rating = action.payload.rating;
        state.recipes[index].ratingCount = action.payload.ratingCount;
      }
    });
  },
});

export const {
  setRecipes,
  addRecipe,
  updateRecipe,
  removeRecipe,
  setSelectedRecipe,
  setFilters,
  clearFilters,
} = recipeSlice.actions;

export default recipeSlice.reducer;