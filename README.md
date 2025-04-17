# Sub-Gestor 💸

**Sub-Gestor** es una plataforma personal para gestionar tus suscripciones mensuales, visualizar estadísticas y mantener un historial automático de tus pagos. Creado con Django + React + Tailwind.

---

## ✅ Funcionalidades principales

- 🔐 Autenticación con login y registro
- 🌗 Modo oscuro / claro con botón persistente
- 📥 Añadir, editar, eliminar y suspender suscripciones
- 🧾 Historial de pagos automático
- 📊 Dashboard con gráficos interactivos
- 🔎 Filtros por categoría, estado, nombre
- 🛠️ Panel de administración personalizado
- 🔁 Script para generar pagos automáticos cada ciclo
- 🔔 Notificaciones de pagos próximos
- 🌍 Soporte para internacionalización
- 📦 Estilos modernos con TailwindCSS

---

## 🧹 Mantenimiento de pagos

- Puedes ejecutar el script manual desde el botón **"Procesar pagos"**
- Desde el panel admin, accede a `Payment Logs`
  - Filtra por fecha o servicio
  - Elimina pagos erróneos con la acción "Eliminar pagos seleccionados"
- El sistema asegura que se genere **solo un pago por ciclo**

---

## 🚀 Guía para producción

### Requisitos:

- Python 3.10+
- PostgreSQL
- Node.js + npm
- `python-dateutil` instalado (`pip install python-dateutil`)

### Pasos recomendados:

1. Crea el entorno virtual:

   ```bash
   python -m venv venv
   source venv/bin/activate  # o .\venv\Scripts\activate en Windows
   ```

2. Instala dependencias:

   ```bash
   pip install -r requirements.txt
   cd frontend
   npm install
   npm run build
   ```

3. Configura `.env` para el entorno:

   - Claves secretas
   - DB PostgreSQL
   - DEBUG=False

4. Migra la base de datos:

   ```bash
   python manage.py migrate
   ```

5. Crea un superusuario:

   ```bash
   python manage.py createsuperuser
   ```

6. Ejecuta el servidor:

   ```bash
   python manage.py runserver
   ```

---

## 🔐 Seguridad recomendada

- Renombra la URL del panel admin (`/admin/` → `/panel/seguro/`)
- Activa CORS solo para tu dominio de frontend
- Usa HTTPS en producción
- Aplica respaldo automático de la DB

---

## 📌 Autor

Este proyecto fue generado como una solución profesional personalizada en conjunto con asistencia inteligente y visión de producto 💡

---