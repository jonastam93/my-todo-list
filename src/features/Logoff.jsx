import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState("");

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError("");

    const result = await logout();

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }

  return (
    <button onClick={handleLogoff} disabled={isLoggingOff}>
      Log Out
    </button>
  );
}

export default Logoff;