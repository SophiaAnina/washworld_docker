"use client";
import {
  LuCar,
  LuCreditCard,
  LuLock,
  LuMail,
  LuMapPin,
  LuPhone,
} from "react-icons/lu";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import BackButton from "../../../components/layout/BackButton";
import SinglePassword from "../../onboarding/components/singlePassword";
interface ProfileDetailsFormProps {
  detailsForm: {
    phone: string;
    email: string;
    password: string;
    paymentMethod: string;
    address: string;
    plateNumber: string;
  };
  onChange: (field: keyof ProfileDetailsFormProps["detailsForm"], value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  saveMessage: string | null;
  
}

type PaymentMethod = {
  payment_gateway_id: string;
  payment_gateway_name: string;
  payment_gateway_icon_path: string;
};

export default function ProfileDetailsForm({
  detailsForm,
  onChange,
  onSubmit,
  onBack,
  saveMessage,
}: ProfileDetailsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopUp] = React.useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    fetch("http://localhost:80/api-payment-gateways")
      .then((res) => res.json())
      .then((data) => {
        console.log("response:", data);
        if (data.status === "ok") setMethods(data.gateways ?? []);
        else setError("Kunne ikke hente betalingsmetoder.");
      })
      .catch(() => setError("Netværksfejl. Prøv igen."));
  }, []);

  return (
    <section className="profileDetails" aria-label="Mine oplysninger formular">
      <BackButton />
      <form
        className="detailsForm"
        onSubmit={(e) => {
          onSubmit(e);
          setIsEditing(false);
        }}
      >
        <h1 style={{ fontSize: "var(--display-h1-size)", lineHeight: "var(--display-h1-line)", fontWeight: 800, marginBottom: "10px", textAlign: "center" }}>
          Mine oplysninger
        </h1>

        <label className="detailsField" htmlFor="details-phone">
          <span className="detailsFieldLabelWrap">
            <LuPhone className="detailsFieldIcon" aria-hidden="true" />
            <span className="detailsFieldLabel">Telefonnummer</span>
          </span>
          <div className="detailsFieldValueRow">
            <input
              id="details-phone"
              type="tel"
              className="detailsFieldInput"
              value={detailsForm.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              readOnly={!isEditing}
            />
          </div>
        </label>

        <label className="detailsField" htmlFor="details-email">
          <span className="detailsFieldLabelWrap">
            <LuMail className="detailsFieldIcon" aria-hidden="true" />
            <span className="detailsFieldLabel">E-mail</span>
          </span>
          <div className="detailsFieldValueRow">
            <input
              id="details-email"
              type="email"
              className="detailsFieldInput"
              value={detailsForm.email}
              onChange={(e) => onChange("email", e.target.value)}
              readOnly={!isEditing}
            />
          </div>
        </label>

<label className="detailsField" htmlFor="details-payment">
  <span className="detailsFieldLabelWrap">
    <LuCreditCard className="detailsFieldIcon" aria-hidden="true" />
    <span className="detailsFieldLabel">Betalingsmetode</span>
  </span>
  <div className="detailsFieldValueRow">
    {!isEditing ? (
      // Read-only — show selected payment method
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {(() => {
          const selected = methods.find((m) => m.payment_gateway_id === detailsForm.paymentMethod);
          if (selected) {
            return (
              <>
                <img
                  src={`http://localhost:80/icons/${selected.payment_gateway_icon_path}`}
                  alt={selected.payment_gateway_name}
                  style={{ width: "28px", height: "28px", objectFit: "contain" }}
                />
                <span style={{ color: "#d8f8e8", fontSize: "14px", fontWeight: 500 }}>
                  {selected.payment_gateway_name}
                </span>
              </>
            );
          }
          return <span style={{ color: "#d8f8e8", fontSize: "14px" }}>Vælg betalingsmetode</span>;
        })()}
      </div>
    ) : (
      // Edit mode — show both options side by side
      <div style={{ display: "flex", gap: "10px", width: "100%" }}>
        {methods.map((method) => (
          <button
            key={method.payment_gateway_id}
            type="button"
            onClick={() => onChange("paymentMethod", method.payment_gateway_id)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 12px",
              border: detailsForm.paymentMethod === method.payment_gateway_id
                ? "1px solid #00d881"
                : "1px solid rgba(0, 216, 129, 0.3)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <span style={{
              background: detailsForm.paymentMethod === method.payment_gateway_id ? "#00d881" : "transparent",
              flexShrink: 0,
            }} />
            <img
              src={`http://localhost:80/icons/${method.payment_gateway_icon_path}`}
              alt={method.payment_gateway_name}
              style={{ width: "20px", height: "20px", objectFit: "contain" }}
            />
            <span style={{ fontSize: "14px", fontWeight: 700 }}>{method.payment_gateway_name}</span>
          </button>
        ))}
      </div>
    )}
  </div>
</label>

        <label className="detailsField" htmlFor="details-address">
          <span className="detailsFieldLabelWrap">
            <LuMapPin className="detailsFieldIcon" aria-hidden="true" />
            <span className="detailsFieldLabel">Adresse</span>
          </span>
          <div className="detailsFieldValueRow">
            <input
              id="details-address"
              type="text"
              className="detailsFieldInput"
              value={detailsForm.address}
              onChange={(e) => onChange("address", e.target.value)}
              readOnly={!isEditing}
            />
          </div>
        </label>

        <label className="detailsField" htmlFor="details-plate">
          <span className="detailsFieldLabelWrap">
            <LuCar className="detailsFieldIcon" aria-hidden="true" />
            <span className="detailsFieldLabel">Nummerplade</span>
          </span>
          <div className="detailsFieldValueRow">
            <input
              id="details-plate"
              type="text"
              className="detailsFieldInput"
              value={detailsForm.plateNumber}
              onChange={(e) => onChange("plateNumber", e.target.value)}
              readOnly={!isEditing}
            />
          </div>
        </label>

        {!isEditing ? (
          <button
            type="button"
            className="detailsSaveButton"
            onClick={() => setIsEditing(true)}
          >
            Rediger
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="detailsSaveButton detailsCancel">
              Gem
            </button>
            <button
              type="button"
              className="detailsSaveButton detailsConfirm"
              onClick={() => setIsEditing(false)}
            >
              Annuller
            </button>
          </div>
        )}

        {saveMessage && !isEditing ? <p className="detailsSaveMessage">{saveMessage}</p> : null}
      </form>

    </section>
  );
}