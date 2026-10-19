import { NextResponse } from "next/server";

type WashWorldApiLocation = {
  id?: string;
  locationUid?: string;
  name?: string;
  address?: string;
  openHours?: string;
  hallsCount?: number;
  vacuumCount?: number;
  maxHeight?: string;
  latitude?: string | number;
  longitude?: string | number;
  locale?: string;
};

type NormalizedLocation = {
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

// Helper function to convert coordinate values to numbers, handling both string and number inputs and filtering out invalid values
// Wash World's API is inconsistent with its coordinate formats, so we need to be flexible in parsing them while ensuring we end up with valid numbers or null
// We consider a value valid if it can be parsed into a finite number. Invalid values (like non-numeric strings, null, undefined, or non-finite numbers) will be normalized to null to indicate missing/invalid coordinates.
function toNumber(value: string | number | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const normalized = value.replace(",", ".").trim();
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

// Normalize the API response to ensure we have consistent data and filter out invalid entries
// We require at least a name, address, and valid coordinates to consider a location valid
function normalizeLocation(location: WashWorldApiLocation): NormalizedLocation | null {
  const latitude = toNumber(location.latitude);
  const longitude = toNumber(location.longitude);

  if (!location.name || !location.address || latitude === null || longitude === null) {
    return null;
  }

  return {
    id: location.locationUid || location.id || location.name,
    name: location.name.includes(" - ") ? `Wash World ${location.name.split(" - ")[0]}` : location.name,
    address: location.address,
    position: [latitude, longitude],
    openHours: location.openHours,
    hallsCount: location.hallsCount,
    vacuumCount: location.vacuumCount,
    maxHeight: location.maxHeight || undefined,
  };
}

// Cache for 1 hour since locations don't change often and API is slow
// Revalidate on error after 5 minutes to avoid long downtime if API is down
// Note: This is a server component, so we can use NextResponse and fetch directly
// We are fetching from Wash World's public API, so CORS is not an issue and we can keep the API key hidden if needed

export async function GET() {
  try {
    // The API is paginated (default limit 10), so request everything in one page
    const response = await fetch("https://washworld.dk/api/locations?limit=500", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch Wash World locations" }, { status: 502 });
    }

    const data: { docs?: unknown } | null = await response.json();

    if (!data || !Array.isArray(data.docs)) {
      return NextResponse.json({ error: "Unexpected Wash World response format" }, { status: 502 });
    }

    // The API returns every market (da, se, no, de); this app only uses the Danish locations
    const locations = (data.docs as WashWorldApiLocation[])
      .filter((location) => location.locale === "da")
      .map(normalizeLocation)
      .filter((location): location is NormalizedLocation => location !== null);

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Failed to load Wash World locations:", error);
    return NextResponse.json({ error: "Unable to load Wash World locations" }, { status: 500 });
  }
}
