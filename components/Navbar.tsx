// components/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useCooking } from "@/context/cookingContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChefHat, Sun, Moon } from "lucide-react";

export function Navbar() {
  const savedCount = useAppSelector((s) => s.cookbook.savedIds.length);
  const { theme, toggleTheme } = useCooking();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-amber-600"
        >
          <ChefHat className="w-6 h-6" />
          RecipeApp
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
          >
            Home
          </Link>
          <Link
            href="/recipes"
            className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
          >
            Browse
          </Link>

          {/* Cookbook with saved count badge */}
          <Link
            href="/cookbook"
            className="relative px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-4 h-4" />
            Cookbook
            {savedCount > 0 && (
              <Badge className="ml-1 h-5 min-w-5 px-1 text-xs bg-amber-500 text-white">
                {savedCount}
              </Badge>
            )}
          </Link>

          <Link
            href="/manage"
            className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
          >
            Manage
          </Link>
        </nav>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="shrink-0"
        >
          <span suppressHydrationWarning>
            {!mounted ? (
              <span className="w-4 h-4 block" />
            ) : theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </span>
        </Button>
      </div>
    </header>
  );
}
