"use client";

import { useRouter } from "next/navigation";
import AppHeader from "../../../../components/layout/AppHeader";
import BottomNav from "../../../../components/layout/BottomNav";
import MembershipDetails from "../../components/MembershipDetails";
import "../../profile.css";

export default function MembershipDetailsPage() {
  const router = useRouter();

  return (
    <main className="ProfilePage">
      <AppHeader variant="brand" />
      <MembershipDetails
        onBack={() => router.push("/pages/profile")}
        onCancel={() => router.push("/pages/profile/membership/cancel")}
      />
      <BottomNav activeTab="profile" variant="angled" />
    </main>
  );
}
