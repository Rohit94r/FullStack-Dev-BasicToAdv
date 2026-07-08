import { Todo } from "../hooks/useTodos";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  // TODO: If todos array is empty, show a friendly message
  // if (todos.length === 0) return <p>No todos yet!</p>
  // _____________________

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {/* TODO: Map todos to TodoItem — pass key={todo.id} (NEVER use index!) */}
      {/* {todos.map(todo => (
        <TodoItem
          key={_______}
          todo={_______}
          onToggle={_______}
          onDelete={_______}
        />
      ))} */}
    </ul>
  );
}
