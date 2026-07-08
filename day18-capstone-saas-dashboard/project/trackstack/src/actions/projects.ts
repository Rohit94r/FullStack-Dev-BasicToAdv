"use server";

// =============================================================================
// Project server actions — scoped to workspace
// =============================================================================

// TODO: createProjectAction(workspaceId, data)
// TODO: listProjectsAction(workspaceId)
// TODO: updateProjectAction(projectId, data)
// TODO: deleteProjectAction(projectId) — verify user is workspace member
// YOUR IDEA: write your attempt here first ↓


export async function createProjectAction(
  _workspaceId: string,
  _data: { name: string; description?: string }
) {
  throw new Error("Implement createProjectAction");
}

export async function listProjectsAction(_workspaceId: string) {
  throw new Error("Implement listProjectsAction");
}
