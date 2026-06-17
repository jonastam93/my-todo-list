import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Navigation.module.css";

function Navigation() {
  const { isAuthenticated } = useAuth();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? `${styles.link} ${styles.active}`
      : styles.link;

  return (
    <nav>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" className={navLinkClass}>
                Todos
              </NavLink>
            </li>

            <li>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;