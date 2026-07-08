"use server";

// =============================================================================
// Workspace server actions
// =============================================================================

// TODO: createWorkspaceAction(name) — slugify name, create workspace + OWNER member
// TODO: listWorkspacesAction() — workspaces for current user via Member join
// TODO: inviteMemberAction(workspaceId, email, role) — create Member row
// YOUR IDEA: write your attempt here first ↓


export async function createWorkspaceAction(_name: string) {
  throw new Error("Implement createWorkspaceAction");
}

export async function listWorkspacesAction() {
  throw new Error("Implement listWorkspacesAction");
}

export async function inviteMemberAction(
  _workspaceId: string,
  _email: string,
  _role: "OWNER" | "MEMBER"
) {
  throw new Error("Implement inviteMemberAction");
}
