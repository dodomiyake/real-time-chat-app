import React from "react";
import { logout } from "../services/auth";
import logo from "../assets/chitchatlogo-01.svg"; // Ensure this path is correct
import "../styles/Navbar.css"; // Import styles

export default function Navbar({ user, setUser }) {
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
            {/* ✅ Ensure the logout button appears when user logs in */}
            {user && user.username ? (
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            ) : null}
        </nav>
    );
}
