import { useEffect, useState } from "react";

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

export function useWashLocations() {
  const [locations, setLocations] = useState<WashLocation[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/washworld-locations")
      .then(async (res) => {
        if (!res.ok) throw new Error("Kunne ikke hente Wash World lokationer.");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) return;
        setLocations(data);
        setLoadError(data.length === 0 ? "Ingen Wash World lokationer fundet." : null);
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Kunne ikke hente Wash World lokationer.");
      });
  }, []);

  return { locations, loadError };
}