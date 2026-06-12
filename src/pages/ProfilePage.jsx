import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { name, token } = useAuth();

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const options = {
          method: "GET",
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        };

        const response = await fetch("/api/tasks", options);

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const todos = await response.json();

        const total = todos.length;
        const completed = todos.filter(
          (todo) => todo.isCompleted
        ).length;
        const active = total - completed;

        setTodoStats({
          total,
          completed,
          active,
        });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionPercentage =
    todoStats.total > 0
      ? Math.round(
          (todoStats.completed / todoStats.total) * 100
        )
      : 0;

  return (
    <div>
      <h1>Profile</h1>

      <section>
        <h2>Account Information</h2>
      
        <p>
          <strong>Name:</strong> {name}
        </p>

        <p>
          <strong>Status:</strong> Authenticated
        </p>
      </section>

      <section>
        <h2>Todo Stats</h2>

        {loading && <p>Loading statistics...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <p>Total Todos: {todoStats.total}</p>
            <p>Completed Todos: {todoStats.completed}</p>
            <p>Active Todos: {todoStats.active}</p>

            {todoStats.total > 0 && (
              <p>
                Completion Rate: {completionPercentage}%
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;