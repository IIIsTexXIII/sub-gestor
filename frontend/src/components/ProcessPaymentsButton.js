import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProcessPaymentsButton() {
    const [isAdmin, setIsAdmin] = useState(false);
    const token = localStorage.getItem("access");

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("http://localhost:8000/api/me/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setIsAdmin(data.is_staff || data.is_superuser);
            }
        };
        fetchUser();
    }, [token]);

    const handleClick = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/process-payments/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 403) {
                toast.error("⛔ No tienes permisos para ejecutar esta acción (403)");
                return;
            }

            if (!res.ok) {
                toast.error("❌ Error inesperado al procesar pagos");
                return;
            }

            const data = await res.json();
            toast.success(`✅ ${data.procesadas} pagos procesados`);
        } catch (err) {
            toast.error("🚫 Error de red o del servidor");
        }
    };

    if (!isAdmin) return null;

    return (
        <button
            onClick={handleClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
        >
            💸 Procesar pagos
        </button>
    );
}
