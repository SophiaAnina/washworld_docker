"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

type MapLocation = {
  id: string;
  name: string;
  address: string;
  waitTime?: string;
  status?: string;
  position: [number, number];
};

interface LiveWashMapProps {
  locations: MapLocation[];
  selectedLocationId?: string;
  onSelectLocation: (locationId: string) => void;
  locateRequestCount: number;
}

// Default to Denmark center, but allow override
// const denmarkCenter: [number, number] = [56.2639, 9.5018];
const denmarkCenter: [number, number] = [55.7307, 12.5014]; // start in soeborg

function MapViewportController({
  locations,
  selectedLocationId,
  currentPosition,
  locateRequestCount,
}: {
  locations: MapLocation[];
  selectedLocationId?: string;
  currentPosition: [number, number] | null;
  locateRequestCount: number;
}) {
  const map = useMap();
  const lastLocateRequestCountRef = useRef(0);
  const lastFallbackLocateRequestCountRef = useRef(0);

  useEffect(() => {
    const selectedLocation = locations.find((location) => location.id === selectedLocationId);

    if (selectedLocation) {
      map.flyTo(selectedLocation.position, 13, { duration: 0.8 });
    }
  }, [locations, map, selectedLocationId]);

  useEffect(() => {
    if (locateRequestCount <= lastLocateRequestCountRef.current) {
      return;
    }

    if (currentPosition) {
      map.flyTo(currentPosition, 14, { duration: 0.8 });
      lastLocateRequestCountRef.current = locateRequestCount;
      return;
    }

    if (locateRequestCount <= lastFallbackLocateRequestCountRef.current) {
      return;
    }

    const selectedLocation = locations.find((location) => location.id === selectedLocationId);

    if (selectedLocation) {
      map.flyTo(selectedLocation.position, 14, { duration: 0.8 });
      lastFallbackLocateRequestCountRef.current = locateRequestCount;
    }
  }, [currentPosition, locateRequestCount, locations, map, selectedLocationId]);

  return null;
}

export default function LiveWashMap({ locations, selectedLocationId, onSelectLocation, locateRequestCount }: LiveWashMapProps) {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  // const mapCenter = currentPosition ?? denmarkCenter;
  const selectedLocation = locations.find((loc) => loc.id === selectedLocationId);
  const mapCenter = currentPosition ?? selectedLocation?.position ?? denmarkCenter;

  const getLocationIcon = (name: string) =>
    L.divIcon({
      className: "washMapMarker",
      html: `<div style="display: flex; flex-direction: column; align-items: center;">
        <span class='washMapMarkerInner'></span>
        <span style='color: #fff; font-weight: 600; text-shadow: 0 1px 4px #000, 0 0 2px #000; font-size: 13px; margin-top: 10px; white-space: nowrap;'>${name}</span>
      </div>`,
      iconSize: [80, 36], // wider to fit text
      iconAnchor: [40, 28],
      popupAnchor: [0, -24],
    });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition([position.coords.latitude, position.coords.longitude]);
      },
      () => undefined,
      {
        enableHighAccuracy: true,
        maximumAge: 15000,
        timeout: 20000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <MapContainer center={mapCenter} zoom={12.5} scrollWheelZoom className="liveWashMap" zoomControl={false}>
      <TileLayer attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>' url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_4l9t_1_49bf6592ec6fb98e6ab29a0f" />
      {/* <TileLayer attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" /> */}

      <MapViewportController locations={locations} selectedLocationId={selectedLocationId} currentPosition={currentPosition} locateRequestCount={locateRequestCount} />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={location.position}
          icon={getLocationIcon(location.name)}
          eventHandlers={{
            click: () => onSelectLocation(location.id),
          }}
        >
          <Popup>
            <strong>{location.name}</strong>
            <br />
            {location.address}
            <br />
            {location.waitTime && <>Ventetid: {location.waitTime}</>}
          </Popup>
        </Marker>
      ))}

      {currentPosition ? <CircleMarker center={currentPosition} radius={11} pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#18de84", fillOpacity: 1 }} /> : null}
    </MapContainer>
  );
}
