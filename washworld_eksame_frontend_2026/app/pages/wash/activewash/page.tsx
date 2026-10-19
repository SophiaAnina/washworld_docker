"use client";
import { useState } from "react";
import WashStartOverlay from "../components/WashStartOverlay";
import AppHeader from "../../../components/layout/AppHeader";
import BottomNav from "../../../components/layout/BottomNav";
import WashProgram from "../components/WashProgram";
import { useAuth } from "@/app/hooks/useAuth";

type Package = "guld" | "premium" | "brilliant";

export default function ActiveWashPage() {
  const [showOverlay, setShowOverlay] = useState(true);

  // Hent brugerens data fra backend
  const { user } = useAuth();

  // Find brugerens medlemskab og vis det korrekte vaskeprogram
  const membershipName = user?.membership_name?.toLowerCase() ?? "";
  const membershipPackage: Package = membershipName.includes("brilliant") ? "brilliant" : membershipName.includes("premium") ? "premium" : "guld";

  return (
    <main style={{ minHeight: "100vh", overflowY: "auto", paddingBottom: 80, background: "#000" }}>
      {showOverlay && <WashStartOverlay onComplete={() => setShowOverlay(false)} />}
      <AppHeader variant="brand" />
      <WashProgram package={membershipPackage} />
      <BottomNav activeTab="wash" variant="angled" />
    </main>
  );
}
