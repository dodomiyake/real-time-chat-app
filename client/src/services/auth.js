export const register = async (username, password) => {
    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),   // Send the username and password in the body
        credentials: 'include' // This will send cookies along with the request
    });

    return response.json();
};


export const login = async (username, password) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', // Send a POST request
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // Send the username and password in the body
        credentials: 'include' // This will send cookies along with the request
    });

    return response.json();
};

export const logout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });
};