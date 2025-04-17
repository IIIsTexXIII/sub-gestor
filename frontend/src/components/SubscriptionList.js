import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SubscriptionList({ filtros }) {
    const [subs, setSubs] = useState([]);
    const token = localStorage.getItem("access");

    useEffect(() => {
        fetch("http://localhost:8000/api/subscriptions/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then(setSubs)
            .catch((err) => console.error(err));
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta suscripción?")) return;

        const res = await fetch(`http://localhost:8000/api/subscriptions/${id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            setSubs(subs.filter((sub) => sub.id !== id));
            toast.info("Suscripción eliminada");
        }
    };

    const toggleActive = async (sub) => {
        const res = await fetch(`http://localhost:8000/api/subscriptions/${sub.id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ is_active: !sub.is_active }),
        });

        if (res.ok) {
            setSubs(subs.map((s) => (s.id === sub.id ? { ...s, is_active: !s.is_active } : s)));
            toast.success(sub.is_active ? "Suscripción suspendida" : "Suscripción reactivada");
        }
    };

    // ✅ Aplicar filtros
    const subsFiltradas = subs
        .filter((sub) =>
            sub.service_name.toLowerCase().includes(filtros.nombre.toLowerCase())
        )
        .filter((sub) =>
            filtros.categoria === "todas" ? true : sub.category === filtros.categoria
        )
        .filter((sub) => {
            if (filtros.estado === "todas") return true;
            if (filtros.estado === "activas") return sub.is_active;
            if (filtros.estado === "suspendidas") return !sub.is_active;
            return true;
        });

    if (subsFiltradas.length === 0) {
        return (
            <p className="text-center text-gray-500 dark:text-gray-400">
                No hay suscripciones que coincidan.
            </p>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
            {subsFiltradas.map((sub) => (
                <div
                    key={sub.id}
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow hover:shadow-lg transition-colors duration-500"
                >
                    <Link to={`/subscriptions/${sub.id}`}>
                        <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white hover:underline">
                            {sub.service_name}
                        </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {sub.price} € / {sub.billing_cycle === "monthly" ? "mes" : sub.billing_cycle}
                    </p>

                    <p
                        className={`inline-block px-3 py-1 text-xs rounded-full mb-3 ${sub.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {sub.is_active ? "Activa" : "Suspendida"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <Link to={`/edit/${sub.id}`}>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded-md transition">
                                ✏️ Editar
                            </button>
                        </Link>
                        <button
                            onClick={() => handleDelete(sub.id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-md transition"
                        >
                            🗑️ Eliminar
                        </button>
                        <button
                            onClick={() => toggleActive(sub)}
                            className="bg-gray-300 hover:bg-gray-400 text-slate-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-sm font-medium py-1 px-3 rounded-md transition"
                        >
                            {sub.is_active ? "⏸️ Suspender" : "▶️ Reactivar"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
