// app/manage/layout.tsx
import Link from "next/link";
import { PlusCircle, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

export default function ManageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r bg-card px-4 py-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 px-2">
          Manage
        </p>
        <Link
          href="/manage"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          My Recipes
        </Link>
        <Link
          href="/manage/create"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create Recipe
        </Link>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
