import React from "react";
import { LuCar } from "react-icons/lu";
import BackButton from "../../../components/layout/BackButton";

export interface WashHistoryItem {
  location: string;
  date: string;
  time: string;
  label: string;
}

interface WashHistoryProps {
  history: WashHistoryItem[];
  onBack?: () => void;
  showBackButton?: boolean;
  title?: string;
}
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

export default function WashHistory({ history, onBack, showBackButton = true, title = "Seneste vaske historik" }: WashHistoryProps) {
  return (
    <section className="washHistory" aria-label="Seneste vaske historik">
      {showBackButton && onBack ? (
    
        <BackButton />
      ) : null}
      
       
      <ul className="washHistoryList">
        {history.map((item, idx) => (
          <li className="washHistoryItem" key={idx}>
            <div className="washHistoryIconWrap">
              <LuCar className="washHistoryIcon" aria-hidden="true" />
            </div>
            <div className="washHistoryInfo">
              <div className="washHistoryLocation">{item.location}</div>
              <div className="washHistoryDateTime">
                {item.date}, {item.time}
              </div>
            </div>
            <span className="washHistoryLabel">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
