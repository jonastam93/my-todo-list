import { useAuth } from "../contexts/AuthContext";
import Navigation from "./Navigation";
import Logoff from "../features/Logoff";
import styles from "./Header.module.css";

function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Todo List</h1>

            <div className={styles.rightSection}>
                <Navigation />
                {isAuthenticated && <Logoff />}
            </div>
        </header>
    );
}

export default Header;