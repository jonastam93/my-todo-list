import { useAuth } from "./contexts/AuthContext";
import Header from "./shared/Header";
import TodosPage from "./features/Todos/TodosPage";
import Logon from "./features/Logon";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
     <Header />
      
      {isAuthenticated ? (
        <TodosPage />
      ) : (
        <Logon />
      )}
    </>
  );
}

export default App;
