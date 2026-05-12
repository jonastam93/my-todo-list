import { useState } from "react";

function TodoForm({ onAddTodo }) {

function handleAddTodo(event) {
        event.preventDefault();

        onAddTodo(workingTodoTitle);

        setWorkingTodoTitle('');
    };
        const [workingTodoTitle, setWorkingTodoTitle] = useState('');
    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input
                type="text"
                id="todoTitle"
                name="todoTitle"
                placeholder={'Todo text'}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                required
            />
            <button type="submit" disabled={!workingTodoTitle.trim()}>
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;