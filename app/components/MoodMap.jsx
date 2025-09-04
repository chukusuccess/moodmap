"use client";
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MoodService } from "../services/mood.service";
import { lexend } from "../layout";
import { moodCategories } from "../resources/constants";
import dayjs from "dayjs";
import { useTheme } from "../contexts/DarkModeProvider";

// helper: find category by emoji
const getCategoryForEmoji = (emoji) =>
  moodCategories.find((cat) =>
    cat.emojis.some((item) => item.emoji === emoji)
  ) || null;

export default function MoodMap({ setPanTo }) {
  const [mounted, setMounted] = useState(false);
  const [moods, setMoods] = useState([]);
  const mapRef = useRef(null);

  const { theme } = useTheme();

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
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        key="mood-map"
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
        whenCreated={handleMapCreated}
        attributionControl={false}
      >
        {theme === "dark" ? (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={6}
            minZoom={1}
          />
        ) : (
          <TileLayer
            url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={6}
            minZoom={1}
          />
        )}
        {/* ✅ Custom Attribution */}
        <div className="absolute bottom-1 right-2 text-[10px] text-gray-400 opacity-70 pointer-events-none z-[1000] ">
          ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            OpenStreetMap
          </a>{" "}
          contributors |{" "}
          <a
            href="https://www.carto.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            CARTO
          </a>
        </div>

        {/* Mood pins */}
        {moods
          .filter((m) => typeof m.lat === "number" && typeof m.lng === "number")
          .map((m) => {
            const cat = getCategoryForEmoji(m.emoji);
            const color = cat ? cat.hex : "#888";

            return (
              <CircleMarker
                key={m.$id}
                center={[m.lat, m.lng]}
                pathOptions={{
                  radius: 8,
                  fillColor: color,
                  fillOpacity: 0.7,
                  color: color,
                  weight: 2,
                }}
              >
                <Popup>
                  <div
                    className={`${lexend.className} flex flex-col items-center p-2`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    {cat && (
                      <span className="text-sm font-semibold mt-2">
                        {cat.emojis.find((e) => e.emoji === m.emoji)?.label}
                      </span>
                    )}
                    {m.text && (
                      <span className="text-xs opacity-50">{m.text}</span>
                    )}
                    {m.$createdAt && (
                      <span className="text-xs opacity-50 mt-2">
                        {dayjs(m.$createdAt).format("MMM D, YYYY h:mm A")}
                      </span>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}
