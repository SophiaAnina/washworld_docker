"use client";
type Hall = {
  id: string;
  name: string;
  address: string;
  status: "Travlt" | "Ledig" | "Fyldt";
  waitTime: string;
  distance: string;
};
const statusColors: Record<Hall["status"], string> = {
  Travlt: "#ffbf24",
  Ledig: "#22c55e",
  Fyldt: "#ef4444",
};
type Props = {
  halls: Hall[];
  onSwitch: (id: string) => void;
};
export default function NearbyHalls({ halls, onSwitch }: Props) {
  return (
    <section style={{ marginTop: 30 }}>
      <h3 style={{ fontSize: "var(--h3-size)", fontWeight: 800, margin: "0 0 12px", paddingLeft: "2px" }}>Vaskehaller i nærheden</h3>
      <ul style={{ listStyle: "none", margin: 0, background: "rgba(74, 74, 74, 0.4)", padding: "6px" }}>
        {halls.map((hall, i) => (
          <li key={hall.id} style={{ borderBottom: i < halls.length - 1 ? "1px solid #08d17a" : "none", padding: "12px 8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "var(--body-md-size)", margin: 0 }}>{hall.name}</p>
                <p style={{ fontSize: "var(--body-sm-size)", color: "#ccc", margin: "2px 0 6px" }}>
                  {(() => {
                    const match = hall.address.match(/^(.+?),\s*(\d{4}.+)$/);
                    return match ? (
                      <>
                        <span style={{ display: "block" }}>{match[1]},</span>
                        <span style={{ display: "block" }}>{match[2]}</span>
                      </>
                    ) : (
                      <span>{hall.address}</span>
                    );
                  })()}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ background: statusColors[hall.status], color: "#000", fontWeight: 700, fontSize: 12, padding: "3px 8px" }}>{hall.status}</span>
                  <span style={{ fontSize: 11, color: statusColors[hall.status] }}>{hall.waitTime}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                <button
                  onClick={() => onSwitch(hall.id)}
                  style={{ background: "none", border: "none", color: "#fff", textDecoration: "underline", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
                >
                  Skift til
                </button>
                <span style={{ fontSize: 11, color: "#fff" }}>{hall.distance}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}