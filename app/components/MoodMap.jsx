"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet’s default marker issue in React/Next
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Dummy mood data
const moods = [
  {
    id: 1,
    emoji: "😀",
    text: "Feeling great!",
    lat: 6.5244,
    lng: 3.3792,
    location: "Lagos",
  },
  {
    id: 2,
    emoji: "😢",
    text: "Tired after work",
    lat: 52.52,
    lng: 13.405,
    location: "Berlin",
  },
  {
    id: 3,
    emoji: "🤩",
    text: "Excited for tomorrow!",
    lat: 40.7128,
    lng: -74.006,
    location: "NYC",
  },
];

// 🔑 Utility: cleanup map on unmount
function ResetOnUnmount() {
  const map = useMap();
  useEffect(() => {
    return () => {
      map.remove();
    };
  }, [map]);
  return null;
}

export default function MoodMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      >
        <ResetOnUnmount />

        {/* Background tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
        />

        {/* Mood pins */}
        {moods.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <div className="flex flex-col">
                <span className="text-xl">{m.emoji}</span>
                {m.text && <span className="text-sm">{m.text}</span>}
                {m.location && (
                  <span className="text-xs text-gray-500">{m.location}</span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
