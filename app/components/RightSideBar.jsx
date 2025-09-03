"use client";
import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { MoodService } from "../services/mood.service";

// 🎨 Colors for pie slices
const COLORS = [
  "#0088FE",
  "#FF8042",
  "#FFBB28",
  "#00C49F",
  "#FF66CC",
  "#66FF99",
];

export const RightSideBar = ({ onPanTo }) => {
  const [moodOfDay, setMoodOfDay] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [recentMoods, setRecentMoods] = useState([]);

  useEffect(() => {
    // 1. Initial fetch
    MoodService.getMoodOfTheDay().then(setMoodOfDay);
    MoodService.getMoodDistribution().then(setDistribution);
    MoodService.getTodayMoods().then((res) => {
      setRecentMoods(res.documents.slice(0, 10));
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
    <div className="w-full h-full p-4 rounded-2xl bg-white shadow-lg flex flex-col gap-4">
      {/* Mood of the Day */}
      <Card size="small" className="rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Mood of the Day</h2>
        {moodOfDay ? (
          <div className="flex flex-col gap-2 text-2xl w-full">
            <span className="flex items-center text-center">
              {moodOfDay.emoji}
              <span className="ml-2 text-base">Most felt</span>
            </span>
            <span className="text-xs text-gray-600">
              {moodOfDay.count} people feeling this way today
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">No moods shared yet</span>
        )}
      </Card>

      {/* Global Distribution */}
      <Card
        size="small"
        className="rounded-xl shadow flex flex-col items-center"
      >
        <h2 className="text-lg font-semibold mb-2">
          <RiseOutlined /> Global Distribution
        </h2>
        <div className="w-full h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={distribution.map((d) => ({ ...d, value: d.count }))}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40} // ✅ makes it a donut
                label={({ emoji }) => emoji}
              >
                {distribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value}`,
                  props.payload.emoji,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Live Mood Feed */}
      <Card size="small" className="rounded-xl shadow flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold">Live Mood Feed</h2>
        <span className="text-xs">{recentMoods.length} moods shared today</span>
        <div className="flex flex-col gap-2 mt-2">
          {recentMoods
            .filter(
              (m) => typeof m.lat === "number" && typeof m.lng === "number"
            )
            .map((m) => (
              <div
                key={m?.$id}
                onClick={() => onPanTo?.([m?.lat, m?.lng])} // ✅ Pan to mood location
                className="flex items-center gap-3 rounded-lg border border-gray-200 hover:border-blue-500 p-2 cursor-pointer"
              >
                <span className="text-xl">{m?.emoji}</span>
                <div className="flex flex-col">
                  {m?.text && (
                    <span className="text-sm text-gray-800">{m?.text}</span>
                  )}
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <EnvironmentOutlined /> {m?.lat?.toFixed(2)},{" "}
                    {m?.lng?.toFixed(2)} • <ClockCircleOutlined /> today
                  </span>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};
