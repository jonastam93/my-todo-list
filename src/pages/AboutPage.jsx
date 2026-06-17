import styles from "./AboutPage.module.css";

function AboutPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>About This App</h1>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Features</h2>

        <ul className={styles.list}>
          <li className={styles.listItem}>
            Create, edit, and delete todos
          </li>
          <li className={styles.listItem}>
            Mark todos as complete
          </li>
          <li className={styles.listItem}>
            Filter and sort tasks
          </li>
          <li className={styles.listItem}>
            Authentication-based access
          </li>
        </ul>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Technology Used</h2>

        <div className={styles.techGrid}>
          <div className={styles.techBox}>React</div>
          <div className={styles.techBox}>React Router</div>
          <div className={styles.techBox}>Vite</div>
          <div className={styles.techBox}>
            Context API / useReducer
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;