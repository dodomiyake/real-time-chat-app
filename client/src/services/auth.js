const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://real-time-chat-app-k0cd.onrender.com";

export const register = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // This will send cookies along with the request
    });

    return response.json();
};


export const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });

    return response.json();
};

export const logout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });
};
