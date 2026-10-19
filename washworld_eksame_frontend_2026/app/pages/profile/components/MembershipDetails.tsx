"use client";
import Link from "next/link";
import Image from "next/image";
import BackButton from "../../../components/layout/BackButton";
import { useAuth } from "@/app/hooks/useAuth";

const featuresByMembership: Record<string, string[]> = {
  brilliant: ["Hojtryksskyl", "Shampoo", "Borstevask", "Hjulvask", "Undervognsskyl", "Skyllevoks", "Polering", "Torring"],
  premium: ["Hojtryksskyl", "Shampoo", "Borstevask", "Hjulvask", "Undervognsskyl", "Skyllevoks", "Polering", "Torring"],
  guld: ["Hojtryksskyl", "Shampoo", "Borstevask", "Hjulvask", "Undervognsskyl"],
};

const featureIcons: Record<string, string> = {
  Hojtryksskyl: "/svg/vaskeikoner/hotryksvask_hvid.svg",
  Shampoo: "/svg/vaskeikoner/aktiv_shampoo_hvid.svg",
  Borstevask: "/svg/vaskeikoner/borstevask_hvid.svg",
  Hjulvask: "/svg/vaskeikoner/hjulvask_hvid.svg",
  Undervognsskyl: "/svg/vaskeikoner/undervogns_hvid.svg",
  Skyllevoks: "/svg/vaskeikoner/skyllevoks_hvid.svg",
  Polering: "/svg/vaskeikoner/hojglans_hvid.svg",
  Torring: "/svg/vaskeikoner/torring_hvid.svg",
};

interface MembershipDetailsProps {
  onBack: () => void;
  onCancel: () => void;
}

export default function MembershipDetails({ onBack, onCancel }: MembershipDetailsProps) {
  const { user } = useAuth();
  const membershipName = user?.membership_name ?? "Premium";
  const membershipPrice = user?.membership_price ?? 169;
  const membershipKey = membershipName.toLowerCase().includes("brilliant") ? "brilliant" : membershipName.toLowerCase().includes("guld") ? "guld" : "premium";
  const includedFeatures = featuresByMembership[membershipKey] ?? featuresByMembership.premium;

  return (
    <section className="membershipDetails" aria-label="Mit medlemskab detaljer">
      <BackButton />
      <article className="membershipPlanCard" aria-label="Aktiv medlemskabsplan">
        <span className="membershipPlanIconWrap" aria-hidden="true">
          <span className="membershipPlanIconGroup">OO</span>
        </span>
        <div className="membershipPlanInfo" style={{ padding: "10px" }}>
          <h1 className="membershipPlanName">{membershipName}</h1>
          <p className="membershipPlanPrice">{membershipPrice}kr./md</p>
          <p className="membershipPlanDate">Betalingsdato: 01/07/2026</p>
        </div>
      </article>
      <h2 className="membershipIncludedTitle">Inkluderet i valgte {membershipName} program:</h2>
      <ul className="membershipIncludedList" aria-label="Inkluderede ydelser">
        {includedFeatures.map((feature) => (
          <li key={feature} className="membershipIncludedItem">
            <Image src={featureIcons[feature]} alt={feature} width={24} height={24} />
            <span className="membershipIncludedLabel">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="/pages/profile/membership/change" className="membershipManageButton">
        <span>Ændre medlemskab</span>
        <span className="membershipManageArrow" aria-hidden="true">›</span>
      </Link>
      <button type="button" className="membershipCancelButton" onClick={onCancel}>
        Annuller medlemskab
      </button>
    </section>
  );
}