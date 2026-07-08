# DAY 10 — React Basics (Components, State, Hooks)

## Today's Goal
Think in React: break UI into components, manage state, handle events.
useState and useEffect become second nature.

## Content Ready
All **5 lesson files** in `lessons/` and the **todo-app** scaffold in `project/todo-app/` are pre-built. Fill every `TODO` before checking answers.

## Morning Revision (2 hr)
From memory: write a Prisma model with a 1-N relation + the transaction
code for borrowing a book. Explain why it's a transaction.

## Lessons (in order) — ALL FILES EXIST in `lessons/`
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-what-is-react.md` | Why React exists, Virtual DOM, declarative vs imperative | 30 min |
| 2 | `02-components-and-jsx.tsx` | Function components, JSX rules, fragments, props, children | 60 min |
| 3 | `03-state-usestate.tsx` | useState, state updates are async, updating objects/arrays immutably | 75 min |
| 4 | `04-events-and-forms.tsx` | onClick, onChange, controlled inputs, form submission | 60 min |
| 5 | `05-lists-and-conditional.tsx` | .map() rendering, WHY keys matter, conditional rendering patterns | 45 min |
| 6 | `06-useeffect.tsx` | Effects, dependency array (the #1 source of bugs!), cleanup, fetching data | 75 min |
| 7 | `07-component-communication.tsx` | Lifting state up, passing callbacks down, composition | 45 min |

Setup: `npm create vite@latest playground -- --template react-ts`

## Project (6 hours): Todo App (React + TypeScript + Vite)
Yes, a todo app — because it covers EVERY core React concept in one small project.

Features:
- [ ] Add todo (controlled input + form submit)
- [ ] Toggle complete (immutable array update!)
- [ ] Delete todo
- [ ] Edit todo inline (double-click → input appears — conditional rendering)
- [ ] Filter: All / Active / Completed (derived state — don't store filtered list!)
- [ ] Search box (derived state again)
- [ ] Counter: "3 of 7 remaining"
- [ ] Persist to localStorage (useEffect with dependency array)
- [ ] Load from localStorage on mount (useEffect empty deps)
- [ ] Component structure: App → TodoForm, TodoFilters, TodoList → TodoItem
- [ ] All typed with TypeScript (Todo interface, props interfaces)

## Tonight's Notes
- What is the Virtual DOM (simple explanation)
- Why can't you mutate state directly? Show wrong vs right array update
- useEffect dependency array: [] vs [x] vs missing — what each means
- Why keys in lists? What breaks with index as key?
- What "lifting state up" means

## Interview Questions
1. What is JSX? What does it compile to?
2. Props vs state?
3. Why is state immutable in React?
4. Explain useEffect dependency array behaviors.
5. What happens if you forget the cleanup function in useEffect?
6. What is a controlled component?
