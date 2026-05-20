import { useState } from "react";
import Header from "./shared/Header";
import TodosPage from "./features/Todos/TodosPage";
import Logon from "./features/Logon";

function App() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  return (
    <>
      <Header
        email={email}
        token={token}
        onSetToken={setToken}
        onSetEmail={setEmail}
      />

      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon
          onSetEmail={setEmail}
          onSetToken={setToken}
        />
      )}
    </>
  );
}

export default App;
