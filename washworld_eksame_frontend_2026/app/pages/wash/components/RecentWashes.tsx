"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import AppHeader from "../../../components/layout/AppHeader";
import BottomNav from "../../../components/layout/BottomNav";
import WashHistory from "../../profile/components/WashHistory";
// TODO: Remove mockWashHistory import when wash table is ready in the database

import "../../profile/profile.css"

type WashEntry = {
  wash_id: string;
  created_at: number;
  membership_name: string | null;
};

async function fetchWashHistory() {
  const token = localStorage.getItem("access_token");
  const res = await fetch("http://localhost:80/api-my-wash-history", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Kunne ikke hente vaskhistorik");
  const data = await res.json();
  return data.washes as WashEntry[];
}

export default function RecentWashes() {
  const router = useRouter();

  const { data: washes, isLoading, isError } = useQuery({
    queryKey: ["washHistory"],
    queryFn: fetchWashHistory,
  });

  if (isLoading) return (
    <div style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
      Indlæser vaskhistorik...
    </div>
  );

  // TODO: Remove mockWashHistory and this block when wash table is ready
  // Replace with a proper empty state: <p>Ingen vaskehistorik endnu.</p>
  if (isError || !washes || washes.length === 0) return (
    <main className="ProfilePage" style={{minHeight:"0"}}>
      <h1 style={{ fontSize: "var(--display-h1-size)", lineHeight: "var(--display-h1-line)", fontWeight: 800, margin: 0, textAlign: "center" }}>Seneste vaske</h1>
      <p>Ingen vaskehistorik endnu.</p>
      <BottomNav activeTab="profile" variant="angled" />
    </main>
  );

  // Real data from backend — this runs when wash table exists and has data
  const history = washes.map((w) => ({
    location: "Wash World",
    date: new Date(w.created_at * 1000).toLocaleDateString("da-DK"),
    time: new Date(w.created_at * 1000).toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    label: w.membership_name ?? "Vask",
  }));

  return (
    <main className="ProfilePage">
       <h1 style={{ fontSize: "var(--display-h1-size)", lineHeight: "var(--display-h1-line)", fontWeight: 800, margin: 0, textAlign: "center" }}>Seneste vaske</h1>
      <WashHistory
        history={history}
      />
      <BottomNav activeTab="profile" variant="angled" />
    </main>
  );
}
