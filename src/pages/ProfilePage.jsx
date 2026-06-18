import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from "./ProfilePage.module.css";

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

        const data = await response.json();
        const todos = data.tasks ?? [];

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
    <div className={styles.page}>
      <h1 className={styles.title}>Profile</h1>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Account Information</h2>
      
        <p>
          <strong>Name:</strong> {name}
        </p>

        <p>
          <strong>Status:</strong> Authenticated
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Todo Statistics</h2>

        {loading && (
          <p className={styles.loading}>
            Loading statistics...
          </p>
        )}

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        {!loading && !error && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>
                Total Todos
              </span>
              <div className={styles.statValue}>
                {todoStats.total}
              </div>
            </div>

            <div className={styles.statBox}>
              <span className={styles.statLabel}>
                Completed
              </span>
              <div className={styles.statValue}>
                {todoStats.completed}
              </div>
            </div>

            <div className={styles.statBox}>
              <span className={styles.statLabel}>
                Active
              </span>
              <div className={styles.statValue}>
                {todoStats.active}
              </div>
            </div>
          </div>

          {todoStats.total > 0 && (
            <p className={styles.completionRate}>
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