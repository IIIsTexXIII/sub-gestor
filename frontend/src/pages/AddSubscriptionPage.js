import React from "react";
import SubscriptionForm from "../components/SubscriptionForm";
import { useNavigate } from "react-router-dom";

export default function AddSubscriptionPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <SubscriptionForm onCreated={() => navigate("/")} />
    </div>
  );
}
