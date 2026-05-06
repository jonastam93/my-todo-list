import { useRef } from "react";
import { useState } from "react";

function TodoForm({ onAddTodo }) {
    const inputRef = useRef();

function handleAddTodo(event) {
        event.preventDefault();

        onAddTodo(workingTodoTitle);

        setworkingTodoTitle('');
    };
        const [workingTodoTitle, setworkingTodoTitle] = useState('');
    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input
                ref={inputRef}
                type="text"
                id="todoTitle"
                name="todoTitle"
                placeholder={'Todo text'}
                value={workingTodoTitle}
                onChange={(event) => setworkingTodoTitle(event.target.value)}
                required
            />
            <button type="submit" disabled={!workingTodoTitle.trim()}>
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;