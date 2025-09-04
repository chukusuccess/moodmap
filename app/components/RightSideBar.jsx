"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, Modal } from "antd";
import { motion } from "framer-motion";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { MoodService } from "../services/mood.service";
import { moodCategories } from "../resources/constants";
import { useTheme } from "../contexts/DarkModeProvider";

// helper: find category by emoji
const getCategoryForEmoji = (emoji) =>
  moodCategories.find((cat) =>
    cat.emojis.some((item) => item.emoji === emoji)
  ) || null;

// helper: get country name from coord
async function getCountryName(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
  );
  const data = await res.json();
  return data.address?.country || "Unknown";
}

export const RightSideBar = ({ onPanTo }) => {
  const [moodOfDay, setMoodOfDay] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [recentMoods, setRecentMoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedPercentage, setSelectedPercentage] = useState(null);

  const { theme } = useTheme();

  // fast emoji -> category index map once
  const emojiToCatIndex = useMemo(() => {
    const map = {};
    moodCategories.forEach((cat, idx) => {
      cat.emojis.forEach(({ emoji }) => {
        map[emoji] = idx;
      });
    });
    return map;
  }, []);

  // Aggregate emoji counts into category totals
  const categoryAgg = useMemo(() => {
    const totals = new Array(moodCategories.length).fill(0);
    distribution.forEach(({ emoji, count }) => {
      const idx = emojiToCatIndex[emoji];
      if (idx !== undefined) totals[idx] += count;
    });
    const totalAll = totals.reduce((a, b) => a + b, 0);

    return moodCategories.map((cat, idx) => ({
      cat,
      count: totals[idx],
      pct: totalAll ? Math.round((totals[idx] / totalAll) * 100) : 0,
    }));
  }, [distribution, emojiToCatIndex]);

  const showModal = (percentage, cat) => {
    setSelectedCat(cat);
    setSelectedPercentage(percentage);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // 1. Initial fetch
    MoodService.getMoodOfTheDay().then(setMoodOfDay);
    MoodService.getMoodDistribution().then(setDistribution);
    MoodService.getTodayMoods().then(async (res) => {
      const withCountries = await Promise.all(
        res.documents.slice(0, 10).map(async (m) => ({
          ...m,
          country: await getCountryName(m.lat, m.lng),
        }))
      );
      setRecentMoods(withCountries);
    });

    // 2. Subscribe to realtime updates
    const unsubscribe = MoodService.subscribeToMoods((newMood) => {
      setRecentMoods((prev) => [newMood, ...prev].slice(0, 10));

      // update distribution + mood of the day
      MoodService.getMoodDistribution().then(setDistribution);
      MoodService.getMoodOfTheDay().then(setMoodOfDay);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full h-full p-4 rounded-xl bg-[#fff] dark:bg-[#000] shadow-lg flex flex-col gap-4">
      {/* Mood of the Day */}
      <Card
        style={{
          // background: getCategoryForEmoji(moodOfDay?.emoji)?.hex || "#19191c",
          background: theme === "dark" ? "#19191c" : "#ededf0",
          color: theme === "dark" ? "#ededf0" : "#232325e6",
          borderLeft: `2px solid ${getCategoryForEmoji(moodOfDay?.emoji)?.hex}`,
          borderRight: `2px solid ${
            getCategoryForEmoji(moodOfDay?.emoji)?.hex
          }`,
          borderRadius: "0.75rem",
          padding: 4,
        }}
        variant="borderless"
        size="small"
      >
        {moodOfDay ? (
          <div className="flex items-center gap-2">
            <span className="animate-bounce text-4xl bg-[#ffffff70] dark:bg-[#00000030] rounded-full aspect-square flex items-center justify-center">
              {moodOfDay?.emoji}
            </span>
            <div className="flex flex-col text-2xl w-full bg-[#ffffff70] dark:bg-[#00000030] rounded-lg px-3 py-1">
              <h2 className="text-lg font-semibold mb-2">Mood of the Day</h2>
              <span className="text-xs">
                {moodOfDay.count} {moodOfDay.count > 1 ? "people" : "person"}{" "}
                feeling this way today
              </span>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500">No moods shared yet</span>
        )}
      </Card>

      {/* Global Distribution */}
      <Card
        style={{
          background: theme === "dark" ? "#19191c" : "#ededf0",
          color: theme === "dark" ? "#ededf0" : "#232325e6",
          borderRadius: "0.75rem",
        }}
        variant="borderless"
        className="rounded-xl shadow flex flex-col items-center"
      >
        <h2 className="text-lg font-semibold mb-4">
          <RiseOutlined /> Global Mood Distribution
        </h2>

        <div className="grid grid-cols-3 gap-4 w-full">
          {categoryAgg.map((d, index) => {
            return (
              <motion.div
                whileTap={{ scale: 0.8 }}
                key={index}
                className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                style={{ backgroundColor: theme === "dark" ? "#000" : "#fff" }}
                onClick={() => showModal(d.pct, d.cat)}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-sm font-semibold`}
                >
                  {d.pct}%
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Live Mood Feed */}
      <Card
        style={{
          background: theme === "dark" ? "#19191c" : "#ededf0",
          color: theme === "dark" ? "#ededf0" : "#232325e6",
          borderRadius: "0.75rem",
          padding: 6,
        }}
        variant="borderless"
        size="small"
        className="rounded-xl shadow flex-1 overflow-y-auto noscroll"
      >
        <h2 className="text-lg font-semibold">Live Mood Feed</h2>
        <span className="text-xs">
          {recentMoods.length} {recentMoods.length === 1 ? "person" : "people"}{" "}
          shared their mood today
        </span>
        <div className="flex flex-col gap-2 mt-2">
          {recentMoods.map((m) => (
            <div
              key={m?.$id}
              onClick={() => onPanTo?.([m?.lat, m?.lng])} // ✅ Pan to mood location
              className="flex items-center gap-2 rounded-lg dark:bg-black bg-white p-2 cursor-pointer"
            >
              <span className="text-xl">{m?.emoji}</span>
              <div className="flex flex-col">
                <span className="text-sm">
                  {
                    getCategoryForEmoji(m.emoji)?.emojis.find(
                      (e) => e.emoji === m.emoji
                    )?.label
                  }
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <EnvironmentOutlined /> {m?.country || "Earth"} •{" "}
                  <ClockCircleOutlined /> today
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Modal
        title=""
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        styles={{
          content: {
            background: selectedCat?.hex || "#19191c",
            borderRadius: "1rem",
            color: "#fff",
          },
        }}
      >
        {selectedCat && (
          <div className="flex flex-col items-center justify-center p-6 gap-3">
            {/* All emojis in category */}
            <div className="flex items-center gap-3 text-2xl">
              {selectedCat.emojis.map((e, idx) => (
                <span
                  className="bg-[#00000020] rounded-full p-1 flex items-center justify-center"
                  key={idx}
                >
                  {e.emoji}
                </span>
              ))}
            </div>

            {/* Percentage + category name */}
            <div className="text-center text-xs sm:text-base bg-[#00000020] rounded-lg px-3 py-2">
              <span className="opacity-80">
                <span className="font-semibold">{selectedPercentage}%</span> of
                people who shared their mood today are feeling <br />
              </span>
              <span className="font-semibold text-sm sm:text-xl">
                {selectedCat.name}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
