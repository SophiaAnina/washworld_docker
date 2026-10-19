import { SubscriptionPlan } from "../data/membershipTypes";
import Link from "next/link";
import BackButton from "@/app/components/layout/BackButton";
import { IoPeopleOutline } from "react-icons/io5";

interface MembershipCreateProps {
  onBack: () => void;
  plans: SubscriptionPlan[];
  onPlanClick: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
  error: string | null;
  currentPlanName: string;
}

export default function MembershipCreate({ onBack, plans, onPlanClick, isLoading, error, currentPlanName }: MembershipCreateProps) {
  // const currentPlanName = "premium";

  return (
    <section className="membershipCreate" aria-label="Ændre medlemskab">
      {/* <button type="button" className="profileBackButton" onClick={onBack}>
        <span aria-hidden="true">‹</span>
        Tilbage
      </button> */}
      <BackButton />

      <h1 className="membershipCreateTitle" style={{ fontSize: "var(--h2-size)", fontWeight: 800, textAlign: "center" }}>
        Ændre medlemskab
      </h1>
      <p className="membershipCreateSubtitle membershipCreateIntro" style={{ fontSize: "var(--body-sm-size)" }}>
        Få ubegrænset bilvask til en fast lav pris og vask, hvor og hvornår det passer dig.
      </p>

      <div className="membershipCreateCards">
        {isLoading && (
          <article className="membershipCreateCard">
            <div className="membershipCreateCardAction" aria-live="polite">
              <span className="membershipCreateCardDescription">Henter medlemskaber...</span>
            </div>
          </article>
        )}

        {!isLoading && error && (
          <article className="membershipCreateCard">
            <div className="membershipCreateCardAction" aria-live="polite">
              <span className="membershipCreateCardDescription">Kunne ikke hente medlemskaber lige nu.</span>
              <span className="membershipCreateReadMore">Prøv igen senere</span>
            </div>
          </article>
        )}

        {!isLoading && !error && plans.length === 0 && (
          <article className="membershipCreateCard">
            <div className="membershipCreateCardAction" aria-live="polite">
              <span className="membershipCreateCardDescription">Ingen medlemskaber fundet.</span>
            </div>
          </article>
        )}

        {plans.map((plan) => (
          <article key={plan.name} className={`membershipCreateCard${plan.name.toLowerCase() === currentPlanName.toLowerCase() ? " isCurrent" : ""}`}>
            <button type="button" className="membershipCreateCardAction" aria-label={`Vaelg ${plan.name}`} onClick={() => onPlanClick(plan)}>
              <span className="membershipPlanIconWrap" aria-hidden="true">
                <IoPeopleOutline className="membershipPlanPeopleIcon" />
              </span>
              <div className="membershipCreatePlanInfo">
                <span className="membershipCreatePlanName">{plan.name}</span>
                <span className="membershipCreatePlanPrice">{plan.price}kr./md</span>
                <span className="membershipCreatePlanDescription">{plan.shortDescription || "Læs mere om planen"}</span>
              </div>
              <span className="membershipCreateChevron" aria-hidden="true">
                ›
              </span>
              {plan.name.toLowerCase() === currentPlanName.toLowerCase() && <span className="membershipCreateCurrentBadge">Nuværende</span>}
            </button>
          </article>
        ))}
      </div>

      <Link href="/pages/wash/packages/compare" className="membershipCreateCompareLink">
        Sammenlign pakker
      </Link>
    </section>
  );
}
