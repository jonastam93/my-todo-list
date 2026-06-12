function AboutPage() {
  return (
    <div>
      <h1>About This App</h1>

      <section>
        <h2>Features</h2>
        <ul>
          <li>Create, edit, and delete todos</li>
          <li>Mark todos as complete</li>
          <li>Filter and sort tasks</li>
          <li>Authentication-based access</li>
        </ul>
      </section>

      <section>
        <h2>Technology Used</h2>
        <ul>
          <li>React</li>
          <li>React Router</li>
          <li>Vite</li>
          <li>Context API / useReducer</li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;