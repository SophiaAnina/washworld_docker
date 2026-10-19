"use client";
import { LuArrowUpRight } from "react-icons/lu";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import SwipeButton from "./SwipeButton";
import SwipeToStart from "../../../components/SwipeToStart/SwipeToStart";
import "../membershipcard.css"

type Package = "guld" | "premium" | "brilliant";
type Variant = "wash" | "dashboard";

type Props = {
  package: Package;
  location: string;
  address: string;
  queueStatus?: string;
  waitTime?: string;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onStart: () => void;
  onSwitch: () => void;
  variant?: Variant;
};

const packageLabels: Record<Package, string> = {
  guld: "Guld abonnement - Aktiv",
  premium: "Premium abonnement - Aktiv",
  brilliant: "Brilliant abonnement - Aktiv",
};

const packageLabelsDashboard: Record<Package, string> = {
  guld: "Guld abonnement - Aktiv",
  premium: "Premium abonnement - Aktiv",
  brilliant: "Brilliant abonnement - Aktiv",
};

const statusColors: Record<string, string> = {
  Travlt: "#ffbf24",
  Ledig: "#22c55e",
  Fyldt: "#ef4444",
};

const favoriteButtonStyle = {
  width: 36,
  height: 36,
  minWidth: 36,
  borderRadius: "50%",
  border: "1px solid rgba(12, 229, 120, 0.78)",
  background: "rgba(0, 0, 0, 0.3)",
  color: "#0ce578",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  fontSize: 22,
} as const;

// ---- DASHBOARD VARIANT ----
function DashboardMembershipCard({ pkg, address, isFavorite, onFavoriteToggle, onStart }: { pkg: Package; address: string; isFavorite: boolean; onFavoriteToggle: () => void; onStart: () => void }) {
  return (
    <section
      style={{
        //marginTop: 10,
        padding: "16px 14px 14px",
        background: "linear-gradient(180deg, rgba(41, 42, 45, 0.9) 0%, rgba(35, 36, 39, 0.9) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, lineHeight: 0.8, textAlign: "left" }}>Medlemskab</h1>
          <p style={{ margin: "4px 0 10px", color: "#08e184", fontSize: 18, fontWeight: 700 }}>{packageLabelsDashboard[pkg]}</p>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Wash World</p>
          <p style={{ margin: "2px 0 0", color: "#14ef96", fontSize: 14, lineHeight: 1.2 }}>{address}</p>
        </div>
        <button type="button" onClick={onFavoriteToggle} aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"} aria-pressed={isFavorite} style={favoriteButtonStyle}>
          {isFavorite ? <IoHeart aria-hidden="true" /> : <IoHeartOutline aria-hidden="true" />}
        </button>
      </div>
      <div style={{ margin: "26px 10px 12px" }}>
        <SwipeToStart label="Start din vask" flush onComplete={onStart} />
      </div>
    </section>
  );
}

// ---- WASH VARIANT ----
function WashMembershipCard({
  pkg,
  location,
  address,
  queueStatus,
  waitTime,
  isFavorite,
  onFavoriteToggle,
  onStart,
  onSwitch,
}: {
  pkg: Package;
  location: string;
  address: string;
  queueStatus?: string;
  waitTime?: string;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onStart: () => void;
  onSwitch: () => void;
}) {
  return (
    <section style={{ marginTop: 10, border: "1px solid #07de88", background: "#015126", padding: "14px 12px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, lineHeight: 0.8, color: "#fff"}}>Medlemskab</h1>
          <p style={{ margin: "4px 0 0", color: "#08e184", fontSize: 18, fontWeight: 700 }}>{packageLabels[pkg]}</p>
        </div>
        <button type="button" onClick={onFavoriteToggle} aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"} aria-pressed={isFavorite} style={favoriteButtonStyle}>
          {isFavorite ?<IoHeartOutline aria-hidden="true" />: <IoHeart aria-hidden="true" /> }
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 11, alignItems: "flex-start", marginTop: 8 }}>
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{location}:</p>
          <p style={{ margin: "2px 0 0", color: "#14ef96", fontSize: 14, lineHeight: 1.2 }}>
            {(() => {
              const match = address.match(/^(.+?),\s*(\d{4}.+)$/);
              return match ? (
                <>
                  <span style={{ display: "block" }}>{match[1]},</span>
                  <span style={{ display: "block" }}>{match[2]}</span>
                </>
              ) : (
                <span>{address}</span>
              );
            })()}
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitch}
          style={{
            border: "none",
            background: "transparent",
            color: "#76a08f",
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            marginTop: 5,
            textDecoration: "underline",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Skift vaskehal <LuArrowUpRight />
        </button>
      </div>
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ background: statusColors[queueStatus ?? ""] ?? "#ffbf24", color: "#0a0a0a", fontSize: 11, fontWeight: 700, padding: "2px 6px" }}>{queueStatus}</span>
        <span style={{ fontSize: 11 }}>{waitTime}</span>
      </div>
      
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 16 }}>
        <SwipeButton variant="vask" onActivate={onStart} />
      </div>
    </section>
  );
}

// ---- MAIN EXPORT ----
export default function MembershipCard({ package: pkg, location, address, queueStatus, waitTime, isFavorite, onFavoriteToggle, onStart, onSwitch, variant = "wash" }: Props) {
  if (variant === "dashboard") {
    return <DashboardMembershipCard pkg={pkg} address={address} isFavorite={isFavorite} onFavoriteToggle={onFavoriteToggle} onStart={onStart} />;
  }
  return (
    <WashMembershipCard
      pkg={pkg}
      location={location ?? ""}
      address={address}
      queueStatus={queueStatus}
      waitTime={waitTime}
      isFavorite={isFavorite}
      onFavoriteToggle={onFavoriteToggle}
      onStart={onStart}
      onSwitch={onSwitch}
    />
  );
}
