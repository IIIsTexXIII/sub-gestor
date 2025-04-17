import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SubscriptionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sub, setSub] = useState(null);
    const token = localStorage.getItem("access");

    useEffect(() => {
        fetch(`http://localhost:8000/api/subscriptions/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(setSub)
            .catch(() => toast.error("Error al cargar suscripción"));
    }, [id, token]);

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de eliminar esta suscripción?")) return;

        const res = await fetch(`http://localhost:8000/api/subscriptions/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            toast.success("Suscripción eliminada");
            navigate("/");
        } else {
            toast.error("Error al eliminar");
        }
    };

    const toggleActive = async () => {
        const res = await fetch(`http://localhost:8000/api/subscriptions/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ is_active: !sub.is_active }),
        });

        if (res.ok) {
            const updated = { ...sub, is_active: !sub.is_active };
            setSub(updated);
            toast.success(
                updated.is_active ? "Suscripción reactivada" : "Suscripción suspendida"
            );
        } else {
            toast.error("Error al actualizar el estado");
        }
    };

    if (!sub)
        return (
            <p className="text-center text-gray-500 dark:text-gray-400">Cargando...</p>
        );

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Detalles de {sub.service_name}
            </h2>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Precio:</strong> {sub.price} €
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Categoría:</strong> {sub.category}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Ciclo de facturación:</strong> {sub.billing_cycle}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Método de pago:</strong> {sub.payment_method === "card" ? "Tarjeta" : "PayPal"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Inicio:</strong> {sub.start_date}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Próximo pago:</strong> {sub.next_payment_date}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Estado:</strong>{" "}
                    <span className={`font-semibold ${sub.is_active ? "text-green-600" : "text-yellow-500"}`}>
                        {sub.is_active ? "Activa" : "Suspendida"}
                    </span>
                </p>
                {sub.notes && (
                    <p className="text-gray-700 dark:text-gray-300 mt-4">
                        <strong>Notas:</strong> {sub.notes}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => navigate(`/edit/${sub.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                >
                    ✏️ Editar
                </button>

                <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition"
                >
                    🗑️ Eliminar
                </button>

                <button
                    onClick={toggleActive}
                    className="bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium py-2 px-4 rounded-md transition"
                >
                    {sub.is_active ? "⏸️ Suspender" : "▶️ Reactivar"}
                </button>
            </div>
        </div>
    );
}
