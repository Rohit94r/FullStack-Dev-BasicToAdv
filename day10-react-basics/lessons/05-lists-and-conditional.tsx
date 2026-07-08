/*
─────────────────────────────────────────────────────────────
 LESSON 5 — LISTS & CONDITIONAL RENDERING
 LEVEL : Beginner (you know useState and events)
 TOPIC : Rendering arrays with .map(), WHY keys matter (and
         what breaks with index keys), conditional rendering:
         && / ternary / early return
─────────────────────────────────────────────────────────────

 THE BIG IDEA
 JSX is just JavaScript values. An ARRAY of JSX elements is a
 valid thing to render. So "show a list" in React means:
 "transform my data array into a JSX array with .map()".
 No for-loops in the markup, no innerHTML — just map.
*/

import { useState } from "react";

// ─────────────────────────────────────────────────────────
// 1. RENDERING A LIST WITH .map()
// ─────────────────────────────────────────────────────────

interface Student {
  id: number;      // a STABLE unique id — we'll need it for keys
  name: string;
  score: number;
}

const students: Student[] = [
  { id: 101, name: "Rohit", score: 88 },
  { id: 102, name: "Asha", score: 95 },
  { id: 103, name: "Vikram", score: 72 },
];

function StudentList() {
  return (
    <ul>
      {/* map: Student → <li>. React renders the resulting array. */}
      {students.map((s) => (
        <li key={s.id}>
          {s.name} — {s.score} points
        </li>
      ))}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────
// 2. WHY KEYS MATTER (read this twice!)
// ─────────────────────────────────────────────────────────

/*
 When the list changes, React must figure out WHICH items were
 added / removed / moved. The `key` is each item's identity tag.

 Analogy: coat check at a restaurant. Each coat gets a numbered
 tag. When you return, the tag finds YOUR coat instantly. Without
 tags the staff must guess by position — "third coat from the
 left" — and if someone inserted a coat, everyone gets the
 wrong one.

 GOOD key: a stable unique id from your data (database id,
           Date.now() at creation, crypto.randomUUID()).
 BAD key : the array INDEX — because when items are inserted,
           removed, or reordered, indexes SHIFT, so React matches
           old DOM/state with the WRONG items.

 WHAT ACTUALLY BREAKS WITH INDEX KEYS?
 Anything React associates with the key follows the key, not
 your data:
 - component STATE (e.g. "is this row in edit mode?")
 - uncontrolled input values typed by the user
 - animations, focus, scroll position
 Delete row 0 with index keys → every row's index shifts by 1 →
 React thinks row 1 is "still row 0" → the edit-mode/typed text
 of the deleted row appears on the row BELOW it. Classic bug.
*/

function IndexKeyBugDemo() {
  const [names, setNames] = useState(["Alpha", "Beta", "Gamma"]);

  function removeFirst() {
    setNames(names.slice(1));
  }

  return (
    <div>
      {/* Type something into the inputs below, then click remove.
          With index keys, the TEXT you typed stays with position 0
          and attaches to the wrong name. Try it! */}
      <h4>❌ index as key (buggy):</h4>
      {names.map((name, index) => (
        <div key={index}>
          {name}: <input placeholder={`notes for ${name}`} />
        </div>
      ))}

      <h4>✅ stable value as key (correct):</h4>
      {names.map((name) => (
        <div key={name}>
          {name}: <input placeholder={`notes for ${name}`} />
        </div>
      ))}

      <button onClick={removeFirst}>Remove first</button>
      {/* When is index OK? Only if the list NEVER reorders,
          never inserts/removes in the middle, and items have no
          state. A static footer menu, for example. */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 3. CONDITIONAL RENDERING — pattern 1: && (show or nothing)
// ─────────────────────────────────────────────────────────

function Mailbox({ unread }: { unread: number }) {
  return (
    <div>
      <h4>Mailbox</h4>
      {/* condition && jsx
          If condition is true  → the JSX renders.
          If condition is false → React renders nothing.
          (false, null, undefined render as nothing.) */}
      {unread > 0 && <p>You have {unread} unread messages!</p>}

      {/* ⚠️ TRAP: {unread && <p>...</p>} when unread is 0 renders
          the NUMBER 0 on screen! (0 is falsy but IS renderable.)
          Always make the left side a real boolean:
          unread > 0, !!items.length, list.length > 0. */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 4. Pattern 2: ternary (this OR that)
// ─────────────────────────────────────────────────────────

function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back! <button>Log out</button></p>
      ) : (
        <p>Please sign in. <button>Log in</button></p>
      )}
      {/* Ternary is an EXPRESSION so it's legal inside JSX.
          A plain if-statement is NOT (statements produce no value). */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 5. Pattern 3: early return (whole-component branches)
// ─────────────────────────────────────────────────────────

interface Product {
  id: number;
  title: string;
}

function ProductPage({
  loading,
  error,
  products,
}: {
  loading: boolean;
  error: string | null;
  products: Product[];
}) {
  // For big branches, return early BEFORE the main JSX.
  // Reads top-to-bottom like a guard clause — much cleaner than
  // nesting three ternaries.
  if (loading) return <p>Loading products…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (products.length === 0) return <p>No products found.</p>;

  // Happy path — we KNOW we have data here:
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────
// 6. EVERYTHING TOGETHER — filtered list (derived state!)
// ─────────────────────────────────────────────────────────

function FilterableList() {
  const [query, setQuery] = useState("");

  // DERIVED STATE: we do NOT store the filtered list in useState.
  // We compute it from existing state on every render. Storing it
  // separately would mean two sources of truth that can drift
  // apart. Rule: if you can compute it, don't store it.
  const visible = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search students…"
      />
      {visible.length === 0 ? (
        <p>No matches for “{query}”.</p>
      ) : (
        <ul>
          {visible.map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Lesson05Demo() {
  return (
    <main>
      <StudentList />
      <IndexKeyBugDemo />
      <Mailbox unread={3} />
      <Mailbox unread={0} />
      <LoginStatus isLoggedIn={true} />
      <ProductPage loading={false} error={null} products={[{ id: 1, title: "Laptop" }]} />
      <FilterableList />
    </main>
  );
}

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: How do you render a list in React?
 A: Transform the data array into JSX with .map() and give each
    element a unique, stable `key` prop.

 Q: Why does React need keys?
 A: Keys give list items identity across renders so the diffing
    algorithm can match old and new items, and only add/remove/
    move what changed instead of re-creating everything.

 Q: What breaks when you use the array index as key?
 A: On insert/remove/reorder the indexes shift, so React matches
    the wrong old item to each new item. Component state, input
    values, focus, and animations attach to the wrong rows.
    Index keys are only safe for static, stateless lists.

 Q: What makes a good key?
 A: Stable (never changes for the item), unique among siblings,
    and derived from the data itself — like a database id.

 Q: Show three conditional rendering patterns.
 A: 1. {cond && <X />} — render or nothing
    2. {cond ? <X /> : <Y />} — either/or
    3. if (loading) return <Spinner /> — early return for big branches

 Q: Why does {count && <p>…</p>} sometimes print 0?
 A: && returns the left value when falsy, and the NUMBER 0 is
    renderable (unlike false/null). Fix: {count > 0 && <p>…</p>}.

 Q: What is derived state?
 A: A value computed from existing state/props during render
    (like a filtered list) instead of stored in its own useState.
    Storing it duplicates truth and invites sync bugs.
─────────────────────────────────────────────────────────────
*/
