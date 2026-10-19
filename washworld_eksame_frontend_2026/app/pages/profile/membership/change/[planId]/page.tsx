"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AppHeader from "../../../../../components/layout/AppHeader";
import BottomNav from "../../../../../components/layout/BottomNav";
import MembershipPlanDetails from "../../../components/MembershipPlanDetails";
import { SubscriptionPlan } from "../../../data/membershipTypes";
import "../../../profile.css";

export default function PlanDetailsPage() {
  const router = useRouter();
  const { planId } = useParams<{ planId: string }>();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await fetch("/api/washworld-subscriptions");
        if (!res.ok || !isMounted) return;
        const data: unknown = await res.json();
        if (Array.isArray(data) && isMounted) {
          const found = (data as SubscriptionPlan[]).find((p) => p.id === planId);
          setPlan(found ?? null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, [planId]);

  if (isLoading) {
    return (
      <main className="ProfilePage">
        <AppHeader variant="brand" />
        <BottomNav activeTab="profile" variant="angled" />
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="ProfilePage">
        <AppHeader variant="brand" />
        <p style={{ color: "#fff", padding: "20px" }}>Plan ikke fundet.</p>
        <BottomNav activeTab="profile" variant="angled" />
      </main>
    );
  }

  return (
    <main className="ProfilePage">
      <AppHeader variant="brand" />
      <MembershipPlanDetails
        plan={plan}
        onBack={() => router.push("/pages/profile/membership/change")}
      />
      <BottomNav activeTab="profile" variant="angled" />
    </main>
  );
}
