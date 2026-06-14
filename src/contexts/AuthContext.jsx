import { createContext, useContext, useState } from "react";

// Create the context
const AuthContext = createContext();

// Custom hook with error checking
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Provider component
export function AuthProvider({ children }) {
    // State for authentication
    const [email, setEmail] = useState(
        localStorage.getItem("email") || ""
    );

    const [token, setToken] = useState(
        localStorage.getItem("token") || ""
    );


    const login = async (userEmail, password) => {
        try {
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, password }),
                credentials: "include",
            };

            const res = await fetch("/api/users/logon", options);
            const data = await res.json();

            if (res.status === 200 && data.name && data.csrfToken) {
                // Success: Update state
                setEmail(data.name);
                setToken(data.csrfToken);

                localStorage.setItem("email", data.name);
                localStorage.setItem("token", data.csrfToken);

                return { success: true };
            } else {
                // Failure: Return error
                return {
                    success: false,
                    error: `Authentication failed: ${data?.message}`,
                };
              }
        } catch (error) {
            return {
                success: false,
                error: "Network error during login",
            };
        }
    };

    const logout = async () => {
        try {
            // If not authenticated, just clear state
            if (!token) {
                setEmail("");
                setToken("");

                localStorage.removeItem("email");
                localStorage.removeItem("token");

                return { success: true };
            }

            const options = {
                method: "POST",
                headers: { "X-CSRF-TOKEN": token },
                credentials: "include",
            };

            await fetch("/api/users/logoff", options);

            // Always clear local auth state
            setEmail("");
            setToken("");

            localStorage.removeItem("email");
            localStorage.removeItem("token");

            return { success: true };
        } catch (error) {
            // Still clear local auth state on failure
            setEmail("");
            setToken("");

            localStorage.removeItem("email");
            localStorage.removeItem("token");

            return {
                success: false,
                error: "Error during logout",
            };
        }
    };
    // Context value object
    const value = {
        email,
        token,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}