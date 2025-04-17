import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditSubscriptionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const token = localStorage.getItem("access");

    useEffect(() => {
        fetch(`http://localhost:8000/api/subscriptions/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setForm(data));
    }, [id, token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:8000/api/subscriptions/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            toast.success("Cambios guardados correctamente");
            navigate("/");
        } else {
            alert("Error al actualizar la suscripción");
        }
    };

    if (!form) return <p className="text-center text-gray-500 dark:text-gray-400">Cargando...</p>;

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 space-y-4 mt-6 transition-colors duration-500">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Editar suscripción</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="service_name" placeholder="Nombre del servicio" value={form.service_name} onChange={handleChange} required className="input-field" />
                <input name="price" type="number" step="0.01" placeholder="Precio (€)" value={form.price} onChange={handleChange} required className="input-field" />

                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    <option value="streaming">Streaming</option>
                    <option value="software">Software</option>
                    <option value="productivity">Productividad</option>
                    <option value="gaming">Videojuegos</option>
                    <option value="other">Otro</option>
                </select>

                <select name="billing_cycle" value={form.billing_cycle} onChange={handleChange} className="input-field">
                    <option value="monthly">Mensual</option>
                    <option value="yearly">Anual</option>
                    <option value="weekly">Semanal</option>
                    <option value="once">Pago único</option>
                </select>

                <select name="payment_method" value={form.payment_method} onChange={handleChange} className="input-field">
                    <option value="card">Tarjeta</option>
                    <option value="paypal">PayPal</option>
                </select>

                <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required className="input-field" />
                <input name="next_payment_date" type="date" value={form.next_payment_date} onChange={handleChange} required className="input-field" />
            </div>

            <textarea name="notes" placeholder="Notas (opcional)" value={form.notes || ""} onChange={handleChange} className="input-field resize-none" rows="3" />

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition">
                Guardar cambios
            </button>
        </form>
    );
}
