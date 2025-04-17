import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import useDarkMode from "../hooks/useDarkMode";


export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
        window.location.reload();
    };

    const [darkMode, setDarkMode] = useDarkMode();

    return (
        <nav className="bg-slate-800 dark:bg-slate-900 text-white px-6 py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-6 items-center text-lg font-medium">
                    <Link to="/" className="hover:text-blue-400 transition">🏠 Inicio</Link>
                    <Link to="/add" className="hover:text-blue-400 transition">➕ Añadir</Link>
                    <Link to="/dashboard" className="hover:text-blue-400 transition">📊 Dashboard</Link>
                    <Link to="/historial" className="hover:text-blue-400 transition">
                        🧾 Historial
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* Botón modo oscuro */}
                    <div
                        onClick={() => setDarkMode(!darkMode)}
                        title={darkMode ? "Modo claro" : "Modo oscuro"}
                        className="relative w-14 h-8 flex items-center bg-gray-300 dark:bg-slate-600 rounded-full p-1 cursor-pointer transition-colors duration-500 shadow-md"
                    >
                        <div
                            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white text-slate-800 dark:text-yellow-300 flex items-center justify-center transition-all duration-500 transform ${darkMode ? "translate-x-6 rotate-[360deg]" : "rotate-[0deg]"
                                }`}
                        >
                            {darkMode ? <FaMoon size={14} /> : <FaSun size={14} />}
                        </div>
                    </div>

                    {/* Botón cerrar sesión */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md"
                    >
                        🚪 Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}
