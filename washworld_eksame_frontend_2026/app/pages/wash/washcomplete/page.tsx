"use client";

import AppHeader from "../../../components/layout/AppHeader";
// import BottomNav from "../../../components/layout/BottomNav";
import "../wash.css";
import { PiCarBold } from "react-icons/pi";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WashCompletePage() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", overflowY: "auto", paddingBottom: 80, display: "flex", flexDirection: "column", alignItems: "center", color: "var(--background)" }}>
      <AppHeader variant="brand" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 24, padding: "40px 20px", marginBottom: 120 }}>
        <h1 style={{ fontSize: "var(--h2-size)", fontWeight: 800, textAlign: "center", color: "var(--color-primary)" }}>Tak for dit besøg</h1>
         <Image src="/ChatGPTimage_conture_clear.png" alt="Bil" width={300} height={300} />
         <p style={{ fontSize: "var(--body-lg-size)", color: "#fff", textAlign: "center", padding: "0px 30px", marginBottom: "-25px" }}>Programmet er nu slut</p>
        <p style={{ fontSize: "var(--body-lg-size)", color: "#fff", textAlign: "center", padding: "0 30px" }}>Vi ønsker dig en god tur videre</p>
        {/* <PiCarBold style={{ fontSize: 120, color: "var(--color-primary)" }} /> */}
        <div style={{ textAlign: "center" }}>{/* <h2 style={{ fontSize: "var(--h3-size)", fontWeight: 700 }}>Programmet er nu afsluttet</h2> */}</div>
        <button onClick={() => router.push("/pages/dashboard")} style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", fontSize: "var(--body-md-size)", marginTop: "120px" }}>
          Tilbage til start
        </button>{" "}
      </div>
      {/* <BottomNav activeTab="wash" variant="angled" /> */}
    </main>
  );
}
