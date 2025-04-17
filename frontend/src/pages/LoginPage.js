import React, { useState } from "react";
import { login } from "../api";
import { Link } from "react-router-dom";


export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login(username, password);
            onLogin();
        } catch (err) {
            alert("Login inválido");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-500 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-6 transition-colors duration-500"
            >
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">Iniciar sesión</h1>

                <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Usuario</label>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-slate-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-500"
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Contraseña</label>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-slate-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                    Entrar
                </button>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </form>
        </div>
    );
}
