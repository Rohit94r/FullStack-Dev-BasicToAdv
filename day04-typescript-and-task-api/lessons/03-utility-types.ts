// ============================================================
// DAY 1 — TypeScript: UTILITY TYPES
// Interview Level: Beginner → Advanced
// ============================================================

// Utility Types = Built-in generic types that TRANSFORM other types.
// They're helpers that save you from writing repetitive type code.
// All utility types are built using mapped types + conditional types.

// ─────────────────────────────────────────────────────────────
// BASE TYPES — We'll transform these throughout
// ─────────────────────────────────────────────────────────────
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: "admin" | "user" | "moderator";
  createdAt: Date;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: Date;
  tags: string[];
}

// ─────────────────────────────────────────────────────────────
// SECTION 1: Partial<T> — All properties become OPTIONAL
// ─────────────────────────────────────────────────────────────
// Use case: Update operations where you send only changed fields

type PartialUser = Partial<User>;
// Result:
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
//   role?: "admin" | "user" | "moderator";
//   createdAt?: Date;
// }

// Practical use: update function accepts only fields you want to change
function updateUser(id: number, changes: Partial<User>): User {
  // In real app: fetch user, apply changes, save
  const existingUser: User = {
    id, name: "Rohit", email: "r@r.com",
    age: 25, role: "user", createdAt: new Date()
  };
  return { ...existingUser, ...changes };
}

updateUser(1, { name: "New Name" });            // only update name ✅
updateUser(1, { age: 26, role: "admin" });      // update multiple ✅
// updateUser(1, { xyz: "invalid" });           // ❌ 'xyz' not in User

// How Partial is implemented under the hood:
type MyPartial<T> = {
  [K in keyof T]?: T[K]; // ? makes each property optional
};

// ─────────────────────────────────────────────────────────────
// SECTION 2: Required<T> — All properties become REQUIRED
// ─────────────────────────────────────────────────────────────
// Opposite of Partial — removes all optional markers

interface DraftPost {
  title?: string;
  content?: string;
  author?: string;
  publishAt?: Date;
}

type PublishedPost = Required<DraftPost>;
// All properties are now required (no more ?)

// How Required is implemented:
type MyRequired<T> = {
  [K in keyof T]-?: T[K]; // -? removes the optional marker
};

// ─────────────────────────────────────────────────────────────
// SECTION 3: Readonly<T> — All properties become READONLY
// ─────────────────────────────────────────────────────────────
// Prevents mutation after creation — great for config objects

type ReadonlyUser = Readonly<User>;
// All properties get 'readonly' prefix

const frozenUser: ReadonlyUser = {
  id: 1, name: "Rohit", email: "r@r.com",
  age: 25, role: "admin", createdAt: new Date()
};
// frozenUser.name = "Changed"; // ❌ Error: Cannot assign to 'name' (readonly)

// Deep readonly (not built-in, custom):
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// How Readonly is implemented:
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// ─────────────────────────────────────────────────────────────
// SECTION 4: Pick<T, K> — Keep ONLY specified properties
// ─────────────────────────────────────────────────────────────
// Create a subset of a type with only certain properties

type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string; }

type UserProfile = Pick<User, "name" | "email" | "age">;
// { name: string; email: string; age: number; }

// Use case: API responses that only expose certain fields
function getUserPreview(user: User): UserPreview {
  return { id: user.id, name: user.name };
}

// How Pick is implemented:
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]; // only include keys that are in K
};

// ─────────────────────────────────────────────────────────────
// SECTION 5: Omit<T, K> — Remove specified properties
// ─────────────────────────────────────────────────────────────
// Opposite of Pick — exclude certain properties

type UserWithoutId = Omit<User, "id">;
// { name, email, age, role, createdAt } — no 'id'

type UserWithoutDates = Omit<User, "createdAt">;

// Use case: create request (no id yet — database generates it)
type CreateUserDTO = Omit<User, "id" | "createdAt">;
// { name: string; email: string; age: number; role: "admin"|"user"|"moderator" }

function createUser(data: CreateUserDTO): User {
  return {
    ...data,
    id: Date.now(),
    createdAt: new Date(),
  };
}

// Use case: update — no id (comes from URL param) + partial fields
type UpdateUserDTO = Partial<Omit<User, "id" | "createdAt">>;

// How Omit is implemented:
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// ─────────────────────────────────────────────────────────────
// SECTION 6: Record<K, V> — Map keys to values
// ─────────────────────────────────────────────────────────────
// Create an object type with specific key type and value type

// Dictionary pattern:
type UsersByRole = Record<User["role"], User[]>;
// { admin: User[]; user: User[]; moderator: User[] }

type ErrorMessages = Record<string, string>;
const errors: ErrorMessages = {
  required: "This field is required",
  minLength: "Too short",
  maxLength: "Too long",
};

// Map HTTP status codes to messages:
type StatusMessages = Record<number, string>;
const httpMessages: StatusMessages = {
  200: "OK",
  404: "Not Found",
  500: "Internal Server Error",
};

// Group by enum-like keys:
type TasksByStatus = Record<Task["status"], Task[]>;

// How Record is implemented:
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};

// ─────────────────────────────────────────────────────────────
// SECTION 7: Exclude<T, U> — Remove types from a union
// ─────────────────────────────────────────────────────────────
// Removes types that are ASSIGNABLE to U from union T

type AllStatus = "pending" | "in-progress" | "completed" | "cancelled";
type ActiveStatus = Exclude<AllStatus, "cancelled">;
// "pending" | "in-progress" | "completed"

type NotString = Exclude<string | number | boolean, string>;
// number | boolean

// How Exclude is implemented:
type MyExclude<T, U> = T extends U ? never : T;
// For each type in T union: if it extends U → remove (never), else keep

// ─────────────────────────────────────────────────────────────
// SECTION 8: Extract<T, U> — Keep only matching types from union
// ─────────────────────────────────────────────────────────────
// Opposite of Exclude — keeps types ASSIGNABLE to U

type OnlyStrings = Extract<string | number | boolean, string>;
// string

type AdminOrMod = Extract<User["role"], "admin" | "moderator">;
// "admin" | "moderator"

// How Extract is implemented:
type MyExtract<T, U> = T extends U ? T : never;

// ─────────────────────────────────────────────────────────────
// SECTION 9: NonNullable<T> — Remove null and undefined
// ─────────────────────────────────────────────────────────────
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string

// Use case: after null check, get the non-null type
type SafeUser = NonNullable<User | null | undefined>; // User

// How NonNullable is implemented:
type MyNonNullable<T> = T & {}; // modern TS
// Or: T extends null | undefined ? never : T

// ─────────────────────────────────────────────────────────────
// SECTION 10: ReturnType<T> & Parameters<T>
// ─────────────────────────────────────────────────────────────

function fetchUserFromAPI(id: number, token: string) {
  return { id, name: "Rohit", email: "r@r.com" };
}

// Extract return type of a function:
type FetchedUser = ReturnType<typeof fetchUserFromAPI>;
// { id: number; name: string; email: string; }

// Extract parameter types as a tuple:
type FetchParams = Parameters<typeof fetchUserFromAPI>;
// [id: number, token: string]

// Practical: reuse return types without importing the type separately
type APIUser = ReturnType<typeof fetchUserFromAPI>;
const apiUser: APIUser = { id: 1, name: "Test", email: "t@t.com" };

// ConstructorParameters — get constructor args:
class HttpClient {
  constructor(baseURL: string, timeout: number, headers: Record<string, string>) {}
}
type ClientArgs = ConstructorParameters<typeof HttpClient>;
// [baseURL: string, timeout: number, headers: Record<string, string>]

// InstanceType — get the instance type from a constructor:
type ClientInstance = InstanceType<typeof HttpClient>;
// HttpClient (the instance type)

// ─────────────────────────────────────────────────────────────
// SECTION 11: Awaited<T> — Unwrap Promise type
// ─────────────────────────────────────────────────────────────
async function getUser(): Promise<User> {
  return {} as User;
}

type AwaitedUser = Awaited<ReturnType<typeof getUser>>;
// User (not Promise<User>)

type NestedAwaited = Awaited<Promise<Promise<string>>>;
// string — fully unwrapped!

// ─────────────────────────────────────────────────────────────
// SECTION 12: COMBINING UTILITY TYPES
// ─────────────────────────────────────────────────────────────
// Real-world patterns using multiple utility types together:

// ── Pattern 1: Create / Update / Read DTOs ────────────────────
type CreateTaskDTO = Omit<Task, "id">;
type UpdateTaskDTO = Partial<Omit<Task, "id">>;
type TaskPreview   = Pick<Task, "id" | "title" | "status" | "priority">;
type ReadTaskDTO   = Readonly<Task>;

// ── Pattern 2: API response wrapper ───────────────────────────
type ApiResponse<T> = {
  data: T;
  error: string | null;
  loading: boolean;
};

type UserResponse = ApiResponse<User>;
type TaskListResponse = ApiResponse<Task[]>;
type PaginatedResponse<T> = ApiResponse<{ items: T[]; total: number; page: number }>;

// ── Pattern 3: Form state ─────────────────────────────────────
type FormState<T> = {
  values:    Partial<T>;                    // form fields (all optional while typing)
  errors:    Partial<Record<keyof T, string>>; // error per field
  touched:   Partial<Record<keyof T, boolean>>; // which fields were touched
  isValid:   boolean;
  isSubmitting: boolean;
};

type TaskForm = FormState<Task>;

// ── Pattern 4: Deep partial (recursive) ───────────────────────
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What are utility types in TypeScript?
A: Built-in generic types that transform other types. They eliminate
   repetitive type declarations. Key ones: Partial, Required, Readonly,
   Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters.

Q: When do you use Partial vs Required?
A: Partial → update operations (send only changed fields)
   Required → ensure all optional fields are present (publish, validate)

Q: What's the difference between Pick and Omit?
A: Pick  → whitelist: keep ONLY listed properties
   Omit  → blacklist: remove listed properties, keep the rest
   Use Pick when you want few properties, Omit when you want most.

Q: What's the difference between Exclude and Extract?
A: Exclude → REMOVE from union: Exclude<A|B|C, B> → A|C
   Extract → KEEP from union:  Extract<A|B|C, B|C> → B|C
   Think: Exclude = set difference, Extract = set intersection

Q: How is Record<K,V> different from {[key: K]: V}?
A: Record<K,V> is the cleaner, more readable syntax.
   Record<string, number> === { [key: string]: number }

Q: What is ReturnType useful for?
A: Avoid duplicating type definitions. If a function returns a complex
   type, use ReturnType<typeof fn> instead of repeating the type.

Q: How do you implement custom Partial?
A: type MyPartial<T> = { [K in keyof T]?: T[K] }
   [K in keyof T] maps over all keys
   ? makes each optional
   T[K] preserves the original value type
*/
