import './App.css'
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList';
import { useState } from "react";

function App() {
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
  return (
      <div>
        <h1>Todo List</h1>
        <TodoForm onAddTodo={addTodo} />
        <TodoList 
          todoList={todoList}
          onCompleteTodo={completeTodo} 
          />
      </div>
  );
}

export default App