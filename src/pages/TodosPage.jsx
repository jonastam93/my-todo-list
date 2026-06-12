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
import { useSearchParams } from "react-router-dom";
import StatusFilter from "../shared/StatusFilter";

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

      if (response.status === 401) {
        throw new Error("Failed to fetch todos.");
      }

      const data = await response.json();

      dispatch({
        type: TODO_ACTIONS.FETCH_SUCCESS,
        payload: { todos: data.tasks },
      });
    } catch (error) {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            error: `Error fetching todos: ${error.message}`,
            isFilterError: !!debouncedFilterTerm,
          },
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
  dispatch({ type: TODO_ACTIONS.ADD_TODO_START });

  // temporary optimistic todo
  const newTodo = {
    id: Date.now(),
    title,
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
        message: error.message,
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
        error: error.message,
        todo: originalTodo,
      },
    });
  }
}

  async function updateTodo(editedTodo) {
  dispatch({
    type: TODO_ACTIONS.UPDATE_TODO_START,
    payload: {
      todo: editedTodo,
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
      todo: editedTodo,
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
        title: editedTodo.title,
        isCompleted: editedTodo.isCompleted,
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
        error: error.message,
        todo: originalTodo,
      },
    });
  }
}

  return (
  <div>
    <h2>Todos</h2>

    {error && (
      <div>
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
      <div>
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
      <p>Loading todos...</p>
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
      dataVersion={dataVersion}
      statusFilter={statusFilter}
    />
  </div>
);
}

export default TodosPage;