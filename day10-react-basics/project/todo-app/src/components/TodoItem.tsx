import { Todo } from "../hooks/useTodos";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* TODO: Checkbox — checked={todo.completed}, onChange={() => onToggle(todo.id)} */}
      <input type="checkbox" />

      {/* TODO: Apply line-through style when todo.completed is true */}
      <span style={{ flex: 1 }}>
        {todo.text}
      </span>

      {/* TODO: Delete button — onClick={() => onDelete(todo.id)} */}
      <button type="button" aria-label="Delete todo">
        ✕
      </button>
    </li>
  );
}
