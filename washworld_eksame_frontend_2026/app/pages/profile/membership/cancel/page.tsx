"use client";

import { useRouter } from "next/navigation";
import AppHeader from "../../../../components/layout/AppHeader";
import BottomNav from "../../../../components/layout/BottomNav";
import MembershipCancelView from "../../components/MembershipCancelView";
import "../../profile.css";

export default function MembershipCancelPage() {
  const router = useRouter();

  return (
    <main className="ProfilePage">
      <AppHeader variant="brand" />
      <MembershipCancelView
        onBack={() => router.push("/pages/profile/membership/details")}
      />
      <BottomNav activeTab="profile" variant="angled" />
    </main>
  );
}
