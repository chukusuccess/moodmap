"use client";
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MoodService } from "../services/mood.service";

// Fix Leaflet markers in React/Next
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MoodMap({ setPanTo }) {
  const [mounted, setMounted] = useState(false);
  const [moods, setMoods] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    // 1. Load today's moods
    MoodService.getTodayMoods().then((res) => {
      setMoods(res.documents);
    });

    // 2. Subscribe to new moods
    const unsubscribe = MoodService.subscribeToMoods((newMood) => {
      setMoods((prev) => [...prev, newMood]);
    });

    return () => unsubscribe();
  }, []);

  // ⚡ Expose panTo once map is created (TODO: FIX. doesn't work well)
  const handleMapCreated = (mapInstance) => {
    mapRef.current = mapInstance;
    if (setPanTo) {
      setPanTo((coords) => {
        mapInstance.setView(coords, 6, { animate: true });
      });
    }
  };

  if (!mounted)
    return <div className="w-full h-full bg-gray-100 rounded-2xl" />;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        key="mood-map"
        center={[20, 0]} // world view
        zoom={2}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
        whenCreated={handleMapCreated} // ✅ capture map instance
      >
        {/* Background tiles */}
        <TileLayer
          url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://www.carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Dark tile layer */}
        {/* <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://www.carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        /> */}

        {/* Mood pins */}
        {moods.length > 0 &&
          moods
            .filter(
              (m) => typeof m.lat === "number" && typeof m.lng === "number"
            )
            .map((m) => (
              <Marker key={m.$id} position={[m.lat, m.lng]}>
                <Popup>
                  <div className="flex flex-col">
                    <span className="text-xl">{m.emoji}</span>
                    {m.text && <span className="text-sm">{m.text}</span>}
                  </div>
                </Popup>
              </Marker>
            ))}
      </MapContainer>
    </div>
  );
}
