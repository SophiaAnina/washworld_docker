"use client";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuLocateFixed, LuSearch, LuSlidersHorizontal, LuX } from "react-icons/lu";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import "./dashboard.css";
import AppHeader from "../../components/layout/AppHeader";
import BottomNav from "../../components/layout/BottomNav";
import SwipeToStart from "../../components/SwipeToStart/SwipeToStart";
import mockDashboardData from "./data/mockDashboardData";
import MembershipCard from "../wash/components/MembershipCard";
import { useWashLocations } from "@/app/hooks/useWashLocations";
import { useAuth } from "@/app/hooks/useAuth";

const LiveWashMap = dynamic(() => import("./components/LiveWashMap"), {
  ssr: false,
  loading: () => <div className="mapLoading">Indlaeser kort...</div>,
});

type Package = "guld" | "premium" | "brilliant";
type WashLocation = {
  id: string;
  name: string;
  address: string;
  position: [number, number];
  openHours?: string;
  message?: string;
  regionName?: string;
  hallsCount?: number;
  selfWashCount?: number;
  vacuumCount?: number;
  preWashCount?: number;
  maxHeight?: string;
  imageUrl?: string;
};
type TrafficDay = {
  time: string;
  level: number;
  active?: boolean;
};

const ACTIVITY_WEEKDAYS = ["MAN", "TIR", "ONS", "TOR", "FRE", "LØR", "SØN"];

function getWeekdayIndex(date = new Date()) {
  const jsDay = date.getDay();
  return (jsDay + 6) % 7;
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ae/g, "æ")
    .replace(/oe/g, "ø")
    .replace(/aa/g, "å")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MAX_TRAFFIC_LEVEL = 94;

function buildTrafficData(selectedLocation: WashLocation | undefined, selectedDayIndex: number, todayIndex: number): TrafficDay[] {
  if (!selectedLocation) return [];
  const busyBoost = selectedLocation.message ? 12 : 0;
  const regionBoost = selectedLocation.regionName?.toLowerCase().includes("hoved") ? 6 : 0;
  const dayPatternBoost = [2, 0, 4, 7, 12, 15, 10][selectedDayIndex] ?? 0;
  const dayShift = (selectedDayIndex * 2) % 14;
  const currentHour = new Date().getHours();
  const isToday = selectedDayIndex === todayIndex;
  const timeSlots = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"];
  const baseLevels = [28, 40, 52, 63, 71, 69, 60, 66, 77, 78, 57, 48, 33, 37];
  const levels = timeSlots.map((_, index) => {
    const shifted = baseLevels[(index + dayShift) % baseLevels.length] ?? 35;
    return Math.min(MAX_TRAFFIC_LEVEL, shifted + busyBoost + regionBoost + dayPatternBoost);
  });
  return timeSlots.map((time, index) => ({
    time,
    level: levels[index],
    active: isToday && Number.parseInt(time, 10) === currentHour,
  }));
}

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [locateRequestCount, setLocateRequestCount] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); // ck added
  const [selectedActivityDayIndex, setSelectedActivityDayIndex] = useState(() => getWeekdayIndex());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterSelfWash, setFilterSelfWash] = useState(false);
  const [filterHallsCount, setFilterHallsCount] = useState<number | null>(null);

  const handleFilterToggle = () => setIsFilterOpen((prev) => !prev);

  // ck added — fetch favorites on load
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

  async function handleFavoriteToggle() {
    const previousValue = isFavorite;
    setIsFavorite((prev) => !prev);
    const token = localStorage.getItem("access_token");
    const method = previousValue ? "DELETE" : "POST";
    try {
      const res = await fetch("http://localhost:80/api-favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ location_id: selectedLocation?.id }),
      });
      if (!res.ok) throw new Error("Fejl");
      // ck added — update favoriteIds after toggle
      setFavoriteIds((prev) =>
        previousValue ? prev.filter((id) => id !== selectedLocation?.id) : [...prev, selectedLocation?.id ?? ""]
      );
    } catch {
      setIsFavorite(previousValue);
    }
  }

  const { locations, loadError } = useWashLocations();

  useEffect(() => {
    if (locations.length === 0) return;
    const soeborg = locations.find((loc) => loc.name.toLowerCase().includes("søborg"));
    setSelectedLocationId(soeborg?.id ?? null);
  }, [locations]);

  const filteredLocations = useMemo(() => {
    let result = locations;
    const normalizedQuery = normalizeSearchText(searchQuery);
    if (normalizedQuery) {
      const scored = result
        .map((location) => {
          const cleanedName = location.name.replace(/wash\s*world/gi, "").trim();
          const haystack = normalizeSearchText(`${cleanedName} ${location.address}`);
          const startsWith = haystack.startsWith(normalizedQuery);
          const includes = haystack.includes(normalizedQuery);
          return { location, score: startsWith ? 2 : includes ? 1 : 0 };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.location.name.localeCompare(b.location.name));
      result = scored.map((item) => item.location);
    }
    if (filterOpenNow) result = result.filter(() => true);
    if (filterSelfWash) result = result.filter((loc) => loc.selfWashCount && loc.selfWashCount > 0);
    if (filterHallsCount !== null) result = result.filter((loc) => loc.hallsCount === filterHallsCount);
    return result;
  }, [searchQuery, locations, filterOpenNow, filterSelfWash, filterHallsCount]);

  useEffect(() => {
    if (searchQuery && filteredLocations.length > 0) {
      setSelectedLocationId(filteredLocations[0].id);
    }
  }, [searchQuery, filteredLocations]);

  const selectedLocation = filteredLocations.find((location) => location.id === selectedLocationId);
  const todayActivityDayIndex = useMemo(() => getWeekdayIndex(), []);
  const trafficData = useMemo(() => buildTrafficData(selectedLocation, selectedActivityDayIndex, todayActivityDayIndex), [selectedLocation, selectedActivityDayIndex, todayActivityDayIndex]);
  const averageActivityLevel = useMemo(() => {
    if (trafficData.length === 0) return 0;
    const total = trafficData.reduce((sum, item) => sum + item.level, 0);
    return Math.round(total / trafficData.length);
  }, [trafficData]);

  const activitySummary = averageActivityLevel > 72 ? "Travlt" : averageActivityLevel > 56 ? "Lidt travlt" : "Stille og roligt";
  const openingHoursLabel = selectedLocation?.openHours ?? "7-22";
  const membershipName = (mockDashboardData.user.membershipTier ?? "").replace(/^Medlemskab:\s*/i, "").trim() || "Standard";

  useEffect(() => {
    if (!isLocationSheetOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLocationSheetOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocationSheetOpen]);

  const { user, loading: authLoading } = useAuth();
  const membershipPackage = useMemo((): Package => {
    const name = user?.membership_name?.toLowerCase() ?? "";
    if (name.includes("brilliant")) return "brilliant";
    if (name.includes("premium")) return "premium";
    if (name.includes("guld") || name.includes("gold")) return "guld";
    return "premium";
  }, [user]);

  return (
    <main className={isLocationSheetOpen ? "DashboardPage DashboardPageSheetOpen" : "DashboardPage"}>
      <AppHeader variant="brand" />
      <section className={isLocationSheetOpen ? "mapSection" : "mapSection mapSectionFullscreen"} aria-label="Wash World kort">
        <div className="mapSearchBar">
          <LuSearch aria-hidden="true" className="mapSearchIcon" />
          <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Søg vaskehaller" className="mapSearchInput" aria-label="Soeg efter vaskehal" />
          <button type="button" className="mapSearchButton" aria-label="Filtrer kort" onClick={handleFilterToggle}>
            <LuSlidersHorizontal aria-hidden="true" />
          </button>
        </div>
        {isFilterOpen && (
          <div className="filter">
            <span>
              <label htmlFor="filterOpenNow">Åben nu</label>
              <input type="checkbox" id="filterOpenNow" checked={filterOpenNow} onChange={() => setFilterOpenNow((v) => !v)} />
            </span>
            <span>
              <label htmlFor="filterSelfWash">Selvask</label>
              <input type="checkbox" id="filterSelfWash" checked={filterSelfWash} onChange={() => setFilterSelfWash((v) => !v)} />
            </span>
            <span>
              <label>Antal vaskehaller</label>
              <span>
                <label htmlFor="halls1">1</label>
                <input type="radio" id="halls1" name="hallsCount" checked={filterHallsCount === 1} onChange={() => setFilterHallsCount(1)} />
              </span>
              <span>
                <label htmlFor="halls2">2</label>
                <input type="radio" id="halls2" name="hallsCount" checked={filterHallsCount === 2} onChange={() => setFilterHallsCount(2)} />
              </span>
              <span>
                <label htmlFor="halls3">3</label>
                <input type="radio" id="halls3" name="hallsCount" checked={filterHallsCount === 3} onChange={() => setFilterHallsCount(3)} />
              </span>
              <span>
                <button type="button" onClick={() => setFilterHallsCount(null)} style={{ marginLeft: 8, fontSize: 12 }}>Nulstil</button>
              </span>
            </span>
          </div>
        )}
        <div className={isLocationSheetOpen ? "mapCanvasWrap" : "mapCanvasWrap mapCanvasWrapFullscreen"}>
          <LiveWashMap
            locations={filteredLocations}
            selectedLocationId={selectedLocationId ?? undefined}
            onSelectLocation={(locationId) => {
              setSelectedLocationId(locationId);
              setIsLocationSheetOpen(true);
              setIsFavorite(favoriteIds.includes(locationId)); // ck changed
            }}
            locateRequestCount={locateRequestCount}
          />
          {loadError ? <p className="mapErrorBanner">{loadError}</p> : null}
          <button type="button" className="locateButton" aria-label="Find min position" onClick={() => setLocateRequestCount((count) => count + 1)}>
            <LuLocateFixed aria-hidden="true" />
          </button>
        </div>
        {selectedLocation && isLocationSheetOpen ? (
          <section className="locationSheet" aria-label="Valgt vaskehal">
            <div className="locationSheetHeaderRow">
              <button type="button" className="sheetSecondaryButton sheetIconButton sheetTopCloseButton" aria-label="Luk detaljer" onClick={() => setIsLocationSheetOpen(false)}>
                <LuX aria-hidden="true" />
              </button>
              <p className="locationSheetHeaderName">{selectedLocation.name}</p>
              <p className="locationSheetHeaderOpen">Åbent - {openingHoursLabel}</p>
            </div>
            <div className="locationSheetScrollable">
              {selectedLocation.message ? (
                <p className="locationAlert locationAlertTop" role="status">{selectedLocation.message}</p>
              ) : null}
              {authLoading ? (
                <section className="activityPanel" aria-label="Indlaeser medlemskab">
                  <p>Indlaeser medlemskab...</p>
                </section>
              ) : (
                <MembershipCard
                  package={membershipPackage}
                  location={selectedLocation.name}
                  address={selectedLocation.address}
                  isFavorite={isFavorite}
                  onFavoriteToggle={handleFavoriteToggle}
                  onStart={() => router.push("/pages/wash/activewash")}
                  onSwitch={() => setIsLocationSheetOpen(false)}
                  variant="dashboard"
                />
              )}
              <section className="activityPanel" aria-label="Aktivitet for valgt vaskehal">
                <div className="activityWeekdays" role="tablist" aria-label="Vaelg dag">
                  {ACTIVITY_WEEKDAYS.map((weekday, index) => {
                    const isActiveDay = index === selectedActivityDayIndex;
                    return (
                      <button key={weekday} type="button" role="tab" aria-selected={isActiveDay} className={isActiveDay ? "activityWeekdayButton isActive" : "activityWeekdayButton"} onClick={() => setSelectedActivityDayIndex(index)}>
                        {weekday}
                      </button>
                    );
                  })}
                </div>
                <p className="activityStatus">
                  <span className="activityDot" aria-hidden="true" />
                  <strong>{selectedActivityDayIndex === todayActivityDayIndex ? "Nu:" : `${ACTIVITY_WEEKDAYS[selectedActivityDayIndex]}:`}</strong>{" "}
                  {(() => {
                    const now = new Date();
                    const hour = now.getHours();
                    if (selectedActivityDayIndex === todayActivityDayIndex && (hour < 7 || hour >= 22)) return "Lukket";
                    return activitySummary;
                  })()}
                </p>
                <div className="popularTimesChart" aria-label="Travlhed fordelt paa timer">
                  {trafficData.map((item) => (
                    <div key={item.time} className={item.active ? "popularTimesColumnWrap isActive" : "popularTimesColumnWrap"}>
                      <div className="popularTimesColumnTrack" aria-hidden="true">
                        <span className={item.active ? "popularTimesColumn popularTimesColumnActive" : "popularTimesColumn"} style={{ height: `${(item.level / MAX_TRAFFIC_LEVEL) * 100}%` }} />
                      </div>
                      <span className="popularTimesHour">{Number.parseInt(item.time, 10) % 3 === 0 ? `${item.time}` : ""}</span>
                    </div>
                  ))}
                </div>
              </section>
              {selectedLocation.hallsCount || selectedLocation.selfWashCount || selectedLocation.vacuumCount || selectedLocation.preWashCount || selectedLocation.maxHeight ? (
                <section className="hallDetailsPanel" aria-label="Hal detaljer" style={{ marginTop: 15, padding: 16, background: "linear-gradient(180deg, rgba(41, 42, 45, 0.9) 0%, rgba(35, 36, 39, 0.9) 100%)" }}>
                  <h3 style={{ margin: 0, fontSize: 18 }}>Hal detaljer</h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 15 }}>
                    <li><strong>Antal vaskehaller:</strong> {selectedLocation.hallsCount ?? "-"}</li>
                    <li><strong>Antal selvvask:</strong> {selectedLocation.selfWashCount ?? "-"}</li>
                    <li><strong>Antal støvsugere:</strong> {selectedLocation.vacuumCount ?? "-"}</li>
                    <li><strong>Antal forvask:</strong> {selectedLocation.preWashCount ?? "-"}</li>
                    <li><strong>Maks. højde:</strong> {selectedLocation.maxHeight ?? "-"}</li>
                  </ul>
                </section>
              ) : (
                <section className="hallDetailsPanel" aria-label="Hal detaljer" style={{ marginTop: 24, padding: 16, background: "#232323", color: "#bbb", textAlign: "center" }}>
                  <span>Ingen haldetaljer fundet for denne lokation.</span>
                </section>
              )}
            </div>
          </section>
        ) : null}
      </section>

      <BottomNav activeTab="dashboard" variant="angled" />
    </main>
  );
}
