import { IoPeopleOutline } from "react-icons/io5";
import { LuUserPlus } from "react-icons/lu";
import Link from "next/link";

interface MembershipOptionsProps {
  onBack: () => void;
  onCreateMembershipClick?: () => void;
}

export default function MembershipOptions({
  onBack,
  onCreateMembershipClick,
}: MembershipOptionsProps) {
  return (
    <section className="membershipView" aria-label="Medlemskab muligheder">
      <button
        type="button"
        className="profileBackButton"
        onClick={onBack}
      >
        <span aria-hidden="true">‹</span>
        Tilbage
      </button>

      <div className="membershipOptionsList">
        <Link href="/pages/profile/membership/details" className="membershipOptionCard">
          <span className="membershipOptionIconWrap" aria-hidden="true">
            <IoPeopleOutline className="membershipOptionIcon" />
          </span>
          <span className="membershipOptionLabel">Mit medlemskab</span>
        </Link>

        <button
          type="button"
          className="membershipOptionCard"
          onClick={onCreateMembershipClick}
        >
          <span className="membershipOptionIconWrap" aria-hidden="true">
            <LuUserPlus className="membershipOptionIcon" />
          </span>
          <span className="membershipOptionLabel">Opret medlemskab</span>
        </button>
      </div>
    </section>
  );
}