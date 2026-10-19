"use client";
import AppHeader from "../../../../components/layout/AppHeader";
import BottomNav from "../../../../components/layout/BottomNav";
import MembershipCreate from "../../components/MembershipCreate";
import { useSubscriptions } from "../../../../../app/hooks/useSubscriptions";
import "../../profile.css";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/useAuth";

export default function MembershipChangePage() {
  const router = useRouter();
  const { subscriptions, isLoading, error } = useSubscriptions();
  const { user } = useAuth();
  if (!user) return <div>Indlæser...</div>; 

  return (
    <main className="ProfilePage">
      <AppHeader variant="brand" />
      <MembershipCreate
        onBack={() => router.push("/pages/profile/membership/details")}
        plans={subscriptions}
        isLoading={isLoading}
        error={error}
        currentPlanName={user?.membership_name ?? ""}
        onPlanClick={(plan) =>
          router.push(`/pages/profile/membership/change/${plan.id}`)
        }
      />
      <BottomNav activeTab="profile" variant="angled" />
    </main>
  );
}