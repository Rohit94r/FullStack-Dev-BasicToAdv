export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "todos";

export function useTodos() {
  // TODO: Create state for todos (Todo[]) — initial value []
  // const [todos, setTodos] = _____________________

  // TODO: Create state for filter (Filter) — initial value "all"
  // const [filter, setFilter] = _____________________

  // TODO: Load todos from localStorage on mount (useEffect with [] deps)
  // Hint: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  // Guard with try/catch in case of corrupt data
  // _____________________

  // TODO: Save todos to localStorage whenever todos change
  // useEffect(() => { localStorage.setItem(...) }, [todos])
  // _____________________

  const addTodo = (text: string) => {
    // TODO: Create new Todo with crypto.randomUUID() or Date.now().toString()
    // Append immutably: setTodos(prev => [...prev, newTodo])
    // _____________________
  };

  const toggleTodo = (id: string) => {
    // TODO: Map over todos, flip completed for matching id
    // setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    // _____________________
  };

  const deleteTodo = (id: string) => {
    // TODO: Filter out the todo with matching id
    // _____________________
  };

  // TODO: Derive filteredTodos from todos + filter
  // "active" → !completed, "completed" → completed, "all" → everything
  // const filteredTodos = _____________________

  // TODO: Derive remaining count (not completed)
  // const remaining = _____________________

  return {
    todos,
    filter,
    setFilter,
    filteredTodos,
    remaining,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
