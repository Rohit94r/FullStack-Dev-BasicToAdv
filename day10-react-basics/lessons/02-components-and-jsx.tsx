/*
─────────────────────────────────────────────────────────────
 LESSON 2 — COMPONENTS & JSX
 LEVEL : Absolute beginner (first React code you write!)
 TOPIC : Function components, JSX rules, fragments, props,
         children, typing props with TypeScript
─────────────────────────────────────────────────────────────

 WHAT IS A COMPONENT?
 A component is a JavaScript FUNCTION that returns JSX.
 Think of it like inventing your own HTML tag.

 Analogy: LEGO bricks. HTML gives you basic bricks (<div>, <p>).
 Components let you build BIGGER custom bricks (<ProfileCard />)
 out of the small ones, then reuse them anywhere.

 Two hard rules:
 1. Component names MUST start with a capital letter.
    <profileCard /> ❌ — React thinks it's an HTML tag
    <ProfileCard /> ✅ — React calls your function
 2. A component must return ONE root element (or a fragment).
*/

// ─────────────────────────────────────────────────────────
// 1. THE SIMPLEST COMPONENT
// ─────────────────────────────────────────────────────────

// A function. Returns JSX. Done — this is a valid component.
function Hello() {
  return <h1>Hello, Rohit!</h1>;
}

// Use it like a tag: <Hello />  (self-closing, note the slash!)

// ─────────────────────────────────────────────────────────
// 2. JSX RULES (the 5 things that trip up beginners)
// ─────────────────────────────────────────────────────────

function JsxRules() {
  const name = "Rohit";
  const age = 25;
  const user = { city: "Pune" };

  return (
    // RULE 1: one root element. If you returned two <p> side by
    // side it would not compile — a function returns ONE value.
    <div>
      {/* RULE 2: curly braces embed any JS EXPRESSION.
          An expression = something that produces a value.
          You CANNOT put statements (if, for) inside { }. */}
      <p>Name: {name}</p>
      <p>Next year you are {age + 1}</p>
      <p>City: {user.city}</p>
      <p>Random: {Math.random().toFixed(2)}</p>

      {/* RULE 3: className, not class (class is reserved in JS).
          Also htmlFor instead of for on <label>. */}
      <p className="highlight">Styled paragraph</p>

      {/* RULE 4: every tag must close. <br> is invalid, <br /> is ok. */}
      <br />

      {/* RULE 5: inline style takes an OBJECT with camelCase keys,
          not a CSS string. Outer { } = "JS here", inner { } = object. */}
      <p style={{ backgroundColor: "gold", fontSize: "18px" }}>
        Inline styled
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 3. FRAGMENTS — grouping WITHOUT an extra div
// ─────────────────────────────────────────────────────────

/*
 Sometimes you need one root but do NOT want a wrapper <div>
 polluting your HTML (extra divs can break CSS grid/flex layouts
 you learned on Day 1). Use a FRAGMENT: <>...</>
 It groups children but renders NO real DOM element.
*/
function TableColumns() {
  return (
    <>
      <td>Cell A</td>
      <td>Cell B</td>
    </>
    // A <div> here would be INVALID inside a <tr> — fragment saves us.
  );
}

// ─────────────────────────────────────────────────────────
// 4. PROPS — passing data INTO a component
// ─────────────────────────────────────────────────────────

/*
 Props = "properties". They are the ARGUMENTS of your component
 function, written like HTML attributes.

 Analogy: props are like the settings on a washing machine.
 The machine (component) is the same, but you choose the
 temperature and program (props) each time you use it.

 KEY FACT: props are READ-ONLY. A component never modifies its
 own props — data flows DOWN from parent to child, one way.
*/

// In TypeScript we describe the shape of props with an interface.
// (You know interfaces from your TS days — same thing here.)
interface GreetingProps {
  name: string;
  age: number;
  isAdmin?: boolean; // "?" = optional prop (may be undefined)
}

// Destructure props right in the parameter list — the common style.
// "= false" gives a default value when the prop is not passed.
function Greeting({ name, age, isAdmin = false }: GreetingProps) {
  return (
    <p>
      Hello {name}, age {age}. {isAdmin ? "(admin)" : "(regular user)"}
    </p>
  );
}

// Using it — attributes become props.
// Strings can use quotes; everything else needs { }:
function GreetingDemo() {
  return (
    <>
      <Greeting name="Rohit" age={25} isAdmin={true} />
      <Greeting name="Asha" age={30} />
      {/* age="25" would be a TYPE ERROR — "25" is a string, not number.
          TypeScript catches this before the browser ever runs it. ✅ */}
    </>
  );
}

// ─────────────────────────────────────────────────────────
// 5. CHILDREN — the special prop for nested content
// ─────────────────────────────────────────────────────────

/*
 Whatever you put BETWEEN a component's opening and closing tags
 arrives as a prop called `children`. This lets you build
 "wrapper" components — like a picture frame that can hold ANY photo.
*/
import type { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode; // ReactNode = "anything renderable": JSX, string, number...
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card" style={{ border: "1px solid #ccc", padding: 16 }}>
      <h2>{title}</h2>
      {/* We don't know or care what's inside — we just place it. */}
      <div>{children}</div>
    </div>
  );
}

function CardDemo() {
  return (
    <Card title="My Profile">
      {/* ALL of this becomes the `children` prop of Card: */}
      <p>Full-stack student.</p>
      <p>Currently learning React.</p>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// 6. COMPOSITION — building a page from small components
// ─────────────────────────────────────────────────────────

function Avatar({ url, alt }: { url: string; alt: string }) {
  // ↑ You can also type props inline for tiny components.
  return <img src={url} alt={alt} width={64} height={64} />;
}

function ProfileCard({ name, imageUrl }: { name: string; imageUrl: string }) {
  // A component USING other components — this is composition.
  return (
    <Card title={name}>
      <Avatar url={imageUrl} alt={`Photo of ${name}`} />
      <Greeting name={name} age={25} />
    </Card>
  );
}

// The demo "page" that a playground App could render:
export default function Lesson02Demo() {
  return (
    <main>
      <Hello />
      <JsxRules />
      <GreetingDemo />
      <CardDemo />
      <ProfileCard name="Rohit" imageUrl="https://i.pravatar.cc/64" />
      <table>
        <tbody>
          <tr>
            <TableColumns />
          </tr>
        </tbody>
      </table>
    </main>
  );
}

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: What is a React component?
 A: A JavaScript function that accepts props and returns JSX
    describing part of the UI. Components are reusable and
    composable, like custom HTML tags.

 Q: What are props?
 A: Read-only inputs passed from parent to child, like function
    arguments. A component must never modify its own props —
    data flows one way, down the tree.

 Q: What is the children prop?
 A: A special prop containing whatever is nested between a
    component's opening and closing tags. It enables wrapper /
    layout components that don't know their content in advance.

 Q: What is a Fragment and why use it?
 A: <>...</> groups multiple elements without adding an extra
    DOM node. Useful because a component must return one root,
    but extra <div>s can break layouts or invalid HTML nesting.

 Q: Why must component names be capitalized?
 A: JSX uses the capitalization to decide: lowercase = HTML tag
    string ("div"), Capitalized = call your component function.

 Q: How do you type props in TypeScript?
 A: Define an interface (or type) for the props object and
    annotate the destructured parameter:
    function Btn({ label }: { label: string }) { ... }

 Q: Can a child send data back to a parent through props?
 A: Not directly — but the parent can pass a CALLBACK FUNCTION
    as a prop, and the child calls it with data. (Lesson 7!)
─────────────────────────────────────────────────────────────
*/
