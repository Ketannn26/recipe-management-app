// app/recipes/loading.tsx
export default function RecipesLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-muted rounded-lg animate-pulse" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-32 w-full bg-muted rounded-xl animate-pulse mb-6" />

      {/* Recipe Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border overflow-hidden animate-pulse"
          >
            {/* Image placeholder */}
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-3">
              {/* Category + difficulty */}
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
              {/* Title */}
              <div className="h-5 w-3/4 bg-muted rounded" />
              <div className="h-5 w-1/2 bg-muted rounded" />
              {/* Meta row */}
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
              {/* Tags */}
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted rounded-full" />
                <div className="h-5 w-16 bg-muted rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
