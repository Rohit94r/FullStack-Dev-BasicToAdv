import { useState, FormEvent } from "react";

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  // TODO: Controlled input state — useState("")
  // const [text, setText] = _____________________

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // TODO: Trim text; if empty, return early
    // _____________________

    // TODO: Call onAdd(text), then reset input to ""
    // _____________________
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      {/* TODO: Controlled input — value={text} onChange={e => setText(e.target.value)} */}
      <input
        type="text"
        placeholder="What needs to be done?"
        style={{ flex: 1, padding: "0.5rem" }}
      />
      <button type="submit">Add</button>
    </form>
  );
}
