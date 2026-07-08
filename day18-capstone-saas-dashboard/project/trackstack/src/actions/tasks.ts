"use server";

// =============================================================================
// Task server actions — CRUD, search, pagination, kanban status updates
// =============================================================================

// TODO: createTaskAction(projectId, data) — title, status, priority, assigneeId, dueDate
// TODO: listTasksAction(projectId, { search, status, page, limit })
// TODO: updateTaskAction(taskId, partial)
// TODO: deleteTaskAction(taskId)
// TODO: getDashboardStatsAction(workspaceId) — total, completed, overdue counts
// YOUR IDEA: write your attempt here first ↓


export async function createTaskAction(
  _projectId: string,
  _data: Record<string, unknown>
) {
  throw new Error("Implement createTaskAction");
}

export async function listTasksAction(
  _projectId: string,
  _filters?: { search?: string; status?: string; page?: number; limit?: number }
) {
  throw new Error("Implement listTasksAction");
}

export async function getDashboardStatsAction(_workspaceId: string) {
  throw new Error("Implement getDashboardStatsAction");
}
