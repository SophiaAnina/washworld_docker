"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import AppHeader from "../../../../../../components/layout/AppHeader";
import { SubscriptionPlan } from "../../../../data/membershipTypes";
import "../../../../profile.css";

export default function MembershipChangeSuccessPage() {
  const router = useRouter();
  const { planId } = useParams<{ planId: string }>();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadPlans() {
      try {
        const res = await fetch("/api/washworld-subscriptions");
        if (!res.ok || !isMounted) return;
        const data: unknown = await res.json();
        if (Array.isArray(data) && isMounted) {
          setPlans(data as SubscriptionPlan[]);
        }
      } catch {
        // Fall back to default title if API is unavailable.
      }
    }

    void loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  const activePlan = useMemo(() => plans.find((plan) => plan.id === planId) || null, [plans, planId]);

  const planName = activePlan?.name || "Premium";

  return (
    <main className="ProfilePage">
      <AppHeader variant="brand" />
      <section className="membershipChangeSuccessView" aria-label="Medlemskab ændret">
        <h1 className="membershipChangeSuccessTitle">{planName} medlemskab</h1>

        <div className="membershipChangeSuccessIconWrap" aria-hidden="true">
          <LuCheck className="membershipChangeSuccessIcon" />
        </div>

        <p className="membershipChangeSuccessHeading">Dit medlemskab er nu ændret</p>
        <p className="membershipChangeSuccessSubtext">God fornøjelse med din næste vask</p>

        <button type="button" className="membershipChangeSuccessNext" onClick={() => router.push("/pages/dashboard")} aria-label="Fortsæt">
          <LuArrowRight aria-hidden="true" />
        </button>
      </section>
    </main>
  );
}