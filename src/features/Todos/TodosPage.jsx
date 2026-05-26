import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';
import { useState, useEffect } from "react";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError("");

      try {
        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("Failed to fetch todos.");
        }

        const data = await response.json();

        setTodoList(data.tasks);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token]);

  async function addTodo(title) {
  setError("");

  // temporary optimistic todo
  const newTodo = {
    id: Date.now(),
    title,
    isCompleted: false,
  };

  // immediately update UI
  setTodoList((prevTodoList) => [...prevTodoList, newTodo]);

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token,
      },
      credentials: "include",
      body: JSON.stringify({
        title: newTodo.title,
        isCompleted: newTodo.isCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add todo.");
    }

    const savedTodo = await response.json();

    // replace temporary todo with server todo
    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) =>
        todo.id === newTodo.id ? savedTodo : todo
      )
    );

  } catch (error) {
    // rollback optimistic update
    setTodoList((prevTodoList) =>
      prevTodoList.filter((todo) => todo.id !== newTodo.id)
    );

    setError(error.message);
  }
}

  async function completeTodo(id) {
  setError("");

  // store original todo for rollback
  const originalTodo = todoList.find((todo) => todo.id === id);

  // optimistic UI update
  setTodoList((prevTodoList) =>
    prevTodoList.map((todo) =>
      todo.id === id
        ? { ...todo, isCompleted: true }
        : todo
    )
  );

  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token,
      },
      credentials: "include",
      body: JSON.stringify({
        isCompleted: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to complete todo.");
    }

  } catch (error) {
    // rollback to original todo
    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) =>
        todo.id === id ? originalTodo : todo
      )
    );

    setError(error.message);
  }
}

  async function updateTodo(editedTodo) {
  setError("");

  // store original todo for rollback
  const originalTodo = todoList.find(
    (todo) => todo.id === editedTodo.id
  );

  // optimistic UI update
  setTodoList((prevTodoList) =>
    prevTodoList.map((todo) =>
      todo.id === editedTodo.id
        ? editedTodo
        : todo
    )
  );

  try {
    const response = await fetch(`/api/tasks/${editedTodo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token,
      },
      credentials: "include",
      body: JSON.stringify({
        title: editedTodo.title,
        isCompleted: editedTodo.isCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo.");
    }

  } catch (error) {
    // rollback original todo
    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) =>
        todo.id === editedTodo.id
          ? originalTodo
          : todo
      )
    );

    setError(error.message);
  }
}

  return (
  <div>
    <h2>Todos</h2>

    {error && (
      <div>
        <p>{error}</p>

        <button onClick={() => setError("")}>
          Clear Error
        </button>
      </div>
    )}

    {isTodoListLoading && (
      <p>Loading todos...</p>
    )}

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