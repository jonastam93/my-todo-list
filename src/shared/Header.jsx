import { useAuth } from "../contexts/AuthContext";
import Navigation from "./Navigation";
import Logoff from "../features/Logoff";

function Header() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header>
                <h1>Todo List</h1>

                <Navigation />
                
            {isAuthenticated && (
                <button onClick={logout}>
                    Log off
                </button>
            )}
        </header>
    );
}

export default Header;