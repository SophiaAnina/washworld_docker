"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../../components/layout/AppHeader";
import BottomNav from "../../components/layout/BottomNav";
import MembershipCard from "./components/MembershipCard";
import NearbyHalls from "./components/NearbyHalls";
import RecentWashes from "./components/RecentWashes";
import BackButton from "../../components/layout/BackButton";
import { useAuth } from "@/app/hooks/useAuth";

type Package = "guld" | "premium" | "brilliant";

type WashWorldLocation = {
  id: string;
  name: string;
  address: string;
  position: [number, number];
  openHours?: string;
  message?: string;
};

type NearbyHall = WashWorldLocation & {
  status: "Travlt" | "Ledig" | "Fyldt";
  waitTime: string;
  distance: string;
  distanceKm: number;
};

const DEFAULT_POSITION: [number, number] = [55.6761, 12.5683];

const recentWashes = [
  { location: "Wash World Søborg", date: "I går", time: "18:42", label: "Guld" },
  { location: "Wash World Søborg", date: "27 april 2026", time: "10:22", label: "Guld" },
  { location: "Wash World Søborg", date: "29 april 2026", time: "16:29", label: "Guld" },
];

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(from: [number, number], to: [number, number]) {
  const earthRadiusKm = 6371;
  const deltaLatitude = toRadians(to[0] - from[0]);
  const deltaLongitude = toRadians(to[1] - from[1]);
  const latitude1 = toRadians(from[0]);
  const latitude2 = toRadians(to[0]);

  const a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) + Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2) * Math.cos(latitude1) * Math.cos(latitude2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(distanceKm: number) {
  return distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;
}

const MOCK_STATUSES: NearbyHall["status"][] = ["Travlt", "Ledig", "Fyldt"];
const MOCK_WAIT_TIMES: Record<NearbyHall["status"], string> = {
  Travlt: "Ca. 10 min ventetid",
  Ledig: "Klar nu",
  Fyldt: "Ca. 25 min ventetid",
};

function getMockQueueData(location: WashWorldLocation): Pick<NearbyHall, "status" | "waitTime"> {
  // Derive a stable index from the location id so the same hall always shows the same mock status
  const seed = [...location.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const status = MOCK_STATUSES[seed % MOCK_STATUSES.length]!;
  return { status, waitTime: MOCK_WAIT_TIMES[status] };
}

function getBrowserPosition(): Promise<[number, number]> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return Promise.resolve(DEFAULT_POSITION);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve([position.coords.latitude, position.coords.longitude]),
      () => resolve(DEFAULT_POSITION),
      {
        enableHighAccuracy: true,
        maximumAge: 15000,
        timeout: 10000,
      },
    );
  });
}

export default function WashPage() {
  const router = useRouter();
  const [nearbyHalls, setNearbyHalls] = useState<NearbyHall[]>([]);
  const [allHalls, setAllHalls] = useState<NearbyHall[]>([]);
  const [selectedHallId, setSelectedHallId] = useState<string | null>(null);
  const [isLoadingHalls, setIsLoadingHalls] = useState(true);
  const [hallError, setHallError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const { user, loading: authLoading } = useAuth();

  // Fetch favorites on load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    fetch("http://localhost:80/api-favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") setFavoriteIds(data.favorites ?? []);
      })
      .catch(() => {});
  }, []);

  const { user: user2, loading: authLoading2 } = useAuth();

  useEffect(() => {
    if (!authLoading2 && !user2) {
      router.replace("/pages/login");
    }
  }, [authLoading2, user2, router]);

  const membershipPackage = useMemo((): Package => {
    const name = user?.membership_name?.toLowerCase() ?? "";
    if (name.includes("brilliant")) return "brilliant";
    if (name.includes("premium")) return "premium";
    if (name.includes("guld") || name.includes("gold")) return "guld";
    return "premium";
  }, [user]);

  useEffect(() => {
    let isActive = true;
    const token = localStorage.getItem("access_token");
    if (!token) {
      localStorage.removeItem("authUser");
      router.replace("/pages/login");
      return;
    }

    async function loadNearbyHalls() {
      try {
        const [response, currentPosition] = await Promise.all([
          fetch("/api/washworld-locations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          getBrowserPosition(),
        ]);

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("authUser");
          router.replace("/pages/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Kunne ikke hente Wash World lokationer.");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Uventet format fra Wash World lokationer.");
        }

        const parsedHalls = (data as WashWorldLocation[])
          .filter((location) => location.id && location.name && location.address && Array.isArray(location.position) && location.position.length === 2)
          .map((location) => {
            const distanceKm = getDistanceKm(currentPosition, location.position);
            const queueData = getMockQueueData(location);

            return {
              ...location,
              ...queueData,
              distanceKm,
              distance: formatDistance(distanceKm),
            };
          })
          .sort((left, right) => left.distanceKm - right.distanceKm);

        if (!isActive) {
          return;
        }

        setAllHalls(parsedHalls);
        setNearbyHalls(parsedHalls.slice(0, 3));
        
        // Select favorite if available, otherwise select first hall
        const nearestFavorite = parsedHalls.find((hall) => favoriteIds.includes(hall.id));
        setSelectedHallId((current) => (nearestFavorite?.id ?? current) ?? parsedHalls[0]?.id ?? null);
        setHallError(parsedHalls.length > 0 ? null : "Ingen vaskehaller blev fundet.");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setNearbyHalls([]);
        setHallError(error instanceof Error ? error.message : "Kunne ikke hente Wash World lokationer.");
      } finally {
        if (isActive) {
          setIsLoadingHalls(false);
        }
      }
    }

    void loadNearbyHalls();

    return () => {
      isActive = false;
    };
  }, [router, favoriteIds]);

  const selectedHall = useMemo(() => {
    if (allHalls.length === 0) {
      return null;
    }

    return allHalls.find((hall) => hall.id === selectedHallId) ?? nearbyHalls[0];
  }, [allHalls, selectedHallId, nearbyHalls]);

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 100, background: "#000" }}>
      <AppHeader variant="brand" />
      <div style={{ padding: "0 18px" }}>
        <BackButton />
        {authLoading ? (
          <section style={{ marginTop: 10, border: "1px solid #07de88", background: "#015126", padding: "14px 12px 18px" }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>Medlemskab</h1>
            <p style={{ margin: "6px 0 0", color: "#08e184", fontSize: 14, fontWeight: 700 }}>Indlaeser medlemskab...</p>
          </section>
        ) : selectedHall ? (
          <MembershipCard
            package={membershipPackage}
            location={selectedHall.name}
            address={selectedHall.address}
            queueStatus={selectedHall.status}
            waitTime={selectedHall.waitTime}
            isFavorite={isFavorite}
            onFavoriteToggle={() => setIsFavorite((prev) => !prev)}
            onStart={() => router.push("/pages/wash/activewash")}
            onSwitch={() => router.push("/pages/dashboard")}
          />
        ) : (
          <section style={{ marginTop: 10, border: "1px solid #07de88", background: "#015126", padding: "14px 12px 18px" }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>Medlemskab</h1>
            <p style={{ margin: "6px 0 0", color: "#08e184", fontSize: 14, fontWeight: 700 }}>
              {isLoadingHalls ? "Henter de nærmeste vaskehaller..." : (hallError ?? "Ingen vaskehaller tilgængelige.")}
            </p>
          </section>
        )}
        <NearbyHalls
          halls={nearbyHalls}
          onSwitch={(id) => {
            setSelectedHallId(id);
          }}
        />
        <RecentWashes/>
      </div>
      <BottomNav activeTab="wash" variant="angled" />
    </main>
  );
}
