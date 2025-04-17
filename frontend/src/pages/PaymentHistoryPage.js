import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PaymentHistoryPage() {
    const [pagos, setPagos] = useState([]);
    const [filtros, setFiltros] = useState({
        nombre: "",
        mes: "todos",
        año: "todos",
    });

    const token = localStorage.getItem("access");

    useEffect(() => {
        fetch("http://localhost:8000/api/payment-history/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener historial");
                return res.json();
            })
            .then(setPagos)
            .catch(() => toast.error("Error al cargar historial de pagos"));
    }, [token]);

    // Obtener años disponibles desde los datos
    const añosDisponibles = Array.from(
        new Set(pagos.map((p) => new Date(p.date).getFullYear()))
    ).sort((a, b) => b - a);

    const meses = [
        "todos",
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ];

    const pagosFiltrados = pagos
        .filter((p) =>
            p.service_name.toLowerCase().includes(filtros.nombre.toLowerCase())
        )
        .filter((p) => {
            if (filtros.mes === "todos") return true;
            const mes = new Date(p.date).getMonth() + 1;
            return mes === meses.indexOf(filtros.mes);
        })
        .filter((p) => {
            if (filtros.año === "todos") return true;
            return new Date(p.date).getFullYear().toString() === filtros.año;
        });

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();

    const pagosEsteMes = pagos.filter((p) => {
        const fecha = new Date(p.date);
        const mesPago = fecha.getUTCMonth();
        const añoPago = fecha.getUTCFullYear();

        return mesPago === mesActual && añoPago === añoActual;
    });
    pagosEsteMes.forEach(p => {
        console.log(p.service_name, new Date(p.date).toISOString());
    });
    const totalGastado = pagosEsteMes.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const serviciosPagados = new Set(pagosEsteMes.map((p) => p.service_name));

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                🧾 Historial de pagos
            </h2>


            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-700 dark:text-slate-200">
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                    <p className="font-medium">💶 Total gastado</p>
                    <p className="text-lg font-bold">{totalGastado.toFixed(2)} €</p>
                </div>
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                    <p className="font-medium">📄 Pagos registrados</p>
                    <p className="text-lg font-bold">{pagosEsteMes.length}</p>
                </div>
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                    <p className="font-medium">🧾 Servicios pagados</p>
                    <p className="text-lg font-bold">{serviciosPagados.size}</p>
                </div>
            </div>


            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar servicio"
                    value={filtros.nombre}
                    onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                    className="input-field w-full md:w-1/3"
                />

                <select
                    value={filtros.mes}
                    onChange={(e) => setFiltros({ ...filtros, mes: e.target.value })}
                    className="input-field w-full md:w-1/3"
                >
                    {meses.map((m) => (
                        <option key={m} value={m}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                        </option>
                    ))}
                </select>

                <select
                    value={filtros.año}
                    onChange={(e) => setFiltros({ ...filtros, año: e.target.value })}
                    className="input-field w-full md:w-1/3"
                >
                    <option value="todos">Todos los años</option>
                    {añosDisponibles.map((año) => (
                        <option key={año} value={año}>
                            {año}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla */}
            {pagosFiltrados.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No hay pagos que coincidan con los filtros.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow">
                        <thead className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left">Servicio</th>
                                <th className="px-4 py-3 text-left">Monto</th>
                                <th className="px-4 py-3 text-left">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagosFiltrados.map((pago) => (
                                <tr
                                    key={pago.id}
                                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                                >
                                    <td className="px-4 py-2">{pago.service_name}</td>
                                    <td className="px-4 py-2">{pago.amount} €</td>
                                    <td className="px-4 py-2">
                                        {new Date(pago.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
