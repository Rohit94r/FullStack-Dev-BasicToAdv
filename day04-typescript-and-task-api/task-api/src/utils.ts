// ============================================================
// TASK API — utils.ts
// Pure utility functions — no side effects, easy to test.
// ============================================================

import { Task, TaskPriority, OperationResult } from "./types";

// ─────────────────────────────────────────────────────────────
// ID GENERATION
// ─────────────────────────────────────────────────────────────

// TODO: Implement generateId()
// Should return a unique string ID.
// Hint: Combine Date.now() + Math.random() + toString(36)
// Example output: "lp3k9x2m" or similar
export function generateId(): string {
  // YOUR IDEA: How would you make a unique string from current time + random?
  // Hint: Date.now() gives milliseconds, .toString(36) converts to base-36 string
  // Hint: Math.random().toString(36).slice(2) gives random alphanumeric chars

  // ANSWER (study then try yourself first!):
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─────────────────────────────────────────────────────────────
// RESULT HELPERS — Create OperationResult values cleanly
// ─────────────────────────────────────────────────────────────

// TODO: Implement success<T>(data: T) → OperationResult<T>
// Should return: { success: true, data }
export function success<T>(data: T): OperationResult<T> {
  // YOUR IDEA: Return the success variant of OperationResult

  // ANSWER:
  return { success: true, data };
}

// TODO: Implement failure<T>(error: string) → OperationResult<T>
// Should return: { success: false, error }
export function failure<T>(error: string): OperationResult<T> {
  // YOUR IDEA: Return the failure variant of OperationResult

  // ANSWER:
  return { success: false, error };
}

// ─────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────

// TODO: Implement validateTitle(title: string): string | null
// Return null if valid, or an error message string if invalid.
// Rules: must be string, not empty, 3-100 characters, trimmed
export function validateTitle(title: string): string | null {
  // YOUR IDEA: What checks would you do on a title field?
  // Think about: empty check, min length, max length, trimming

  // ANSWER:
  if (typeof title !== "string") return "Title must be a string";
  const trimmed = title.trim();
  if (trimmed.length === 0) return "Title cannot be empty";
  if (trimmed.length < 3)   return "Title must be at least 3 characters";
  if (trimmed.length > 100) return "Title must be at most 100 characters";
  return null; // valid!
}

// TODO: Implement validateTags(tags: string[]): string | null
// Return null if valid, or error string if invalid.
// Rules: must be an array, each tag is a non-empty string, max 10 tags
export function validateTags(tags: string[]): string | null {
  // YOUR IDEA: How would you validate an array of tags?
  // Think: is it an array? are all items strings? max count?

  // ANSWER:
  if (!Array.isArray(tags)) return "Tags must be an array";
  if (tags.length > 10) return "Cannot have more than 10 tags";
  for (const tag of tags) {
    if (typeof tag !== "string" || tag.trim().length === 0) {
      return "Each tag must be a non-empty string";
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// PRIORITY HELPERS
// ─────────────────────────────────────────────────────────────

// Priority weight for sorting (higher = more important)
const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  [TaskPriority.Low]:      1,
  [TaskPriority.Medium]:   2,
  [TaskPriority.High]:     3,
  [TaskPriority.Critical]: 4,
};

// TODO: Implement getPriorityWeight(priority: TaskPriority): number
// Returns a numeric weight for sorting (Critical=4, High=3, etc.)
export function getPriorityWeight(priority: TaskPriority): number {
  // YOUR IDEA: Look up the weight from PRIORITY_WEIGHT map

  // ANSWER:
  return PRIORITY_WEIGHT[priority];
}

// ─────────────────────────────────────────────────────────────
// DATE HELPERS
// ─────────────────────────────────────────────────────────────

// TODO: Implement isOverdue(task: Task): boolean
// A task is overdue if: it has a dueDate, dueDate is in the past,
// AND the task is not completed or cancelled
export function isOverdue(task: Task): boolean {
  // YOUR IDEA: What conditions make a task "overdue"?
  // Think: dueDate exists? is it before now? is task not done/cancelled?

  // ANSWER:
  if (!task.dueDate) return false;
  if (task.status === "completed" || task.status === "cancelled") return false;
  return task.dueDate < new Date();
}

// TODO: Implement formatDate(date: Date): string
// Format: "Dec 31, 2025" or "Jan 1, 2026"
export function formatDate(date: Date): string {
  // YOUR IDEA: Use Date's toLocaleDateString method
  // Hint: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  // ANSWER:
  return date.toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

// TODO: Implement daysUntilDue(dueDate: Date): number
// Returns: positive = days remaining, negative = days overdue, 0 = today
export function daysUntilDue(dueDate: Date): number {
  // YOUR IDEA: Calculate difference in days between dueDate and today
  // Hint: (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)

  // ANSWER:
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((dueDate.getTime() - Date.now()) / msPerDay);
}

// ─────────────────────────────────────────────────────────────
// DISPLAY HELPERS
// ─────────────────────────────────────────────────────────────

// TODO: Implement formatTask(task: Task): string
// Returns a human-readable single-line summary of the task
// Example: "[#abc123] Learn TypeScript | Status: pending | Priority: high | Tags: js, ts"
export function formatTask(task: Task): string {
  // YOUR IDEA: Build a formatted string from task properties
  // Think about what info is most useful to show

  // ANSWER:
  const id      = `[#${task.id.slice(0, 6)}]`;
  const tags    = task.tags.length > 0 ? ` | Tags: ${task.tags.join(", ")}` : "";
  const due     = task.dueDate ? ` | Due: ${formatDate(task.dueDate)}` : "";
  const overdue = isOverdue(task) ? " ⚠️ OVERDUE" : "";
  return `${id} ${task.title} | Status: ${task.status} | Priority: ${task.priority}${tags}${due}${overdue}`;
}

// TODO: Implement formatTaskList(tasks: Task[]): string
// Returns numbered list of formatted tasks, or "No tasks found." if empty
export function formatTaskList(tasks: Task[]): string {
  // YOUR IDEA: Map each task to formatTask, number them, join with newlines

  // ANSWER:
  if (tasks.length === 0) return "No tasks found.";
  return tasks
    .map((task, i) => `${i + 1}. ${formatTask(task)}`)
    .join("\n");
}
