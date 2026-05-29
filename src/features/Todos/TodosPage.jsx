import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';
import { useState, useEffect, useMemo, useCallback } from "react";
import SortBy from "../../shared/SortBy";
import useDebounce from "../../utils/useDebounce";
import FilterInput from "../../shared/FilterInput";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [dataVersion, setDataVersion] = useState(0);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  }

  useEffect(() => {
  async function fetchTodos() {
    setIsTodoListLoading(true);
    setError("");

    const paramsObject = {
      sortBy,
      sortDirection,
    };

    if (debouncedFilterTerm) {
      paramsObject.find = debouncedFilterTerm;
    }

    const params = new URLSearchParams(paramsObject);

    try {
      const response = await fetch(`/api/tasks?${params}`, {
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
      setFilterError("");
    } catch (error) {
      if (
        debouncedFilterTerm ||
        sortBy !== "creationDate" ||
        sortDirection !== "desc"
      ) {
        setFilterError(`Error filtering/sorting todos: ${error.message}`);
      } else {
        setError(`Error fetching todos: ${error.message}`);
      }
    } finally {
      setIsTodoListLoading(false);
    }
  }

  if (token) {
    fetchTodos();
  }
}, [token, sortBy, sortDirection, debouncedFilterTerm]);

const invalidateCache = useCallback(() => {
  console.log("Invalidating memo cache after todo mutation");

  setDataVersion((prev) => prev + 1);
}, []);

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
    setTodoList((previous) =>
      previous.map((todo) => (todo.id === tempId ? savedTodo : todo))
    );

    invalidateCache();

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
  setTodoList((previous) =>
    previous.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    )
  );

  invalidateCache();

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
  setTodoList((previous) =>
    previous.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    )
  );

  invalidateCache();

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

    {filterError && (
      <div>
        <p>{filterError}</p>

        <button onClick={() => setFilterError("")}>
          Clear Filter Error
        </button>

        <button
          onClick={() => {
            setFilterTerm("");
            setSortBy("creationDate");
            setSortDirection("desc");
            setFilterError("");
          }}
        >
          Reset Filters
        </button>
      </div>
    )}

    {isTodoListLoading && (
      <p>Loading todos...</p>
    )}

    <SortBy
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortByChange={setSortBy}
      onSortDirectionChange={setSortDirection}
    />

    <FilterInput
      filterTerm={filterTerm}
      onFilterChange={handleFilterChange}
    />

    <TodoForm onAddTodo={addTodo} />

    <TodoList
      todoList={todoList}
      onCompleteTodo={completeTodo}
      onUpdateTodo={updateTodo}
      dataVersion={dataVersion}
    />
  </div>
);
}

export default TodosPage;