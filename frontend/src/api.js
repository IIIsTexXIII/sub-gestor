const API_URL = "http://localhost:8000/api";

export async function login(username, password) {
    const response = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
}

export async function getSubscriptions() {
    const token = localStorage.getItem("access");

    const response = await fetch(`${API_URL}/subscriptions/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("No autorizado");

    return await response.json();
}
