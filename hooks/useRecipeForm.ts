// hooks/useRecipeForm.ts
import { useState, useCallback } from "react";
import type { Recipe, Ingredient, RecipeStep, MeasurementUnit } from "@/types";
import { generateSlug } from "@/lib/utils";

// ---------- Types ----------
type RecipeFormValues = Omit<Recipe,
  "id" | "slug" | "rating" | "ratingCount" | "createdAt" | "updatedAt"
>;

interface FormErrors {
  title?: string;
  ingredients?: string;
  steps?: string;
  servings?: string;
}

interface UseRecipeFormResult {
  values: RecipeFormValues;
  errors: FormErrors;
  isDirty: boolean;
  handleChange: <K extends keyof RecipeFormValues>(
    field: K,
    value: RecipeFormValues[K]
  ) => void;
  handleSubmit: (
    onSubmit: (values: RecipeFormValues) => void
  ) => (e: React.FormEvent) => void;
  reset: () => void;
  // Ingredient helpers
  addIngredient: () => void;
  updateIngredient: (
    index: number,
    field: keyof Ingredient,
    value: string | number | boolean
  ) => void;
  removeIngredient: (index: number) => void;
  // Step helpers
  addStep: () => void;
  updateStep: (
    index: number,
    field: keyof RecipeStep,
    value: string | number
  ) => void;
  removeStep: (index: number) => void;
  moveStep: (fromIndex: number, toIndex: number) => void;
}

// ---------- Blank templates ----------
const blankIngredient = (): Ingredient => ({
  id: crypto.randomUUID(),
  name: "",
  quantity: 1,
  unit: "g" as MeasurementUnit,
  optional: false,
});

const blankStep = (stepNumber: number): RecipeStep => ({
  stepNumber,
  instruction: "",
  durationMinutes: undefined,
  tip: undefined,
});

// ---------- Default form values ----------
const defaultValues = (initial?: Partial<Recipe>): RecipeFormValues => ({
  title: initial?.title ?? "",
  description: initial?.description ?? "",
  coverImageUrl: initial?.coverImageUrl ?? "",
  authorId: initial?.authorId ?? "",
  category: initial?.category ?? "",
  dietaryTags: initial?.dietaryTags ?? [],
  difficulty: initial?.difficulty ?? "easy",
  servings: initial?.servings ?? 2,
  prepTimeMinutes: initial?.prepTimeMinutes ?? 0,
  cookTimeMinutes: initial?.cookTimeMinutes ?? 0,
  ingredients: initial?.ingredients ?? [blankIngredient()],
  steps: initial?.steps ?? [blankStep(1)],
  nutrition: initial?.nutrition,
  published: initial?.published ?? false,
});

// ---------- Validation ----------
const validate = (values: RecipeFormValues): FormErrors => {
  const errors: FormErrors = {};
  if (values.title.trim().length < 3)
    errors.title = "Title must be at least 3 characters";
  if (values.ingredients.length < 1)
    errors.ingredients = "At least 1 ingredient is required";
  if (values.steps.length < 1)
    errors.steps = "At least 1 step is required";
  if (values.servings < 1)
    errors.servings = "Servings must be at least 1";
  return errors;
};

// ---------- Hook ----------
export function useRecipeForm(
  initialValues?: Partial<Recipe>
): UseRecipeFormResult {
  const [values, setValues] = useState<RecipeFormValues>(() =>
    defaultValues(initialValues)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  // Generic field change
  const handleChange = useCallback(
    <K extends keyof RecipeFormValues>(
      field: K,
      value: RecipeFormValues[K]
    ) => {
      setValues((prev) => {
        const updated = { ...prev, [field]: value };
        // Auto generate slug when title changes
        if (field === "title" && typeof value === "string") {
          (updated as RecipeFormValues & { slug?: string }).slug =
            generateSlug(value);
        }
        return updated;
      });
      setIsDirty(true);
    },
    []
  );

  // Submit with validation
  const handleSubmit = useCallback(
    (onSubmit: (values: RecipeFormValues) => void) =>
      (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate(values);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
          onSubmit(values);
        }
      },
    [values]
  );

  // Reset form to initial
  const reset = useCallback(() => {
    setValues(defaultValues(initialValues));
    setErrors({});
    setIsDirty(false);
  }, [initialValues]);

  // ---------- Ingredient helpers ----------
  const addIngredient = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, blankIngredient()],
    }));
    setIsDirty(true);
  }, []);

  const updateIngredient = useCallback(
    (index: number, field: keyof Ingredient, value: string | number | boolean) => {
      setValues((prev) => {
        const updated = [...prev.ingredients];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, ingredients: updated };
      });
      setIsDirty(true);
    },
    []
  );

  const removeIngredient = useCallback((index: number) => {
    setValues((prev) => {
      // Must keep at least 1 ingredient
      if (prev.ingredients.length <= 1) return prev;
      const updated = prev.ingredients.filter((_, i) => i !== index);
      return { ...prev, ingredients: updated };
    });
    setIsDirty(true);
  }, []);

  // ---------- Step helpers ----------
  const addStep = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        blankStep(prev.steps.length + 1),
      ],
    }));
    setIsDirty(true);
  }, []);

  const updateStep = useCallback(
    (index: number, field: keyof RecipeStep, value: string | number) => {
      setValues((prev) => {
        const updated = [...prev.steps];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, steps: updated };
      });
      setIsDirty(true);
    },
    []
  );

  const removeStep = useCallback((index: number) => {
    setValues((prev) => {
      if (prev.steps.length <= 1) return prev;
      const updated = prev.steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, stepNumber: i + 1 })); // renumber
      return { ...prev, steps: updated };
    });
    setIsDirty(true);
  }, []);

  const moveStep = useCallback((fromIndex: number, toIndex: number) => {
    setValues((prev) => {
      const updated = [...prev.steps];
      const [moved] = updated.splice(fromIndex, 1); // remove from position
      updated.splice(toIndex, 0, moved);             // insert at new position
      // Renumber all steps after move
      const renumbered = updated.map((step, i) => ({
        ...step,
        stepNumber: i + 1,
      }));
      return { ...prev, steps: renumbered };
    });
    setIsDirty(true);
  }, []);

  return {
    values,
    errors,
    isDirty,
    handleChange,
    handleSubmit,
    reset,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addStep,
    updateStep,
    removeStep,
    moveStep,
  };
}
