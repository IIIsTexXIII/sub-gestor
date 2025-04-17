import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch("http://localhost:8000/api/subscriptions/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setSubscriptions);
  }, [token]);

  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();

  const pagosEsteMes = subscriptions
    .filter((sub) => sub.payments)
    .flatMap((sub) =>
      sub.payments.filter((p) => {
        const fecha = new Date(p.date);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
      })
    );

  const totalGastadoEsteMes = pagosEsteMes.reduce(
    (sum, p) => sum + parseFloat(p.amount),
    0
  );
  const serviciosPagadosEsteMes = new Set(
    pagosEsteMes.map((p) => p.service_name)
  );

  const total = subscriptions
    .filter((sub) => sub.is_active)
    .reduce((sum, sub) => {
      if (sub.billing_cycle === "monthly") return sum + parseFloat(sub.price);
      if (sub.billing_cycle === "yearly") return sum + parseFloat(sub.price) / 12;
      if (sub.billing_cycle === "weekly") return sum + parseFloat(sub.price) * 4.3;
      return sum;
    }, 0);

  const categorias = ["streaming", "software", "productivity", "gaming", "other"];
  const gastosPorCategoria = categorias.map((cat) =>
    subscriptions
      .filter((sub) => sub.is_active && sub.category === cat)
      .reduce((sum, sub) => {
        if (sub.billing_cycle === "monthly") return sum + parseFloat(sub.price);
        if (sub.billing_cycle === "yearly") return sum + parseFloat(sub.price) / 12;
        if (sub.billing_cycle === "weekly") return sum + parseFloat(sub.price) * 4.3;
        return sum;
      }, 0)
  );
  const cantidadPorCategoria = categorias.map(
    (cat) => subscriptions.filter((sub) => sub.category === cat).length
  );

  return (
    <div className="px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        📊 Dashboard
      </h2>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 text-sm text-slate-700 dark:text-slate-200">
        <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
          <p className="font-medium">💶 Gastado este mes</p>
          <p className="text-lg font-bold">
            {totalGastadoEsteMes.toFixed(2)} €
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
          <p className="font-medium">📄 Pagos este mes</p>
          <p className="text-lg font-bold">{pagosEsteMes.length}</p>
        </div>
        <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
          <p className="font-medium">🧾 Servicios cobrados</p>
          <p className="text-lg font-bold">{serviciosPagadosEsteMes.size}</p>
        </div>
        <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
          <p className="font-medium">💰 Total mensual estimado:</p>
          <p className="text-lg font-bold">{total.toFixed(2)} €</p>
        </div>
      </div>

      {/* Gráficos lado a lado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
          <h4 className="text-md font-semibold text-slate-700 dark:text-white mb-2">
            💸 Gasto por categoría
          </h4>
          <div className="relative h-[260px]">
            <Pie
              data={{
                labels: ["Streaming", "Software", "Productividad", "Videojuegos", "Otro"],
                datasets: [
                  {
                    data: gastosPorCategoria,
                    backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#c084fc"],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  datalabels: {
                    color: "#fff",
                    font: {
                      weight: "bold",
                    },
                    formatter: (value) => (value > 0 ? `${value.toFixed(0)} €` : ""),
                  },
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#94a3b8",
                    },
                  },
                },
              }}
              height={250}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
          <h4 className="text-md font-semibold text-slate-700 dark:text-white mb-2">
            📊 Suscripciones por categoría
          </h4>
          <div className="relative h-[260px]">
            <Bar
              data={{
                labels: ["Streaming", "Software", "Productividad", "Videojuegos", "Otro"],
                datasets: [
                  {
                    label: "Cantidad",
                    data: cantidadPorCategoria,
                    backgroundColor: "#60a5fa",
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    ticks: {
                      precision: 0,
                      stepSize: 1,
                    },
                    beginAtZero: true,
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "#94a3b8",
                    },
                  },
                },
              }}
              height={250}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
