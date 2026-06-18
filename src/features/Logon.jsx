import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { sanitizeInput } from "../utils/sanitizeInput";
import buttonStyles from "../../shared/styles/buttons.module.css";

function Logon() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    async function handleSubmit(event) {
    event.preventDefault();

    setAuthError("");

    // Validate first
    if (!email.trim()) {
        setAuthError("Email is required");
        return;
    }

    if (!password.trim()) {
        setAuthError("Password is required");
        return;
    }

    if (password.length > 128) {
        setAuthError("Password is too long");
        return;
    }

    setIsLoggingOn(true);

    try {
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);

        const result = await login(
            sanitizeInput(email),
            sanitizeInput(password)
        );

        if (!result.success) {
            setAuthError("Invalid email or password.");
        }

    } catch (error) {
        console.error(error);
        setAuthError("Login failed. Please try again.");
    } finally {
        setIsLoggingOn(false);
    }
}

    return (
        <form onSubmit={handleSubmit}>
            <h2>Log On</h2>

    {authError && <p>{authError}</p>}

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    maxLength={254}
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    maxLength={128}
                />
            </div>

            <button 
                type="submit" 
                className={`${buttonStyles.base} ${buttonStyles.primary}`}
                disabled={isLoggingOn}
            >
                {isLoggingOn ? "Logging On..." : "Log On"}
            </button>
        </form>
    );
}

export default Logon;