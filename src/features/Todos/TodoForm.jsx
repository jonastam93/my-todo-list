import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";
import { sanitizeInput } from "../../utils/sanitizeInput";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const [error, setError] = useState("");

  async function handleAddTodo(event) {
    event.preventDefault();

    // Validation first
    if (!workingTodoTitle.trim()) {
      setError("Task title is required");
      return;
    }

    if (!isValidTodoTitle(workingTodoTitle)) {
      setError("Task title is invalid");
      return;
    }

    if (workingTodoTitle.length > 100) {
      setError("Task title must be 100 characters or less");
      return;
    }

    // Sanitize after validation
    const sanitizedTitle = sanitizeInput(workingTodoTitle);

    try {
      await onAddTodo(sanitizedTitle);

      setWorkingTodoTitle("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to save task. Please try again.");
    }
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        maxLength={100}
      />

      {error && <p>{error}</p>}

      <button
        type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;