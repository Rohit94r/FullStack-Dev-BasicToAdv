# Todo App — Day 10 Project

React + TypeScript + Vite todo application with fill-in-the-blank exercises.

## Setup

Create the Vite project, then copy the scaffold files from this folder:

```bash
cd project
npm create vite@latest todo-app -- --template react-ts
cd todo-app
npm install
```

Replace (or merge) the generated files with the ones in this directory:

- `src/App.tsx`
- `src/components/AddTodo.tsx`
- `src/components/TodoList.tsx`
- `src/components/TodoItem.tsx`
- `src/hooks/useTodos.ts`

Then start the dev server:

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Your Task

Fill in every `TODO` comment. Features to implement:

- [ ] Add todo (controlled input + form submit)
- [ ] Toggle complete (immutable array update)
- [ ] Delete todo
- [ ] Filter: All / Active / Completed (derived state)
- [ ] Counter: "X of Y remaining"
- [ ] Persist to localStorage (useEffect)
- [ ] Load from localStorage on mount

## Component Structure

```
App
├── AddTodo        (form + controlled input)
├── filter buttons (All / Active / Completed)
└── TodoList
    └── TodoItem   (toggle, delete)
```

State lives in `useTodos` hook — lifted to `App` and passed down as props.

## TypeScript

The `Todo` interface is defined in `useTodos.ts`:

```ts
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}
```

## Tips

- Never mutate state: use spread `[...todos]` and `.map()` for updates
- Filtered list = **derived** from `todos` + `filter` — don't store separately
- `useEffect(() => {}, [])` runs once on mount (load from localStorage)
- `useEffect(() => {}, [todos])` saves whenever todos change
