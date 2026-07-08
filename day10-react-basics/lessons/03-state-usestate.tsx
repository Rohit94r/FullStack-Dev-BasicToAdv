/*
─────────────────────────────────────────────────────────────
 LESSON 3 — STATE with useState
 LEVEL : Beginner (you know components & props from Lesson 2)
 TOPIC : useState, why setState is async/batched, updating
         objects and arrays IMMUTABLY (wrong vs right)
─────────────────────────────────────────────────────────────

 WHAT IS STATE?
 State = data that a component REMEMBERS between renders and
 that can CHANGE over time. When state changes, React re-runs
 the component function ("re-render") and updates the screen.

 Props vs state, in one line:
   props = data given TO you by your parent (read-only)
   state = data you OWN and can change (private memory)

 Analogy: props are your birth certificate (given, fixed).
 State is your notebook (yours, you update it).

 WHY NOT A NORMAL VARIABLE?
 Two reasons a `let count = 0` inside a component fails:
 1. Changing it does NOT tell React to repaint the screen.
 2. When React re-renders, the function runs again from the top,
    so the variable resets to 0. State survives re-renders.
*/

import { useState } from "react";

// ─────────────────────────────────────────────────────────
// 1. THE BASIC PATTERN
// ─────────────────────────────────────────────────────────

function Counter() {
  // useState(0) returns a PAIR (array with 2 items):
  //   count    → the current value
  //   setCount → the ONLY legal way to change it
  // The 0 is the initial value, used only on the first render.
  // TypeScript infers `count: number` from the 0.
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      {/* Calling setCount does two things:
          1. stores the new value
          2. schedules a re-render of this component */}
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 2. STATE UPDATES ARE ASYNC AND BATCHED (the #1 surprise)
// ─────────────────────────────────────────────────────────

function BatchingDemo() {
  const [count, setCount] = useState(0);

  function handleTripleClickWrong() {
    // ❌ WRONG expectation: "this adds 3"
    setCount(count + 1); // count is 0 here → schedules "set to 1"
    setCount(count + 1); // count is STILL 0 here → "set to 1" again
    setCount(count + 1); // still 0 → "set to 1"
    // Result: count becomes 1, not 3!
    //
    // WHY: `count` is a normal const captured by this function.
    // setCount does NOT change it immediately — it asks React to
    // re-render LATER with a new value. All three calls read the
    // same old snapshot (0). React also BATCHES the three updates
    // into ONE re-render for performance.
    console.log(count); // still logs 0, even after the calls above!
  }

  function handleTripleClickRight() {
    // ✅ RIGHT: pass a FUNCTION ("updater function").
    // React calls it with the LATEST value, queue-style:
    setCount((c) => c + 1); // 0 → 1
    setCount((c) => c + 1); // 1 → 2
    setCount((c) => c + 1); // 2 → 3 ✅
  }

  // RULE OF THUMB: if the new state depends on the old state,
  // use the updater function form: setX(prev => ...)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleTripleClickWrong}>+3 (broken)</button>
      <button onClick={handleTripleClickRight}>+3 (correct)</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 3. WHY STATE MUST BE UPDATED IMMUTABLY
// ─────────────────────────────────────────────────────────

/*
 IMMUTABLE = never modify the existing object/array.
 Instead, create a NEW one with the change applied.

 WHY? React decides "did state change?" with a cheap check:
   Object.is(oldValue, newValue)   → basically: same reference?

 If you MUTATE an object (change its insides), the reference
 stays the same, so React thinks NOTHING changed → no re-render
 → screen is stale. Classic silent bug.

 Analogy: React is a security guard who only checks the CAR,
 not the passengers. Swap passengers inside the same car
 (mutation) and the guard waves you through — "nothing new".
 Arrive in a NEW car (new object) and the guard takes notice.
*/

interface Profile {
  name: string;
  city: string;
  hobbies: string[];
}

function ObjectStateDemo() {
  const [profile, setProfile] = useState<Profile>({
    // ↑ For objects/arrays, tell useState the type explicitly:
    //   useState<Profile>(...) — you know generics from TS days.
    name: "Rohit",
    city: "Pune",
    hobbies: ["coding"],
  });

  function moveCityWrong() {
    // ❌ WRONG — mutation. Same object reference.
    profile.city = "Mumbai";
    setProfile(profile); // React: "same reference, nothing changed" → NO re-render
  }

  function moveCityRight() {
    // ✅ RIGHT — build a NEW object, copy old fields with spread,
    // then overwrite what changed:
    setProfile({ ...profile, city: "Mumbai" });
  }

  function addHobbyWrong() {
    // ❌ WRONG — push mutates the existing array inside the object.
    profile.hobbies.push("gym");
    setProfile({ ...profile });
    // This one "sort of works" (new outer object) but the hobbies
    // array is still the OLD reference — breaks memoization later
    // and is a bad habit. Never mutate, even partially.
  }

  function addHobbyRight() {
    // ✅ RIGHT — new outer object AND new inner array:
    setProfile({ ...profile, hobbies: [...profile.hobbies, "gym"] });
  }

  return (
    <div>
      <p>{profile.name} — {profile.city} — {profile.hobbies.join(", ")}</p>
      <button onClick={moveCityRight}>Move city ✅</button>
      <button onClick={addHobbyRight}>Add hobby ✅</button>
      {/* wrong versions kept above just to study, not to use */}
      <button onClick={moveCityWrong}>Move city ❌ (watch: no update)</button>
      <button onClick={addHobbyWrong}>Add hobby ❌</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 4. THE ARRAY CHEAT SHEET (memorize these four!)
// ─────────────────────────────────────────────────────────

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function ArrayStateDemo() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn useState", done: false },
    { id: 2, text: "Learn useEffect", done: false },
  ]);

  // ADD → spread into a new array          ❌ todos.push(item)
  function add(text: string) {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  }

  // REMOVE → filter returns a new array    ❌ todos.splice(i, 1)
  function remove(id: number) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  // UPDATE ONE ITEM → map + spread         ❌ todos[i].done = true
  // map returns a NEW array; for the matching item we return a
  // NEW object; all other items are returned unchanged.
  function toggle(id: number) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  // REPLACE/SORT → copy first, then sort   ❌ todos.sort(...) (mutates!)
  function sortByText() {
    setTodos([...todos].sort((a, b) => a.text.localeCompare(b.text)));
  }

  return (
    <div>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <span
              style={{ textDecoration: t.done ? "line-through" : "none" }}
              onClick={() => toggle(t.id)}
            >
              {t.text}
            </span>
            <button onClick={() => remove(t.id)}>x</button>
          </li>
        ))}
      </ul>
      <button onClick={() => add("New todo")}>Add</button>
      <button onClick={sortByText}>Sort</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 5. MULTIPLE STATES vs ONE OBJECT STATE
// ─────────────────────────────────────────────────────────

function FormExample() {
  // Prefer SEPARATE states for unrelated values — simpler updates:
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Use ONE object state when values always change together
  // (like x/y coordinates of a drag). Otherwise keep them apart.

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <p>{name} — {email}</p>
    </div>
  );
}

export default function Lesson03Demo() {
  return (
    <main>
      <Counter />
      <BatchingDemo />
      <ObjectStateDemo />
      <ArrayStateDemo />
      <FormExample />
    </main>
  );
}

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: What is state in React?
 A: Data owned by a component that persists across re-renders
    and triggers a re-render when updated via its setter.

 Q: Props vs state?
 A: Props come from the parent and are read-only. State is
    private to the component and changed with its setter.
    Both trigger re-render when they change.

 Q: Why is setState "asynchronous"?
 A: The setter doesn't change the variable immediately — it
    schedules a re-render. The current render keeps its snapshot
    of state. React also batches multiple setter calls in one
    event into a single re-render for performance.

 Q: When must you use the updater function form?
 A: Whenever the new state depends on the previous state:
    setCount(c => c + 1). It always receives the latest value,
    even with batching or multiple queued updates.

 Q: Why must state be updated immutably?
 A: React detects changes by comparing references (Object.is).
    Mutating keeps the same reference, so React may skip the
    re-render, and optimizations like React.memo break. Always
    create new objects/arrays: spread, map, filter.

 Q: Show wrong vs right array update.
 A: ❌ todos.push(x); setTodos(todos)
    ✅ setTodos([...todos, x])
    ❌ todos[0].done = true
    ✅ setTodos(todos.map(t => t.id === id ? { ...t, done: true } : t))

 Q: What happens when you call a state setter?
 A: React stores the pending value, re-runs the component
    function with the new state, diffs the JSX output, and
    patches the real DOM.

 Q: Does useState merge object updates like class setState did?
 A: No. It REPLACES the value. You must spread the old object
    yourself: setUser({ ...user, name: "New" }).
─────────────────────────────────────────────────────────────
*/
