import TodoForm from "../features/Todos/TodoForm";
import TodoList from "../features/Todos/TodoList/TodoList";
import {  useReducer, useEffect, useCallback } from "react";
import SortBy from "../shared/SortBy";
import useDebounce from "../utils/useDebounce";
import FilterInput from "../shared/FilterInput";
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from "../reducers/todoReducer";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams } from "react-router";
import StatusFilter from "../shared/StatusFilter";
import styles from "./TodosPage.module.css";
import { sanitizeInput } from "../utils/sanitizeInput";
import { validateTodoTitle } from "../utils/validation";

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  // Get status filter from URL, default to 'all'
  const statusFilter = searchParams.get('status') || 'all';

  const {
    todoList,
    dataVersion,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
  } = state;
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: {
        filterTerm: newTerm,
      },
    });
  };

  useEffect(() => {
  async function fetchTodos() {
    dispatch({ type: TODO_ACTIONS.FETCH_START });

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

      if (!response.ok) {
        throw new Error(
          `Failed to fetch todos. Status: ${response.status}`
        );
      }

      const data = await response.json();

      dispatch({
        type: TODO_ACTIONS.FETCH_SUCCESS,
        payload: {
          todos: data.tasks ?? [],
        },
      });
    } catch (error) {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            error: "Unable to load todos. Please try again.",
            isFilterError: !!debouncedFilterTerm,
          }
        });
      }
    }

  if (token) {
    fetchTodos();
  }
}, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion]);

const invalidateCache = useCallback(() => {
  dispatch({
    type: TODO_ACTIONS.INVALIDATE_CACHE,
  });
}, []);

  async function addTodo(title) {
    const validationError = validateTodoTitle(title);

  if (validationError) {
    throw new Error(validationError);
  }

  const sanitizedTitle = sanitizeInput(title);
  dispatch({ type: TODO_ACTIONS.ADD_TODO_START });

  // temporary optimistic todo
  const newTodo = {
    id: Date.now(),
    title: sanitizedTitle,
    isCompleted: false,
  };

  // immediately update UI
  dispatch({
    type: TODO_ACTIONS.ADD_TODO_SUCCESS,
    payload: {
      todo: newTodo,
    },
  });

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
    dispatch({
      type: TODO_ACTIONS.REPLACE_TEMP_TODO,
      payload: {
        tempId: newTodo.id,
        newTodo: savedTodo,
      },
    });

    invalidateCache();

  } catch (error) {
    // rollback optimistic update
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_ERROR,
      payload: {
        tempId: newTodo.id,
        error: "Unable to add todo. Please try again.",
      },
    });
   }
  }


  async function completeTodo(id) {
  dispatch({
    type: TODO_ACTIONS.COMPLETE_TODO_START,
    payload: { id },
  });

  // store original todo for rollback
  const originalTodo = todoList.find((todo) => todo.id === id);

  // optimistic UI update
  dispatch({
    type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
    payload: { id },
  });

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

    invalidateCache();

  } catch (error) {
    // rollback to original todo
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
      payload: {
        error: "Unable to complete todo. Please try again.",
        todo: originalTodo,
      },
    });
  }
}

  async function deleteTodo(todoId) {
  if (!token) return;

  const originalTodo = state.todoList.find(
    (todo) => todo.id === todoId
  );

  // optimistic update (optional but consistent with your pattern)
  dispatch({
    type: TODO_ACTIONS.DELETE_TODO_START,
    payload: { id: todoId },
  });

  try {
    const response = await fetch(`/api/tasks/${todoId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": token,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    invalidateCache();
  } catch (error) {
    dispatch({
      type: TODO_ACTIONS.DELETE_TODO_ERROR,
      payload: {
        error: error.message,
        todo: originalTodo,
      },
    });
  }
}

  async function updateTodo(editedTodo) {
    const validationError = validateTodoTitle(
      editedTodo.title
    );

    if (validationError) {
      throw new Error(validationError);
    }

    const sanitizedTitle = sanitizeInput(
      editedTodo.title
    );

    const sanitizedTodo = {
      ...editedTodo,
      title: sanitizedTitle,
    };
  dispatch({
    type: TODO_ACTIONS.UPDATE_TODO_START,
    payload: {
      todo: sanitizedTodo,
    },
  });

  // store original todo for rollback
  const originalTodo = todoList.find(
    (todo) => todo.id === editedTodo.id
  );

  // optimistic UI update
  dispatch({
    type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
    payload: {
      todo: sanitizedTodo,
    },
  });

  try {
    const response = await fetch(`/api/tasks/${editedTodo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token,
      },
      credentials: "include",
      body: JSON.stringify({
        title: sanitizedTodo.title,
        isCompleted: sanitizedTodo.isCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo.");
    }

    invalidateCache();

  } catch (error) {
    // rollback original todo
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_ERROR,
      payload: {
        error: "Unable to update todo. Please try again.",
        todo: originalTodo,
      },
    });
  }
}
  return (
  <div className={styles.container}>
    <h2>Todos</h2>

    {error && (
      <div className={styles.error}>
        <p>{error}</p>

        <button
          onClick={() =>
            dispatch({
              type: TODO_ACTIONS.CLEAR_ERROR,
            })
          }
        >
          Clear Error
        </button>
      </div>
    )}

    {filterError && (
      <div className={styles.error}>
        <p>{filterError}</p>

        <button
          onClick={() =>
            dispatch({
              type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
            })
          }
        >
          Clear Filter Error
        </button>

        <button
          onClick={() => {
            dispatch({
              type: TODO_ACTIONS.RESET_FILTERS,
            });
          }}
        >
          Reset Filters
        </button>
      </div>
    )}

    {isTodoListLoading && (
      <div className={styles.loading}>Loading todos...</div>
    )}

    <SortBy
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortByChange={(newSortBy) =>
        dispatch({
          type: TODO_ACTIONS.SET_SORT,
          payload: {
            sortBy: newSortBy,
            sortDirection,
          },
        })
      }
      onSortDirectionChange={(newDirection) =>
        dispatch({
          type: TODO_ACTIONS.SET_SORT,
          payload: {
            sortBy,
            sortDirection: newDirection,
          },
        })
      }
    />

    <StatusFilter />

    <FilterInput
      filterTerm={filterTerm}
      onFilterChange={handleFilterChange}
    />

    <TodoForm onAddTodo={addTodo} />

    <TodoList
      todoList={todoList}
      onCompleteTodo={completeTodo}
      onUpdateTodo={updateTodo}
      onDeleteTodo={deleteTodo}
      dataVersion={dataVersion}
      statusFilter={statusFilter}
    />
  </div>
);
}

export default TodosPage;