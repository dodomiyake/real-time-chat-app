import React from "react";
import { logout } from "../services/auth";
import logo from "../assets/chitchatlogo-01.svg"; // Ensure this path is correct
import "../styles/Navbar.css"; // Import styles

export default function Navbar({ user, setUser, darkMode, toggleDarkMode }) {
    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Chat Logo" />
                <span className="logo-name">ChitChat</span>
            </div>
            <div className="navbar-actions">
                {/* ✅ Show Dark Mode toggle only if user is logged in */}
                {user && (
                    <button onClick={toggleDarkMode} className="dark-mode-toggle">
                        {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
                    </button>
                )}
                {user && <button className="logout-button" onClick={handleLogout}>Logout</button>}
            </div>
        </nav>
    );
}
