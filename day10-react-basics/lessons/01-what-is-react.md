# LESSON 1 — What Is React? (Absolute Beginner)

─────────────────────────────────────────────────────────────
TOPIC : Why React exists, Virtual DOM, declarative vs imperative, JSX
LEVEL : Absolute beginner (you know HTML/CSS/JS — React is new)
TIME  : ~30 minutes of reading
─────────────────────────────────────────────────────────────

## 1. The problem React solves

Remember Day 2–3 when you used plain JavaScript to change the page?
You wrote code like this:

```js
// Plain JavaScript ("vanilla JS") — you did this before:
const button = document.querySelector("#add-btn");
const list = document.querySelector("#todo-list");

button.addEventListener("click", () => {
  const li = document.createElement("li");   // 1. create element
  li.textContent = "New todo";               // 2. set its text
  list.appendChild(li);                      // 3. put it in the page
});
```

This works for small pages. But imagine a real app like Amazon:

- The cart badge must update when you add a product.
- The cart page must update too.
- The "total price" must update.
- The "remove" button must appear.

With plain JS, **YOU** must remember every place on the page that needs
to change, and update each one by hand. Forget one → bug. This is why
big vanilla-JS apps become spaghetti.

**React's big idea:**

> You describe WHAT the page should look like for a given data.
> React figures out HOW to update the real page.

You never write `document.createElement` or `appendChild` again.
You change the DATA, and React repaints the screen for you.

─────────────────────────────────────────────────────────────

## 2. Declarative vs imperative (the core mindset shift)

**Imperative** = step-by-step instructions ("do this, then this").
**Declarative** = describe the end result ("this is what I want").

Analogy: ordering food.

- Imperative: walk into the kitchen and tell the chef:
  "Take a pan. Heat oil. Chop onions. Fry 3 minutes…"
- Declarative: sit at the table and say:
  "One paneer tikka, please." The kitchen handles the steps.

Vanilla JS is imperative:

```js
// IMPERATIVE: you give steps
if (loggedIn) {
  header.textContent = "Welcome back!";
  logoutBtn.style.display = "block";
  loginBtn.style.display = "none";
}
```

React is declarative:

```jsx
// DECLARATIVE: you describe the result for each situation
function Header({ loggedIn }) {
  return loggedIn
    ? <h1>Welcome back! <LogoutButton /></h1>
    : <h1>Please log in <LoginButton /></h1>;
}
```

You never say "hide the login button". You just say: *when `loggedIn`
is true, the page looks like this*. React makes the real page match.

─────────────────────────────────────────────────────────────

## 3. The Virtual DOM (how React updates efficiently)

The real DOM (the browser's page tree) is SLOW to touch. Every change
can force the browser to recalculate layout and repaint pixels.

React keeps a **Virtual DOM**: a lightweight copy of the page as plain
JavaScript objects (cheap to create, cheap to compare).

The update cycle:

1. Your data changes (for example: a todo was added).
2. React builds a NEW virtual DOM tree describing the new UI.
3. React **diffs** it against the previous virtual tree
   (this comparison is called "reconciliation").
4. React finds the SMALLEST set of real DOM changes needed
   (for example: "add one `<li>` at the end") and applies only those.

Analogy: editing a 100-page contract. You don't reprint the whole book.
You compare the old and new versions, find the 2 changed paragraphs,
and replace only those pages.

Important truth: the Virtual DOM is not "faster than the DOM" — it is a
strategy that lets YOU write simple code ("re-describe the whole UI")
while React keeps real DOM changes small.

─────────────────────────────────────────────────────────────

## 4. What is JSX and what does it compile to?

JSX looks like HTML inside JavaScript:

```jsx
const element = <h1 className="title">Hello, Rohit!</h1>;
```

Browsers cannot run this. A build tool (Vite uses esbuild/Babel-style
transforms) compiles JSX into a normal function call:

```js
// What the line above becomes (modern JSX transform):
import { jsx } from "react/jsx-runtime";
const element = jsx("h1", { className: "title", children: "Hello, Rohit!" });
```

So JSX is just **sugar for creating JavaScript objects** that describe
UI. That object is a virtual DOM node. Nothing magical — which is why:

- You write `className` not `class` (`class` is a reserved JS word).
- You can put JSX in variables, pass it as arguments, return it from
  functions — it is a value, like a string or number.
- `{expression}` inside JSX embeds any JS expression.

─────────────────────────────────────────────────────────────

## 5. What a React app actually is

A React app is a tree of **components**. A component is a JavaScript
function that returns JSX. That's it.

```
App
├── Navbar
├── TodoForm
└── TodoList
    ├── TodoItem
    ├── TodoItem
    └── TodoItem
```

Each component is like a custom HTML tag you invent: `<TodoList />`.
Small pieces, each with one job, composed together — exactly like you
composed small functions on Day 2.

The whole app starts from one line (you'll see this in `main.tsx`):

```tsx
createRoot(document.getElementById("root")!).render(<App />);
```

Meaning: "React, take control of the `<div id="root">` in index.html
and render my `App` component inside it."

─────────────────────────────────────────────────────────────

## INTERVIEW Q&A CHEAT SHEET

**Q: What is React?**
A: A JavaScript library for building user interfaces from reusable
components. You describe the UI as a function of your data, and React
updates the real DOM efficiently when the data changes.

**Q: What is the Virtual DOM?**
A: An in-memory JavaScript representation of the UI. On every update
React builds a new virtual tree, diffs it with the previous one
(reconciliation), and applies only the minimal changes to the real DOM.

**Q: Declarative vs imperative?**
A: Imperative code gives step-by-step DOM instructions. Declarative
code describes what the UI should look like for a given state, and the
framework performs the steps. React is declarative.

**Q: What is JSX? What does it compile to?**
A: A syntax extension that looks like HTML inside JS. It compiles to
function calls (`jsx(...)` / `React.createElement(...)`) that return
plain objects describing UI — so JSX is just JavaScript expressions.

**Q: Is React a framework or a library?**
A: Technically a library — it only handles UI rendering. Routing, data
fetching, etc. come from other packages (React Router, Redux, etc.).

**Q: Why className instead of class?**
A: JSX compiles to JavaScript, and `class` is a reserved keyword in JS,
so React uses the DOM property name `className`.
