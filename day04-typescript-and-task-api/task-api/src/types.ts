// ============================================================
// TASK API — types.ts
// All shared types, interfaces, and enums live here.
// This is the SINGLE SOURCE OF TRUTH for our data shapes.
// ============================================================

// ─────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────

// TODO: Define TaskStatus enum with string values
// Hint: Use string enum for readable output
// Values should be: "pending", "in-progress", "completed", "cancelled"
export enum TaskStatus {
  Pending    = "pending",
  InProgress = "in-progress",
  Completed  = "completed",
  Cancelled  = "cancelled",
}

// TODO: Define TaskPriority enum with string values
// Hint: Values should be: "low", "medium", "high", "critical"
export enum TaskPriority {
  Low      = "low",
  Medium   = "medium",
  High     = "high",
  Critical = "critical",
}

// ─────────────────────────────────────────────────────────────
// CORE INTERFACES
// ─────────────────────────────────────────────────────────────

// Main Task interface — represents a task in our system
export interface Task {
  // TODO: Add these properties with correct types:
  // id: unique identifier (string — we'll use UUID-like format)
  // title: task title (string)
  // description: optional longer description (string | undefined)
  // status: use TaskStatus enum
  // priority: use TaskPriority enum
  // tags: array of string labels
  // createdAt: when task was created (Date)
  // updatedAt: when task was last modified (Date)
  // dueDate: optional deadline (Date | undefined)
  // completedAt: optional completion timestamp (Date | undefined)

  id:          string;
  title:       string;
  description?: string;
  status:      TaskStatus;
  priority:    TaskPriority;
  tags:        string[];
  createdAt:   Date;
  updatedAt:   Date;
  dueDate?:    Date;
  completedAt?: Date;
}

// ─────────────────────────────────────────────────────────────
// DTO TYPES — Data Transfer Objects
// These define what data flows IN for each operation
// ─────────────────────────────────────────────────────────────

// TODO: CreateTaskInput — data needed to CREATE a new task
// Hint: use Pick or Omit from Task
// User provides: title (required), description?, priority?, tags?, dueDate?
// System generates: id, status (always starts "pending"), createdAt, updatedAt
export type CreateTaskInput = {
  title:        string;
  description?: string;
  priority?:    TaskPriority;  // defaults to Medium if not provided
  tags?:        string[];       // defaults to []
  dueDate?:     Date;
};

// TODO: UpdateTaskInput — data allowed to UPDATE an existing task
// Hint: Use Partial<> with Pick<> or write fields manually
// User can update: title, description, priority, tags, dueDate
// System updates: updatedAt automatically
// User CANNOT directly set: id, createdAt, status (use markComplete/cancel instead)
export type UpdateTaskInput = Partial<Pick<Task,
  "title" | "description" | "priority" | "tags" | "dueDate"
>>;

// TODO: FilterOptions — criteria for filtering tasks
// All fields should be optional (user may specify any combination)
export interface FilterOptions {
  status?:   TaskStatus;
  priority?: TaskPriority;
  tag?:      string;      // filter by a single tag
  overdue?:  boolean;     // tasks past their dueDate and not completed
}

// TODO: SearchOptions — options for searching tasks
export interface SearchOptions {
  query: string;          // search term (searches title + description + tags)
  caseSensitive?: boolean; // default: false
}

// ─────────────────────────────────────────────────────────────
// RESULT TYPES — Standardized return values
// ─────────────────────────────────────────────────────────────

// TODO: OperationResult<T> — discriminated union for operation outcomes
// Should have two variants:
//   success: true  → data: T
//   success: false → error: string
export type OperationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// TODO: TaskStats — summary statistics about all tasks
export interface TaskStats {
  total:      number;
  byStatus:   Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  overdue:    number;
  completionRate: number; // percentage (0-100)
}

// ─────────────────────────────────────────────────────────────
// UTILITY TYPES FOR THIS PROJECT
// ─────────────────────────────────────────────────────────────

// Task without system-generated fields (useful for display/testing)
export type TaskSummary = Pick<Task, "id" | "title" | "status" | "priority" | "tags">;

// Tasks grouped by status
export type TasksByStatus = Record<TaskStatus, Task[]>;

// Sort options
export type SortField = "title" | "priority" | "status" | "createdAt" | "dueDate";
export type SortOrder = "asc" | "desc";

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}
