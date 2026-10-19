"use client";
import { useState, useEffect } from "react";
import "../onboarding.css";
import "../../../globals.css";

type PaymentMethod = {
  payment_gateway_id: string;
  payment_gateway_name: string;
  payment_gateway_icon_path: string;
};

type Props = {
  onSelect: (id: string) => void;
};

export default function BetalingToggle({ onSelect }: Props) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:80/api-payment-gateways")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") setMethods(data.gateways ?? []);
        else setError("Kunne ikke hente betalingsmetoder.");
      })
      .catch(() => console.error("Netværksfejl. Prøv igen."));
  }, []);

  const handleSelect = (id: string) => {
    setPaymentMethod(id);
    onSelect(id);
  };

  return (
    <div className="Onboarding-4">
      {error && <p className="error">{error}</p>}
      {methods.map((method) => (
        <div
          key={method.payment_gateway_id}
          className={`button ${paymentMethod === method.payment_gateway_id ? "clicked" : ""}`}
          onClick={() => handleSelect(method.payment_gateway_id)}
        >
          <img
            src={`http://localhost:80/icons/${method.payment_gateway_icon_path}`}
            alt={method.payment_gateway_name}
            style={{ width: "40px", height: "40px", objectFit: "contain" }}
          />
          <input type="radio" name="paymentMethod" checked={paymentMethod === method.payment_gateway_id} readOnly />
          <h3>{method.payment_gateway_name}</h3>
        </div>
      ))}
    </div>
  );
}