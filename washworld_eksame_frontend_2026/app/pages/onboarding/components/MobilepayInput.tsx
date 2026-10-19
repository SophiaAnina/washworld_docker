
import React from "react";
import "../onboarding.css"

interface MobilePayInputProps {
    detailsForm: { phone: string };
    onPhoneChange: (phone: string) => void;
}

export default function MobilePayInput({ detailsForm, onPhoneChange }: MobilePayInputProps) {
    return (
        <div className="mobilePay" style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="user_phone">Telefonnummer</label>
            <input
                type="tel"
                name="user_phone"
                id="user_phone"
                disabled
            />
        </div>
    );
}