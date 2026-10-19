"use client";
import { use } from "react";
import AppHeader from "../../../../components/layout/AppHeader";
import BottomNav from "../../../../components/layout/BottomNav";
import WashProgram from "../../components/WashProgram";

type Params = {
  params: Promise<{ package: string }>;
};

export default function WashProgramPage({ params }: Params) {
  const { package: pkg } = use(params);

  return (
    <main style={{ minHeight: "100vh", overflowY: "auto", paddingBottom: 80 }}>
      <AppHeader variant="brand" />
      <WashProgram package={pkg as "brilliant" | "guld" | "premium"} />
      <BottomNav activeTab="wash" variant="angled" />
    </main>
  );
}