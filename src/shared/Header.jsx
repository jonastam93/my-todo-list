import { useAuth } from "../contexts/AuthContext";

function Header() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header>
                <h1>Todo List</h1>
            {isAuthenticated && (
                <button onClick={logout}>
                    Log off
                </button>
            )}
        </header>
    );
}

export default Header;