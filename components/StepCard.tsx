// components/StepCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Timer,
  ChevronRight,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatCountdown } from "@/lib/utils";
import type { RecipeStep } from "@/types";

interface StepCardProps {
  step: RecipeStep;
  index: number;
  editable?: boolean;
  onChange?: (
    index: number,
    field: keyof RecipeStep,
    value: string | number,
  ) => void;
  onRemove?: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
  activeTimerIndex: number | null;
  onTimerStart: (index: number) => void;
  onTimerStop: () => void;
  className?: string;
}

export function StepCard({
  step,
  index,
  editable = false,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  activeTimerIndex,
  onTimerStart,
  onTimerStop,
  className,
}: StepCardProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [tipOpen, setTipOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isTimerRunning = activeTimerIndex === index;

  // ✅ Single merged useEffect — no setState cascade
  useEffect(() => {
    // Clear any previous interval first
    if (intervalRef.current) clearInterval(intervalRef.current);

    // If timer stopped or no duration — reset and exit
    if (!isTimerRunning || !step.durationMinutes) {
      setTimeLeft(null);
      return;
    }

    // Initialize countdown
    const totalSeconds = step.durationMinutes * 60;
    setTimeLeft(totalSeconds);

    // Start ticking
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount or when isTimerRunning changes
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning]); // ← only isTimerRunning, not timeLeft

  const isDone = timeLeft === 0;
  const isUrgent = timeLeft !== null && timeLeft <= 10 && timeLeft > 0;

  function handleTimerClick() {
    if (isTimerRunning) {
      onTimerStop();
    } else {
      onTimerStart(index);
    }
  }

  // ---------- Read Mode ----------
  if (!editable) {
    return (
      <div className={cn("rounded-xl border bg-card p-4 space-y-3", className)}>
        <div className="flex items-start gap-3">
          {/* Step Number Circle */}
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
            {step.stepNumber}
          </span>
          <p className="text-sm leading-relaxed flex-1">{step.instruction}</p>
        </div>

        {/* Tip (collapsible) */}
        {step.tip && (
          <div>
            <button
              type="button"
              onClick={() => setTipOpen((p) => !p)}
              className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              <ChevronRight
                className={cn(
                  "w-3 h-3 transition-transform",
                  tipOpen && "rotate-90",
                )}
              />
              Chef&apos;s Tip
            </button>
            {tipOpen && (
              <p className="mt-1 text-xs text-muted-foreground bg-amber-50 rounded-lg p-2 border border-amber-100">
                {step.tip}
              </p>
            )}
          </div>
        )}

        {/* Timer Button */}
        {step.durationMinutes && (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              variant={isTimerRunning ? "destructive" : "outline"}
              onClick={handleTimerClick}
              className="gap-1"
            >
              <Timer className="w-3 h-3" />
              {isTimerRunning
                ? "Stop Timer"
                : `Start Timer (${step.durationMinutes} min)`}
            </Button>

            {/* Countdown Display */}
            {isTimerRunning && timeLeft !== null && (
              <span
                className={cn(
                  "font-mono text-lg font-bold transition-colors",
                  isDone && "text-green-600",
                  isUrgent && "text-red-500 animate-pulse",
                )}
              >
                {isDone ? "Time's Up! 🎉" : formatCountdown(timeLeft)}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // ---------- Edit Mode ----------
  return (
    <div className={cn("rounded-xl border bg-card p-4 space-y-3", className)}>
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
          {step.stepNumber}
        </span>
        <span className="text-sm font-medium flex-1">
          Step {step.stepNumber}
        </span>

        {/* Reorder Buttons */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={isFirst}
          onClick={() => onMoveUp?.(index)}
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={isLast}
          onClick={() => onMoveDown?.(index)}
        >
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* Remove */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => onRemove?.(index)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Instruction */}
      <Textarea
        value={step.instruction}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange?.(index, "instruction", e.target.value)
        }
        placeholder="Describe this step..."
        rows={3}
      />

      {/* Duration + Tip */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Duration (minutes)
          </label>
          <Input
            type="number"
            min={0}
            value={step.durationMinutes ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange?.(index, "durationMinutes", Number(e.target.value))
            }
            placeholder="Optional"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Chef&apos;s Tip
          </label>
          <Input
            type="text"
            value={step.tip ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange?.(index, "tip", e.target.value)
            }
            placeholder="Optional tip..."
          />
        </div>
      </div>
    </div>
  );
}