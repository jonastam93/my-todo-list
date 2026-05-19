import { useState } from "react";

function Logon({ onSetEmail, onSetToken}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoggingOn(true);
        setAuthError("");
    
    try {
        const response = await fetch("/api/users/logon", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to log in.");
        }

        // successful login
        onSetEmail(result.name);
        onSetToken(result.csrfToken);
     
     } catch (error) {
        setAuthError(error.message || "Login failed.");
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
                />
            </div>

            <button type="submit" disabled={isLoggingOn}>
                {isLoggingOn ? "Logging On..." : "Log On"}
            </button>
        </form>
    );
}

export default Logon;