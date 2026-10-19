"use client";

import { useState } from "react";
import { IoPeopleOutline } from "react-icons/io5";
import BackButton from "@/app/components/layout/BackButton";

interface MembershipCancelViewProps {
  onBack: () => void;
}

export default function MembershipCancelView({ onBack }: MembershipCancelViewProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const cancelReasons = ["For dyrt", "Bruger det ikke", "Andet"];

  return (
    <section className="membershipCancelView" aria-label="Annuller medlemskab">
      {/* <button type="button" className="profileBackButton" onClick={onBack}>
        <span aria-hidden="true">‹</span>
        Tilbage
      </button> */}
      <BackButton/>

      <h1 className="membershipCancelTitle" style={{ fontSize: "var(--h2-size)", fontWeight: 800, textAlign: "center" }}>Annuller medlemskab</h1>
      <p className="membershipCancelSubtitle" style={{ fontSize: "var(--sm-size)" }}>Vi er kede af at se dig gå</p>

      <article className="membershipPlanCard" aria-label="Aktivt medlemskab der annulleres">
        <span className="membershipPlanIconWrap" aria-hidden="true">
          <IoPeopleOutline className="membershipPlanPeopleIcon" />
        </span>
        <div className="membershipPlanInfo" style={{ padding: "10px" }}>
          <h1 className="membershipPlanName">Premium</h1>
          <p className="membershipPlanPrice">169kr./md</p>
          <p className="membershipPlanDate">Betalingsdato: 01/07/2026</p>
        </div>
      </article>

      <p className="membershipCancelNote" style={{ fontSize: "10px" }}>
        * Hvis du opsiger nu, fortsætter medlemskabet til slutningen af din betalingsperiode.
      </p>

      <h5 className="membershipCancelReasonTitle" style={{ fontSize: "var(--body-sm-size)" }}>
        Hjælp os med at blive bedre og fortæl hvorfor du ønsker at annullere dit medlemskab
      </h5>

      <div className="membershipCancelReasonList" role="group" aria-label="Aarsag til annullering">
        {cancelReasons.map((reason) => (
          <button
            key={reason}
            type="button"
            className={`membershipCancelReasonButton${selectedReason === reason ? " isSelected" : ""}`}
            onClick={() => setSelectedReason(reason)}
          >
            {reason}
          </button>
        ))}
      </div>

      <button type="button" className="membershipCancelConfirmButton" style={{ fontSize: "var(--h5-size)"}}>
        Annuller medlemskab
      </button>
    </section>
  );
}
