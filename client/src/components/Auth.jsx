import { useState } from "react";
import { login, register } from "../services/auth";
import "../styles/Auth.css";
import Navbar from "./Navbar";


export default function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = isLogin
            ? await login(username, password)
            : await register(username, password);

        if (data.user) {
            setUser(data.user);
        } else {
            setError(data.msg);
        }
    };

    return (
        <div>
            <Navbar /> {/* ✅ Add Navbar Here */}
            <div className="auth-container">
                <div className="auth-box">
                    <h2>{isLogin ? "Login" : "Register"}</h2>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">{isLogin ? "Login" : "Register"}</button>
                    </form>
                    <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </p>
                </div>
            </div>
        </div>
    );
}
