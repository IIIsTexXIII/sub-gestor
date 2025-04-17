import React, { useState } from "react";
import { toast } from "react-toastify";


export default function SubscriptionForm({ onCreated }) {
    const [form, setForm] = useState({
        service_name: "",
        price: "",
        category: "streaming",
        billing_cycle: "monthly",
        payment_method: "card",
        start_date: "",
        next_payment_date: "", // se calcula
        is_active: true,
        notes: "",
    });

    const token = localStorage.getItem("access");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => {
            const updatedForm = { ...prev, [name]: value };

            if (
                (name === "start_date" && value && prev.billing_cycle) ||
                (name === "billing_cycle" && prev.start_date)
            ) {
                updatedForm.next_payment_date = calcularSiguientePago(
                    name === "start_date" ? value : prev.start_date,
                    name === "billing_cycle" ? value : prev.billing_cycle
                );
            }

            return updatedForm;
        });
    };

    const calcularSiguientePago = (startDate, cycle) => {
        const fecha = new Date(startDate);
        if (isNaN(fecha)) return "";

        switch (cycle) {
            case "monthly":
                fecha.setMonth(fecha.getMonth() + 1);
                break;
            case "weekly":
                fecha.setDate(fecha.getDate() + 7);
                break;
            case "yearly":
                fecha.setFullYear(fecha.getFullYear() + 1);
                break;
            case "once":
                return startDate; // mismo día
            default:
                return "";
        }

        return fecha.toISOString().split("T")[0]; // formato YYYY-MM-DD
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/api/subscriptions/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            const newSub = await response.json();
            onCreated(newSub);
            setForm({
                service_name: "",
                price: "",
                currency: "EUR",
                category: "streaming",
                billing_cycle: "monthly",
                payment_method: "card",
                start_date: "",
                next_payment_date: "",
                notes: "",
            });
            toast.success("Suscripción guardada con éxito");
        } else {
            alert("Error al guardar la suscripción");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 space-y-4 transition-colors duration-500">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Nueva suscripción</h2>

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
            </div>

            <textarea name="notes" placeholder="Notas (opcional)" value={form.notes} onChange={handleChange} className="input-field resize-none" rows="3" />

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition">
                Guardar suscripción
            </button>
        </form>
    );
}
