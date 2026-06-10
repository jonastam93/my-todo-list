import { Route, Routes } from "react-router-dom";
import Header from "./shared/Header";
import TodosPage from "./features/Todos/TodosPage";
import Logon from "./features/Logon";

function App() {
  return (
    <>
     <Header />
      
      <Routes>
        <Route path="/" element={<TodosPage />} />
        <Route path="/logon" element={<Logon />} />
      </Routes>
    </>
  );
}

export default App;
