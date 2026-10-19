"use client";
import { useState } from "react";
import AppHeader from "@/app/components/layout/AppHeader";
import PackageFeatures from "../../components/PackageFeature";
import PackageSelector from "../../components/PackageSelector";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import BackButton from "@/app/components/layout/BackButton";
import React from "react";

type Package = "guld" | "premium" | "brilliant";

const packageDescriptions: Record<Package, string | React.ReactNode> = {
  guld: <>Til dig der vil holde bilen ren<br />til en fast lav pris</>,
  premium: <>Til dig der vil have lidt ekstra beskyttelse<br />med undervogn og skumvask</>,
  brilliant: <>Til dig der vil have den mest komplette vask<br />med sæsonrens og affedtning</>,
};

export default function PackagesPage() {
  const [active, setActive] = useState<Package>("guld");
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", paddingBottom: 80, background: "#000" }}>
      <AppHeader variant="brand" />
      <div style={{ padding: "0px 20px 0" }}>
        {/* <button
          onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "var(--body-md-size)", marginBottom: 16 }}
        >
          <FaChevronLeft /> Tilbage
        </button> */}
        <BackButton/>
        <h1 style={{ fontSize: "var(--display-h1-size)", lineHeight: "var(--display-h1-line)", fontWeight: 800, margin: 0, textAlign: "center" }}>Vaskepakker</h1>
        <p style={{ fontSize: "var(--body-sm-size)", lineHeight: "var(--body-sm-line)", margin: "4px 0 36px", textAlign: "center" }}>
          {packageDescriptions[active]}
        </p>
        <PackageSelector active={active} onChange={setActive} />
      </div>
      <div style={{ marginTop: 2 }}>
        <PackageFeatures active={active} />
      </div>
    </div>
  );
}