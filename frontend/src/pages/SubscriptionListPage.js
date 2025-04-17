import React, { useState } from "react";
import SubscriptionList from "../components/SubscriptionList";

export default function SubscriptionListPage() {
  const [filtros, setFiltros] = useState({
    nombre: "",
    categoria: "todas",
    estado: "todas",
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        🏠 Inicio
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtros.nombre}
          onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          className="input-field w-full md:w-1/3"
        />

        <select
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
          className="input-field w-full md:w-1/3"
        >
          <option value="todas">Todas las categorías</option>
          <option value="streaming">Streaming</option>
          <option value="software">Software</option>
          <option value="productivity">Productividad</option>
          <option value="gaming">Videojuegos</option>
          <option value="other">Otro</option>
        </select>

        <select
          value={filtros.estado}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          className="input-field w-full md:w-1/3"
        >
          <option value="todas">Todos los estados</option>
          <option value="activas">Activas</option>
          <option value="suspendidas">Suspendidas</option>
        </select>

        <button
          onClick={() =>
            setFiltros({ nombre: "", categoria: "todas", estado: "todas" })
          }
          className="w-fit self-start bg-gray-200 dark:bg-slate-700 dark:text-white text-sm px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition"
        >
          Limpiar filtros
        </button>
      </div>

      <SubscriptionList filtros={filtros} />
    </div>
  );
}
