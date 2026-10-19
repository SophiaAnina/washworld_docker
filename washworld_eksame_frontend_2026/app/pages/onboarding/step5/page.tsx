"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveOnboardingData } from "../utils/onboardingStorage";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import "../onboarding.css";
import Progress from "../components/progress";
import { GrGroup } from "react-icons/gr";
import BackButton from "@/app/components/layout/BackButton";

type Membership = {
  membership_id: string;
  membership_name: string;
  membership_price: number;
  membership_description: string;
};

export default function OnboardingStep5() {
  const router = useRouter();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [clickedPlan, setClickedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1/api-memberships")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") setMemberships(data.memberships);
        else setError("Kunne ikke hente abonnement.");
      })
      .catch(() => setError(" Netværksfejl. Prøv igen."))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="Onboarding-3">
      {/* <button className='tilbageLink' type="button" onClick={() => router.back()}>
        <FaChevronLeft /> Tilbage
      </button> */}
      <BackButton />
      <h1>Vælg Abonnement</h1>
      <p>Få ubegrænset bilvask til en fast lav pris og vask, hvor og hvornår det passer dig.</p>

      {loading && <p>Indlæser...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {memberships.map((plan) => (
        <button type="button" key={plan.membership_id} className={clickedPlan === plan.membership_id ? "plan-btn clicked" : "plan-btn"} onClick={() => setClickedPlan(plan.membership_id)}>
          <input type="radio" value={plan.membership_id} readOnly checked={clickedPlan === plan.membership_id} />
          <div className="icon-container">
            <GrGroup className="icon" />
          </div>
          <div style={{ marginRight: "auto", textAlign: "left" }}>
            {/* double check this one but should be fine? */}
            <h2>{plan.membership_name.charAt(0).toUpperCase() + plan.membership_name.slice(1)}</h2>
            <h4>{plan.membership_price}kr./md.</h4>
            <p>{plan.membership_description}</p>
          </div>
        </button>
      ))}
      <button
        className="link"
        onClick={() => {
          router.replace("http://localhost:3000/pages/wash/packages/gpb");
        }}
      >
        Sammelign pakker
      </button>
      <button
        className="nextButton"
        type="button"
        disabled={!clickedPlan}
        onClick={() => {
          saveOnboardingData({ membership_fk: clickedPlan });
          router.push("/pages/onboarding/step6");
        }}
      >
        <FaArrowRight />
      </button>
      <Progress />
    </div>
  );
}
