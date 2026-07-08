/*
─────────────────────────────────────────────────────────────
 LESSON 4 — EVENTS & FORMS
 LEVEL : Beginner (you know useState from Lesson 3)
 TOPIC : onClick, onChange, event types, controlled inputs,
         form submission, checkbox/select/textarea
─────────────────────────────────────────────────────────────

 EVENTS IN REACT vs VANILLA JS
 On Day 2 you wrote: button.addEventListener("click", fn)
 In React you attach the handler right in JSX: onClick={fn}

 Differences to remember:
 1. camelCase names: onClick, onChange, onSubmit
    (HTML uses lowercase: onclick)
 2. You pass a FUNCTION, not a string: onClick={handleClick}
 3. React gives you a SyntheticEvent — a wrapper around the
    native event that behaves the same in every browser.
    Same API you know: e.target, e.preventDefault(), etc.
*/

import { useState } from "react";

// ─────────────────────────────────────────────────────────
// 1. CLICK EVENTS — the three ways to pass a handler
// ─────────────────────────────────────────────────────────

function ClickDemo() {
  const [message, setMessage] = useState("Click something...");

  // Way 1: named function (best for anything longer than a line)
  function handleReset() {
    setMessage("Reset!");
  }

  return (
    <div>
      <p>{message}</p>

      {/* Way 2: pass the reference. NO parentheses!
          onClick={handleReset()} ❌ would CALL it during render.
          onClick={handleReset}   ✅ gives React the function to
          call later, when the click happens. */}
      <button onClick={handleReset}>Reset</button>

      {/* Way 3: inline arrow function — needed when you must
          pass ARGUMENTS. The arrow creates a small function that
          React calls on click, which then calls yours. */}
      <button onClick={() => setMessage("Hello!")}>Say hello</button>
      <button onClick={() => setMessage(`Time: ${new Date().toLocaleTimeString()}`)}>
        Show time
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 2. CONTROLLED INPUTS — the core form pattern
// ─────────────────────────────────────────────────────────

/*
 A CONTROLLED input is one where React state is the single
 source of truth for the input's value:

     state ──(value prop)──▶ input on screen
       ▲                        │
       └──(onChange + setter)───┘

 Every keystroke: onChange fires → setter updates state →
 re-render → input shows the state. A perfect loop.

 WHY BOTHER? Because the value lives in JS, you can:
 - validate on every keystroke
 - disable the submit button when empty
 - transform input (e.g. force uppercase)
 - reset the form by resetting state

 The opposite ("uncontrolled") leaves the value inside the DOM
 and reads it only when needed (with a ref). Controlled is the
 default choice in React apps.
*/

function ControlledInputDemo() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        // value ties the input to state. Without onChange the
        // input would be frozen — React would force it back to
        // `text` on every keystroke.
        value={text}
        // e is typed automatically in TSX; if you extract the
        // handler, type it as React.ChangeEvent<HTMLInputElement>
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
      />
      {/* Instant feedback — impossible this cleanly without state: */}
      <p>You typed: {text}</p>
      <p>Length: {text.length} {text.length > 10 && "— that's long!"}</p>
      <button onClick={() => setText("")}>Clear</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 3. FORM SUBMISSION — onSubmit + preventDefault
// ─────────────────────────────────────────────────────────

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Extracted handler → we type the event ourselves.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // CRITICAL: browsers reload the page on form submit by
    // default (old-school behavior from before JavaScript apps).
    // preventDefault() stops that so React stays in control.
    e.preventDefault();

    // Validation is trivial because values are already in state:
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setSubmitted(true);
    // Real app: send to your Express API here (fetch/axios).
  }

  if (submitted) {
    return <p>Welcome, {email}! ✅</p>;
  }

  return (
    // Put the handler on the FORM's onSubmit, not the button's
    // onClick — then pressing Enter in any field also submits. ✅
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {/* Show error only when it exists (conditional rendering): */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Disable until both fields have content — easy with state: */}
      <button type="submit" disabled={!email || !password}>
        Log in
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────
// 4. OTHER FORM CONTROLS — checkbox, select, textarea
// ─────────────────────────────────────────────────────────

function OtherControlsDemo() {
  // Checkbox: the value is e.target.CHECKED (boolean), not .value!
  const [agreed, setAgreed] = useState(false);

  // Select: works like a text input — value + onChange.
  const [fruit, setFruit] = useState("apple");

  // Textarea: in React it uses `value` too (in HTML the text goes
  // between the tags; React unifies everything under value).
  const [bio, setBio] = useState("");

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        I agree to the terms
      </label>

      <select value={fruit} onChange={(e) => setFruit(e.target.value)}>
        <option value="apple">Apple</option>
        <option value="mango">Mango</option>
        <option value="banana">Banana</option>
      </select>

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Your bio..."
        rows={3}
      />

      <p>
        Agreed: {String(agreed)} | Fruit: {fruit} | Bio: {bio.length} chars
      </p>
    </div>
  );
}

export default function Lesson04Demo() {
  return (
    <main>
      <ClickDemo />
      <ControlledInputDemo />
      <LoginForm />
      <OtherControlsDemo />
    </main>
  );
}

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: What is a controlled component?
 A: A form element whose value is driven by React state:
    value={state} plus onChange={e => setState(e.target.value)}.
    State is the single source of truth, enabling instant
    validation, disabling buttons, and easy resets.

 Q: Controlled vs uncontrolled inputs?
 A: Controlled: value lives in React state, updated every keystroke.
    Uncontrolled: value lives in the DOM; you read it with a ref
    when needed. Controlled is preferred for most forms.

 Q: What is a SyntheticEvent?
 A: React's cross-browser wrapper around the native DOM event.
    Same interface (target, preventDefault, stopPropagation)
    but consistent across browsers.

 Q: Why onClick={fn} and not onClick={fn()}?
 A: fn() CALLS the function immediately during render and passes
    its return value. You must pass the function itself, so React
    can call it when the event fires.

 Q: How do you pass an argument to an event handler?
 A: Wrap it in an arrow function: onClick={() => remove(id)}.

 Q: Why call e.preventDefault() in onSubmit?
 A: The browser's default form submission reloads the page,
    destroying the app's state. preventDefault keeps the SPA
    alive so you can handle the data in JavaScript.

 Q: How is a checkbox handled differently?
 A: Use the `checked` prop and read e.target.checked (boolean)
    instead of value/e.target.value.
─────────────────────────────────────────────────────────────
*/
