import { useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo }) {

function handleAddTodo(event) {
        event.preventDefault();

        onAddTodo(workingTodoTitle);

        setWorkingTodoTitle('');
    };
        const [workingTodoTitle, setWorkingTodoTitle] = useState('');
    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId="todoTitle"
                labelText="Todo"
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
/>
            <button type="submit" disabled={!workingTodoTitle.trim()}>
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;