import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import SubscriptionListPage from "./pages/SubscriptionListPage";
import AddSubscriptionPage from "./pages/AddSubscriptionPage";
import EditSubscriptionPage from "./pages/EditSubscriptionPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import SubscriptionDetailPage from "./pages/SubscriptionDetailPage";



function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/register" element={<RegisterPage onLogin={() => setLoggedIn(true)} />} />
        <Route path="/" element={!loggedIn ? <LoginPage onLogin={() => setLoggedIn(true)} /> : <Navigate to="/subscriptions" />} />

        {/* Rutas privadas */}
        {loggedIn && (
          <>
            <Route path="/add" element={<AddSubscriptionPage />} />
            <Route path="/edit/:id" element={<EditSubscriptionPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/subscriptions" element={<SubscriptionListPage />} />
            <Route path="/historial" element={<PaymentHistoryPage />} />
            <Route path="/subscriptions/:id" element={<SubscriptionDetailPage />} />
          </>
        )}

        {/* Catch all */}
        <Route path="*" element={<Navigate to={loggedIn ? "/dashboard" : "/"} />} />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={2000} theme="colored" />
    </Router>
  );
}


export default App;
