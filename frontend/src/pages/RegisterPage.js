import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const registerResponse = await fetch("http://localhost:8000/api/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!registerResponse.ok) {
            const data = await registerResponse.json();
            toast.error(data.error || "Error al registrar usuario");
            return;
        }

        // Autenticación automática después del registro
        const loginResponse = await fetch("http://localhost:8000/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (loginResponse.ok) {
            const data = await loginResponse.json();
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            toast.success("🎉 Registro exitoso. ¡Bienvenido!");
            onLogin();
            navigate("/");
        } else {
            toast.error("Error al iniciar sesión tras el registro");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-500 px-4">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-6 transition-colors duration-500"
            >
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">Crear cuenta</h1>

                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input-field"
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}
