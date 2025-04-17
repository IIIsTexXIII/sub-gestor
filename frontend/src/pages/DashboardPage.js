import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import ProcessPaymentsButton from "../components/ProcessPaymentsButton";

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [minimizado, setMinimizado] = useState(false);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch("http://localhost:8000/api/subscriptions/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setSubscriptions)
      .catch((err) => console.error("Error al cargar suscripciones", err));
  }, [token]);

  const hoy = new Date();
  const en7Dias = new Date();
  en7Dias.setDate(hoy.getDate() + 7);

  const suscripcionesVencenPronto = subscriptions.filter((sub) => {
    const fecha = new Date(sub.next_payment_date);
    return fecha >= hoy && fecha <= en7Dias && sub.is_active;
  });

  return (
    <div className="p-6">
      {suscripcionesVencenPronto.length > 0 && (
        <div className="relative bg-yellow-100 dark:bg-yellow-300/10 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg shadow mb-6 transition-all duration-300">
          {/* Botón minimizar/desplegar */}
          <button
            onClick={() => setMinimizado(!minimizado)}
            className="absolute top-2 right-2 text-sm text-yellow-800 dark:text-yellow-100 no-underline hover:opacity-80 transition-opacity duration-200"

          >
            {minimizado ? "🔽" : "➖ "}
          </button>

          {minimizado ? (
            <p className="font-medium">
              🔔 {suscripcionesVencenPronto.length} suscripción
              {suscripcionesVencenPronto.length > 1 && "es"} vencen pronto
            </p>
          ) : (
            <>
              <p className="font-semibold mb-2">
                🔔 {suscripcionesVencenPronto.length} suscripción
                {suscripcionesVencenPronto.length > 1 && "es"} vencen pronto:
              </p>
              <ul className="list-disc ml-5 text-sm">
                {suscripcionesVencenPronto.map((sub) => (
                  <li key={sub.id}>
                    <span className="font-medium">{sub.service_name}</span> –{" "}
                    {new Date(sub.next_payment_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <ProcessPaymentsButton />
      <Dashboard />
    </div>
  );
}
