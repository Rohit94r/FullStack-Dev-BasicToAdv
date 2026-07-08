/*
─────────────────────────────────────────────────────────────
 LESSON 2 — useContext (Context API)
 LEVEL : Intermediate
 TOPIC : ThemeContext, AuthContext, Provider pattern, pitfalls
─────────────────────────────────────────────────────────────

 WHAT IS CONTEXT?
 A way to pass data through the component tree WITHOUT manually
 drilling props through every intermediate component ("prop drilling").

 When to use:
 ✅ Theme (dark/light), locale, auth user, feature flags
 ❌ Frequently changing data (cart items, form fields) — causes
    every consumer to re-render on every change

 Pattern: createContext → Provider wraps tree → useContext reads value
*/

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────
// 1. ThemeContext — classic example
// ─────────────────────────────────────────────────────────

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Memoize the value object so consumers don't re-render unnecessarily
  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Custom hook wrapper — throws if used outside Provider (best practice!)
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header style={{ background: theme === "dark" ? "#111" : "#fff" }}>
      <button onClick={toggleTheme}>Toggle theme ({theme})</button>
    </header>
  );
}

// ─────────────────────────────────────────────────────────
// 2. AuthContext — login/logout pattern
// ─────────────────────────────────────────────────────────

type User = { id: string; name: string; role: "admin" | "user" };

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    // Fake API call — replace with real auth in production
    await new Promise((r) => setTimeout(r, 500));
    setUser({
      id: "1",
      name: email.split("@")[0],
      role: email.includes("admin") ? "admin" : "user",
    });
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: user !== null,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <p>Please log in.</p>;

  return (
    <div>
      <p>Welcome, {user!.name} ({user!.role})</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TODO: Create a LanguageContext with "en" | "es" and a
//       t(key) function that returns translated strings.
// YOUR IDEA:


// ─── ANSWER ───
const translations = {
  en: { hello: "Hello", goodbye: "Goodbye" },
  es: { hello: "Hola", goodbye: "Adiós" },
} as const;

type Lang = keyof typeof translations;

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof (typeof translations)["en"]) => string;
} | null>(null);

function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: keyof (typeof translations)["en"]) => translations[lang][key],
    }),
    [lang]
  );
  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────
// Provider nesting — real apps wrap multiple providers
// ─────────────────────────────────────────────────────────

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function Lesson02Demo() {
  return (
    <AppProviders>
      <Header />
      <Dashboard />
    </AppProviders>
  );
}

/*
─────────────────────────────────────────────────────────────
 INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

 Q: When should you use Context?
 A: For global-ish data that many components need (theme, auth,
    locale) and changes infrequently. Not for high-frequency updates.

 Q: Why is Context bad for cart/state that changes often?
 A: Every consumer re-renders when the context value changes.
    A cart update would re-render the entire tree. Redux or
    component-local state + lifting is better.

 Q: Why wrap useContext in a custom hook (useTheme)?
 A: Encapsulates the null check, gives a clear API, and lets you
    refactor the implementation without changing consumers.

 Q: Why useMemo on the Provider value?
 A: Without it, a new object is created every render, causing
    ALL consumers to re-render even if data didn't change.

 Q: Context vs Redux?
 A: Context = built-in, simple, good for low-frequency global data.
    Redux = predictable updates, devtools, middleware, selectors,
    better for complex app state.
─────────────────────────────────────────────────────────────
*/
