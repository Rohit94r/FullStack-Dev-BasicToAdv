import { useTodos } from "./hooks/useTodos";
import { AddTodo } from "./components/AddTodo";
import { TodoList } from "./components/TodoList";
import type { Filter } from "./hooks/useTodos";

function App() {
  // TODO: Destructure everything you need from useTodos()
  // const { todos, filter, setFilter, filteredTodos, remaining, addTodo, toggleTodo, deleteTodo } = _____________________

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>Todos</h1>

      {/* TODO: Pass addTodo to AddTodo */}
      {/* <AddTodo onAdd={_______} /> */}

      {/* TODO: Render filter buttons — highlight active filter */}
      {/* {filters.map(f => (
        <button key={f.value} onClick={() => setFilter(f.value)}>
          {f.label}
        </button>
      ))} */}

      {/* TODO: Show remaining counter — "{remaining} of {todos.length} remaining" */}
      {/* <p>_______</p> */}

      {/* TODO: Pass filteredTodos + handlers to TodoList */}
      {/* <TodoList
        todos={_______}
        onToggle={_______}
        onDelete={_______}
      /> */}
    </div>
  );
}

export default App;
