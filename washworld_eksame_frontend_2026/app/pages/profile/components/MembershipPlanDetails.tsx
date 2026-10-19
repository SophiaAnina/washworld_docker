"use client";
import BackButton from "@/app/components/layout/BackButton";
import Image from "next/image";
import { IoPeopleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import SwipeToStart from "../../../components/SwipeToStart/SwipeToStart";
import { SubscriptionPlan } from "../data/membershipTypes";

function featureIcon(featureName: string): string {
  const normalized = featureName.toLowerCase();
  if (normalized.includes("shampoo")) return "/svg/vaskeikoner/aktiv_shampoo_hvid.svg";
  if (normalized.includes("skum")) return "/svg/vaskeikoner/skumforvask_hvid.svg";
  if (normalized.includes("borste")) return "/svg/vaskeikoner/borstevask_hvid.svg";
  if (normalized.includes("hjul")) return "/svg/vaskeikoner/hjulvask_hvid.svg";
  if (normalized.includes("hojtryk") || normalized.includes("højtryk")) return "/svg/vaskeikoner/hotryksvask_hvid.svg";
  if (normalized.includes("voks")) return "/svg/vaskeikoner/skyllevoks_hvid.svg";
  if (normalized.includes("glans")) return "/svg/vaskeikoner/hojglans_hvid.svg";
  if (normalized.includes("torr")) return "/svg/vaskeikoner/torring_hvid.svg";
  if (normalized.includes("undervogn")) return "/svg/vaskeikoner/undervogns_hvid.svg";
  if (normalized.includes("affedtning")) return "/svg/vaskeikoner/affedtning_hvid.svg";
  if (normalized.includes("sæson") || normalized.includes("saeson")) return "/svg/vaskeikoner/seasonrens_hvid.svg";
  return "/svg/vaskeikoner/skumforvask_hvid.svg";
}

interface MembershipPlanDetailsProps {
  onBack: () => void;
  plan: SubscriptionPlan;
}

export default function MembershipPlanDetails({ onBack, plan }: MembershipPlanDetailsProps) {
  const router = useRouter();

  const membershipMap: Record<string, string> = {
    Brilliant: "104eb10034fd4a07888fd6937ad6aea8",
    Premium: "0d5073d1426242c99f9ba711d99f2b34",
    Guld: "46514f804c0111f18db996d21e5e70c2",
  };

  async function handleConfirmChange() {
    const dbMembershipId = membershipMap[plan.name] ?? plan.id;
    if (!dbMembershipId) {
      alert("Ukendt plan. Prøv igen.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Du er ikke logget ind. Log ind og prøv igen.");
      return;
    }

    try {
      const res = await fetch("http://localhost:80/api-update-my-membership", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ membership_fk: dbMembershipId }),
      });
      if (!res.ok) {
        alert("Noget gik galt. Prøv igen.");
        return;
      }
    } catch {
      alert("Kunne ikke forbinde til serveren.");
      return;
    }

    router.push(`/pages/profile/membership/change/${plan.id}/success`);
  }

  return (
    <section className="membershipPlanDetails" aria-label={`Valgt plan ${plan.name}`}>
      <BackButton />
      <article className="membershipCreateCard" aria-label="Valgt medlemskabsplan">
        <button type="button" className="membershipCreateCardAction" style={{ pointerEvents: "none" }}>
          <span className="membershipPlanIconWrap" aria-hidden="true">
            <IoPeopleOutline className="membershipPlanPeopleIcon" />
          </span>
          <div className="membershipCreatePlanInfo">
            <span className="membershipCreatePlanName">{plan.name}</span>
            <span className="membershipCreatePlanPrice">{plan.price}kr./md</span>
            <span className="membershipCreatePlanDescription">{plan.shortDescription || "Læs mere om planen"}</span>
          </div>
        </button>
      </article>
      <h2 className="membershipIncludedTitle">Inkluderet i valgte {plan.name} program:</h2>
      <ul className="membershipIncludedList" aria-label="Inkluderede ydelser">
        {plan.features.map((feature) => (
          <li key={feature} className="membershipIncludedItem">
            <span className="membershipIncludedIconWrap" aria-hidden="true">
              <Image src={featureIcon(feature)} alt="" width={24} height={24} />
            </span>
            <span className="membershipIncludedLabel">{feature}</span>
          </li>
        ))}
      </ul>
      <SwipeToStart
        label="Skift medlemskab"
        completedLabel="Videresender..."
        onComplete={() => {
          void handleConfirmChange();
        }}
      />
    </section>
  );
}