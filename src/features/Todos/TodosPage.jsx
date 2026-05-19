import TodoForm from './features/Todos/TodoForm';
import TodoList from './features/Todos/TodoList';
import { useState } from "react";

function TodosPage() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((previous) => [newTodo, ...previous]);
  }

  function completeTodo(id) {
    setTodoList((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: true }
          : todo
      )
    );
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      }
      return todo;
    });

    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;