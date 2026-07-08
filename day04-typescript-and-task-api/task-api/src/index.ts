// ============================================================
// TASK API — index.ts
// Entry point: Demo & test all features of the Task Manager
// Run with: npx ts-node src/index.ts
// ============================================================

import { TaskManager } from "./taskManager";
import { TaskStatus, TaskPriority } from "./types";
import { formatTask, formatTaskList } from "./utils";

// ─────────────────────────────────────────────────────────────
// HELPER: Section headers for clean output
// ─────────────────────────────────────────────────────────────
function section(title: string): void {
  console.log("\n" + "=".repeat(50));
  console.log(`  ${title}`);
  console.log("=".repeat(50));
}

function log(label: string, value: unknown): void {
  console.log(`  ${label}:`, value);
}

// ─────────────────────────────────────────────────────────────
// MAIN DEMO
// ─────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const manager = new TaskManager();

  // ── DEMO 1: Add Tasks ─────────────────────────────────────
  section("1. ADD TASKS");

  // TODO: Add 5+ tasks using manager.addTask()
  // Ideas: tasks about learning JS, TS, building projects, etc.
  // Try different priorities, tags, and due dates
  // Check the result.success before using result.data

  // ANSWER (study then try creating your own tasks!):
  const task1Result = manager.addTask({
    title:       "Learn JavaScript Closures",
    description: "Understand lexical scope and closure patterns",
    priority:    TaskPriority.High,
    tags:        ["javascript", "fundamentals"],
    dueDate:     new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  });

  manager.addTask({
    title:    "Learn TypeScript Generics",
    priority: TaskPriority.High,
    tags:     ["typescript", "generics"],
  });

  const task3Result = manager.addTask({
    title:    "Build Task API Project",
    priority: TaskPriority.Critical,
    tags:     ["project", "typescript"],
    dueDate:  new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  });

  const task4Result = manager.addTask({
    title:    "Practice Array Methods",
    priority: TaskPriority.Medium,
    tags:     ["javascript", "arrays"],
  });

  const task5Result = manager.addTask({
    title:    "Read MDN Documentation",
    priority: TaskPriority.Low,
    tags:     ["learning", "documentation"],
  });

  // Check for errors (validation):
  if (task1Result.success) {
    log("Task 1 added", formatTask(task1Result.data));
  }
  if (task3Result.success) {
    log("Task 3 added", formatTask(task3Result.data));
  }

  // Test validation error:
  const invalidTask = manager.addTask({ title: "AB" }); // too short
  log("Invalid task (too short)", invalidTask.success ? "added" : invalidTask.error);

  // ── DEMO 2: Get All Tasks ─────────────────────────────────
  section("2. ALL TASKS");

  // TODO: Call manager.getAllTasks() and print them using formatTaskList()
  // ANSWER:
  const allTasks = manager.getAllTasks();
  log("Total tasks", allTasks.length);
  console.log(formatTaskList(allTasks));

  // ── DEMO 3: Update a Task ─────────────────────────────────
  section("3. UPDATE TASK");

  // TODO: Get task1's ID, then update its title and add a tag
  // Use manager.updateTask(id, { title: "...", tags: [...] })
  // ANSWER:
  if (task1Result.success) {
    const id = task1Result.data.id;
    const updateResult = manager.updateTask(id, {
      title: "Master JavaScript Closures",
      tags:  ["javascript", "fundamentals", "closures"],
    });
    if (updateResult.success) {
      log("Updated task", formatTask(updateResult.data));
    }
  }

  // ── DEMO 4: Mark Complete ─────────────────────────────────
  section("4. MARK COMPLETE");

  // TODO: Mark task4 as complete, then try to complete it again (should fail)
  // ANSWER:
  if (task4Result.success) {
    const id = task4Result.data.id;
    const completeResult = manager.markComplete(id);
    log("Mark complete", completeResult.success ? "✅ done" : completeResult.error);

    // Try completing again — should fail:
    const again = manager.markComplete(id);
    log("Complete again", again.success ? "✅" : `❌ ${again.error}`);
  }

  // ── DEMO 5: Filter Tasks ──────────────────────────────────
  section("5. FILTER TASKS");

  // TODO: Filter by status=pending, then by priority=high, then by tag="javascript"
  // Use manager.filterTasks({ status, priority, tag })
  // ANSWER:
  const pendingTasks = manager.filterTasks({ status: TaskStatus.Pending });
  log("Pending tasks", pendingTasks.length);
  console.log(formatTaskList(pendingTasks));

  const highPriorityTasks = manager.filterTasks({ priority: TaskPriority.High });
  log("High priority", highPriorityTasks.length);

  const jsTasks = manager.filterTasks({ tag: "javascript" });
  log("Tagged 'javascript'", jsTasks.length);

  // ── DEMO 6: Search Tasks ──────────────────────────────────
  section("6. SEARCH TASKS");

  // TODO: Search for "typescript", then for "learn"
  // Use manager.searchTasks({ query: "..." })
  // ANSWER:
  const tsResults = manager.searchTasks({ query: "typescript" });
  log("Search 'typescript'", `${tsResults.length} results`);
  console.log(formatTaskList(tsResults));

  const learnResults = manager.searchTasks({ query: "learn" });
  log("Search 'learn'", `${learnResults.length} results`);

  // ── DEMO 7: Sort Tasks ────────────────────────────────────
  section("7. SORT TASKS");

  // TODO: Sort all tasks by priority descending (critical first)
  // Use manager.sortTasks(tasks, { field: "priority", order: "desc" })
  // ANSWER:
  const byPriority = manager.sortTasks(allTasks, {
    field: "priority",
    order: "desc",
  });
  log("Sorted by priority (desc)", "");
  console.log(formatTaskList(byPriority));

  // ── DEMO 8: Statistics ────────────────────────────────────
  section("8. STATISTICS");

  // TODO: Call manager.getStats() and print the results
  // ANSWER:
  const stats = manager.getStats();
  log("Total tasks",      stats.total);
  log("By status",        stats.byStatus);
  log("By priority",      stats.byPriority);
  log("Overdue",          stats.overdue);
  log("Completion rate",  `${stats.completionRate}%`);

  // ── DEMO 9: Group by Status ───────────────────────────────
  section("9. GROUP BY STATUS");

  // TODO: Call manager.groupByStatus() and print count per status group
  // ANSWER:
  const groups = manager.groupByStatus();
  Object.entries(groups).forEach(([status, tasks]) => {
    log(`  ${status}`, `${tasks.length} task(s)`);
  });

  // ── DEMO 10: Delete ───────────────────────────────────────
  section("10. DELETE TASK");

  // TODO: Delete task5, then try to get it (should fail)
  // ANSWER:
  if (task5Result.success) {
    const id = task5Result.data.id;
    const deleteResult = manager.deleteTask(id);
    log("Delete task5", deleteResult.success ? "✅ deleted" : deleteResult.error);

    const getDeleted = manager.getTaskById(id);
    log("Get deleted task", getDeleted.success ? "found?" : `❌ ${getDeleted.error}`);
  }

  // ── DEMO 11: Bulk Operations ──────────────────────────────
  section("11. BULK OPERATIONS");

  // TODO: Delete all completed tasks, then check count
  // ANSWER:
  const deletedCount = manager.deleteCompleted();
  log("Deleted completed tasks", deletedCount);
  log("Remaining tasks", manager.count);

  // ── DEMO 12: Validation ───────────────────────────────────
  section("12. VALIDATION ERRORS");

  // TODO: Test various invalid inputs to see error messages
  // ANSWER:
  const tests = [
    manager.addTask({ title: "" }),                   // empty title
    manager.addTask({ title: "OK" }),                 // too short
    manager.addTask({ title: "a".repeat(101) }),      // too long
    manager.addTask({ title: "Valid", tags: ["valid", "", "t"] }), // empty tag
  ];

  tests.forEach((result, i) => {
    if (!result.success) {
      log(`Validation test ${i + 1}`, `❌ ${result.error}`);
    }
  });

  // ── FINAL STATS ───────────────────────────────────────────
  section("FINAL STATS");
  const finalStats = manager.getStats();
  log("Final total", finalStats.total);
  log("Completion rate", `${finalStats.completionRate}%`);

  console.log("\n✅ All demos complete!\n");
}

// Run the demo
main().catch(console.error);
