import { useState } from "react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import buttonStyles from "../../../shared/styles/buttons.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    event.preventDefault();

    if (!isEditing) return;

    onUpdateTodo({
      ...todo,
      title: workingTitle,
    });

    setIsEditing(false);
  }

  return (
    <li>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <TextInputWithLabel
            elementId={`edit-${todo.id}`}
            labelText="Todo"
            value={workingTitle}
            onChange={handleEdit}
          />

          <button className={`${buttonStyles.base} ${buttonStyles.secondary}`}>
            Cancel
          </button>

          <button
            type="submit"
            className={`${buttonStyles.base} ${buttonStyles.primary}`}
            disabled={!isValidTodoTitle(workingTitle)}
          >
            Update
          </button>
        </form>
      ) : (
        <form>
          <label>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
          </label>

          <span onClick={() => setIsEditing(true)}>
            {todo.title}
          </span>

          <button
            type="button"
            onClick={() => onDeleteTodo(todo.id)}
            className={`${buttonStyles.base} ${buttonStyles.danger}`}
          >
            Delete
          </button>
        </form>
      )}
    </li>
  );
}

export default TodoListItem;