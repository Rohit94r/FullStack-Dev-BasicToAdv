// ============================================================
// TASK API — taskManager.ts
// Core business logic. All operations on tasks live here.
// This is the HEART of the project.
// ============================================================

import {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
  UpdateTaskInput,
  FilterOptions,
  SearchOptions,
  SortOptions,
  TaskStats,
  TasksByStatus,
  OperationResult,
} from "./types";

import {
  generateId,
  success,
  failure,
  validateTitle,
  validateTags,
  isOverdue,
  getPriorityWeight,
} from "./utils";

// ─────────────────────────────────────────────────────────────
// TASK MANAGER CLASS
// ─────────────────────────────────────────────────────────────
// Manages all task operations in memory.
// In a real app, this would talk to a database.

export class TaskManager {
  // Private storage — only accessible inside this class
  // Map<id, Task> — O(1) lookup by ID
  private tasks: Map<string, Task> = new Map();

  // ───────────────────────────────────────────────────────────
  // CREATE
  // ───────────────────────────────────────────────────────────

  // TODO: Implement addTask(input: CreateTaskInput): OperationResult<Task>
  // Steps:
  //   1. Validate title using validateTitle()
  //   2. Validate tags using validateTags()
  //   3. Generate a unique ID using generateId()
  //   4. Create Task object with:
  //      - id (generated)
  //      - title (trimmed from input)
  //      - description (from input, optional)
  //      - status: TaskStatus.Pending (always starts pending)
  //      - priority: input.priority ?? TaskPriority.Medium (default to medium)
  //      - tags: input.tags ?? [] (default to empty array)
  //      - createdAt: new Date()
  //      - updatedAt: new Date()
  //      - dueDate, completedAt: from input / undefined
  //   5. Store in this.tasks Map
  //   6. Return success(task)
  addTask(input: CreateTaskInput): OperationResult<Task> {
    // YOUR IDEA: Validate first, build the task object, store it, return success

    // ANSWER:
    const titleError = validateTitle(input.title);
    if (titleError) return failure(titleError);

    const tagsError = validateTags(input.tags ?? []);
    if (tagsError) return failure(tagsError);

    const now = new Date();
    const task: Task = {
      id:          generateId(),
      title:       input.title.trim(),
      description: input.description?.trim(),
      status:      TaskStatus.Pending,
      priority:    input.priority ?? TaskPriority.Medium,
      tags:        input.tags?.map((t) => t.trim().toLowerCase()) ?? [],
      createdAt:   now,
      updatedAt:   now,
      dueDate:     input.dueDate,
      completedAt: undefined,
    };

    this.tasks.set(task.id, task);
    return success(task);
  }

  // ───────────────────────────────────────────────────────────
  // READ
  // ───────────────────────────────────────────────────────────

  // TODO: Implement getTaskById(id: string): OperationResult<Task>
  // Steps:
  //   1. Look up task in Map using this.tasks.get(id)
  //   2. If not found → return failure("Task not found")
  //   3. If found → return success(task)
  getTaskById(id: string): OperationResult<Task> {
    // YOUR IDEA: How do you look up from a Map and handle missing key?

    // ANSWER:
    const task = this.tasks.get(id);
    if (!task) return failure(`Task with id '${id}' not found`);
    return success(task);
  }

  // TODO: Implement getAllTasks(): Task[]
  // Returns all tasks as an array (newest first by createdAt)
  getAllTasks(): Task[] {
    // YOUR IDEA: Convert Map values to array, then sort by createdAt desc

    // ANSWER:
    return Array.from(this.tasks.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // ───────────────────────────────────────────────────────────
  // UPDATE
  // ───────────────────────────────────────────────────────────

  // TODO: Implement updateTask(id: string, input: UpdateTaskInput): OperationResult<Task>
  // Steps:
  //   1. Find the task (use getTaskById)
  //   2. If not found, return failure
  //   3. Validate title if provided in input
  //   4. Validate tags if provided in input
  //   5. Spread existing task, apply changes, update updatedAt
  //   6. Save back to Map
  //   7. Return success(updatedTask)
  updateTask(id: string, input: UpdateTaskInput): OperationResult<Task> {
    // YOUR IDEA: Find → validate → merge → save → return

    // ANSWER:
    const result = this.getTaskById(id);
    if (!result.success) return result;

    if (input.title !== undefined) {
      const titleError = validateTitle(input.title);
      if (titleError) return failure(titleError);
    }

    if (input.tags !== undefined) {
      const tagsError = validateTags(input.tags);
      if (tagsError) return failure(tagsError);
    }

    const updatedTask: Task = {
      ...result.data,
      ...input,
      title: input.title?.trim() ?? result.data.title,
      tags:  input.tags?.map((t) => t.trim().toLowerCase()) ?? result.data.tags,
      updatedAt: new Date(),
    };

    this.tasks.set(id, updatedTask);
    return success(updatedTask);
  }

  // ───────────────────────────────────────────────────────────
  // DELETE
  // ───────────────────────────────────────────────────────────

  // TODO: Implement deleteTask(id: string): OperationResult<boolean>
  // Steps:
  //   1. Check if task exists using this.tasks.has(id)
  //   2. If not found → return failure("Task not found")
  //   3. Delete from Map using this.tasks.delete(id)
  //   4. Return success(true)
  deleteTask(id: string): OperationResult<boolean> {
    // YOUR IDEA: Check exists → delete → return

    // ANSWER:
    if (!this.tasks.has(id)) {
      return failure(`Task with id '${id}' not found`);
    }
    this.tasks.delete(id);
    return success(true);
  }

  // ───────────────────────────────────────────────────────────
  // STATUS CHANGES
  // ───────────────────────────────────────────────────────────

  // TODO: Implement markComplete(id: string): OperationResult<Task>
  // Steps:
  //   1. Find the task
  //   2. If already completed → return failure("Task is already completed")
  //   3. If cancelled → return failure("Cannot complete a cancelled task")
  //   4. Update: status = Completed, completedAt = new Date(), updatedAt = new Date()
  //   5. Save and return success
  markComplete(id: string): OperationResult<Task> {
    // YOUR IDEA: Find → check current status → update status + completedAt

    // ANSWER:
    const result = this.getTaskById(id);
    if (!result.success) return result;

    const task = result.data;
    if (task.status === TaskStatus.Completed) {
      return failure("Task is already completed");
    }
    if (task.status === TaskStatus.Cancelled) {
      return failure("Cannot complete a cancelled task");
    }

    const completed: Task = {
      ...task,
      status:      TaskStatus.Completed,
      completedAt: new Date(),
      updatedAt:   new Date(),
    };

    this.tasks.set(id, completed);
    return success(completed);
  }

  // TODO: Implement cancelTask(id: string): OperationResult<Task>
  // Similar to markComplete — check status, update to Cancelled
  cancelTask(id: string): OperationResult<Task> {
    // YOUR IDEA: Same pattern as markComplete but for cancelled status

    // ANSWER:
    const result = this.getTaskById(id);
    if (!result.success) return result;

    const task = result.data;
    if (task.status === TaskStatus.Cancelled) {
      return failure("Task is already cancelled");
    }
    if (task.status === TaskStatus.Completed) {
      return failure("Cannot cancel a completed task");
    }

    const cancelled: Task = {
      ...task,
      status:    TaskStatus.Cancelled,
      updatedAt: new Date(),
    };

    this.tasks.set(id, cancelled);
    return success(cancelled);
  }

  // TODO: Implement reopenTask(id: string): OperationResult<Task>
  // Reopen a completed or cancelled task → set back to Pending
  // Clear completedAt if it was completed
  reopenTask(id: string): OperationResult<Task> {
    // YOUR IDEA: Find → check it's not already pending/in-progress → reset

    // ANSWER:
    const result = this.getTaskById(id);
    if (!result.success) return result;

    const task = result.data;
    if (task.status === TaskStatus.Pending || task.status === TaskStatus.InProgress) {
      return failure("Task is already active");
    }

    const reopened: Task = {
      ...task,
      status:      TaskStatus.Pending,
      completedAt: undefined,
      updatedAt:   new Date(),
    };

    this.tasks.set(id, reopened);
    return success(reopened);
  }

  // ───────────────────────────────────────────────────────────
  // FILTER
  // ───────────────────────────────────────────────────────────

  // TODO: Implement filterTasks(options: FilterOptions): Task[]
  // Filter tasks by: status, priority, tag, and/or overdue
  // All filters are optional — if not provided, don't filter on that criterion
  // Multiple filters = AND logic (must match ALL provided criteria)
  filterTasks(options: FilterOptions): Task[] {
    // YOUR IDEA: Get all tasks, then .filter() for each criterion provided

    // ANSWER:
    return this.getAllTasks().filter((task) => {
      if (options.status   && task.status   !== options.status)   return false;
      if (options.priority && task.priority !== options.priority) return false;
      if (options.tag && !task.tags.includes(options.tag.toLowerCase())) return false;
      if (options.overdue !== undefined) {
        const overdueStatus = isOverdue(task);
        if (options.overdue !== overdueStatus) return false;
      }
      return true;
    });
  }

  // ───────────────────────────────────────────────────────────
  // SEARCH
  // ───────────────────────────────────────────────────────────

  // TODO: Implement searchTasks(options: SearchOptions): Task[]
  // Search by query string across: title, description, tags
  // Support case-insensitive search (default) or case-sensitive
  searchTasks(options: SearchOptions): Task[] {
    // YOUR IDEA: What fields would you search? How do you handle case?
    // Hint: Use .toLowerCase() for case-insensitive matching
    // Hint: Check if title includes query, OR description includes query, OR any tag includes query

    // ANSWER:
    const query = options.caseSensitive
      ? options.query
      : options.query.toLowerCase();

    return this.getAllTasks().filter((task) => {
      const normalize = (s: string) =>
        options.caseSensitive ? s : s.toLowerCase();

      const inTitle       = normalize(task.title).includes(query);
      const inDescription = task.description
        ? normalize(task.description).includes(query)
        : false;
      const inTags = task.tags.some((tag) => normalize(tag).includes(query));

      return inTitle || inDescription || inTags;
    });
  }

  // ───────────────────────────────────────────────────────────
  // SORT
  // ───────────────────────────────────────────────────────────

  // TODO: Implement sortTasks(tasks: Task[], options: SortOptions): Task[]
  // Sort tasks by: title, priority, status, createdAt, or dueDate
  // Support ascending and descending order
  sortTasks(tasks: Task[], options: SortOptions): Task[] {
    // YOUR IDEA: Use .sort() with a comparator. What does each field comparison look like?
    // Hint: For strings → localeCompare. For dates → getTime(). For priority → getPriorityWeight()

    // ANSWER:
    return [...tasks].sort((a, b) => {
      let comparison = 0;

      switch (options.field) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "priority":
          comparison = getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "createdAt":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "dueDate":
          // Tasks without dueDate go to the end
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = a.dueDate.getTime() - b.dueDate.getTime();
          break;
      }

      return options.order === "desc" ? -comparison : comparison;
    });
  }

  // ───────────────────────────────────────────────────────────
  // STATS
  // ───────────────────────────────────────────────────────────

  // TODO: Implement getStats(): TaskStats
  // Calculate:
  //   - total tasks
  //   - byStatus: count per status using Record<TaskStatus, number>
  //   - byPriority: count per priority
  //   - overdue count
  //   - completionRate: (completed / total) * 100, rounded to 1 decimal
  getStats(): TaskStats {
    // YOUR IDEA: Loop through all tasks, accumulate counts by status/priority/overdue
    // Then calculate completionRate

    // ANSWER:
    const allTasks = this.getAllTasks();
    const total    = allTasks.length;

    const byStatus: Record<TaskStatus, number> = {
      [TaskStatus.Pending]:    0,
      [TaskStatus.InProgress]: 0,
      [TaskStatus.Completed]:  0,
      [TaskStatus.Cancelled]:  0,
    };

    const byPriority: Record<TaskPriority, number> = {
      [TaskPriority.Low]:      0,
      [TaskPriority.Medium]:   0,
      [TaskPriority.High]:     0,
      [TaskPriority.Critical]: 0,
    };

    let overdue = 0;

    for (const task of allTasks) {
      byStatus[task.status]++;
      byPriority[task.priority]++;
      if (isOverdue(task)) overdue++;
    }

    const completed       = byStatus[TaskStatus.Completed];
    const completionRate  = total > 0
      ? Math.round((completed / total) * 1000) / 10 // one decimal
      : 0;

    return { total, byStatus, byPriority, overdue, completionRate };
  }

  // ───────────────────────────────────────────────────────────
  // GROUP
  // ───────────────────────────────────────────────────────────

  // TODO: Implement groupByStatus(): TasksByStatus
  // Group all tasks into buckets by their status
  groupByStatus(): TasksByStatus {
    // YOUR IDEA: Use reduce() to group tasks by status into an object

    // ANSWER:
    const initial: TasksByStatus = {
      [TaskStatus.Pending]:    [],
      [TaskStatus.InProgress]: [],
      [TaskStatus.Completed]:  [],
      [TaskStatus.Cancelled]:  [],
    };

    return this.getAllTasks().reduce((groups, task) => {
      groups[task.status].push(task);
      return groups;
    }, initial);
  }

  // ───────────────────────────────────────────────────────────
  // BULK OPERATIONS
  // ───────────────────────────────────────────────────────────

  // TODO: Implement deleteCompleted(): number
  // Delete ALL completed tasks. Return count of deleted tasks.
  deleteCompleted(): number {
    // YOUR IDEA: Find completed tasks, delete each one, return how many deleted

    // ANSWER:
    const completed = this.filterTasks({ status: TaskStatus.Completed });
    completed.forEach((task) => this.tasks.delete(task.id));
    return completed.length;
  }

  // TODO: Implement bulkAddTag(ids: string[], tag: string): OperationResult<number>
  // Add a tag to multiple tasks at once. Return count of updated tasks.
  bulkAddTag(ids: string[], tag: string): OperationResult<number> {
    // YOUR IDEA: Loop through ids, get each task, add tag if not already present

    // ANSWER:
    const normalizedTag = tag.trim().toLowerCase();
    if (!normalizedTag) return failure("Tag cannot be empty");

    let updated = 0;
    for (const id of ids) {
      const result = this.getTaskById(id);
      if (!result.success) continue; // skip missing tasks

      const task = result.data;
      if (!task.tags.includes(normalizedTag)) {
        this.tasks.set(id, {
          ...task,
          tags: [...task.tags, normalizedTag],
          updatedAt: new Date(),
        });
        updated++;
      }
    }
    return success(updated);
  }

  // ───────────────────────────────────────────────────────────
  // UTILITY
  // ───────────────────────────────────────────────────────────

  // Get count of all tasks
  get count(): number {
    return this.tasks.size;
  }

  // Clear all tasks (useful for testing)
  clear(): void {
    this.tasks.clear();
  }
}
