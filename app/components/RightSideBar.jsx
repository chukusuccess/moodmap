import React from "react";
import { Card } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  RiseOutlined,
} from "@ant-design/icons";

// Dummy data
const moodOfTheDay = { emoji: "😀", count: 42 };
const distribution = [
  { emoji: "😀", value: 42 },
  { emoji: "😢", value: 25 },
  { emoji: "🤩", value: 15 },
  { emoji: "😴", value: 10 },
];
const recentMoods = [
  { emoji: "😀", text: "Happy", location: "Lagos" },
  { emoji: "😢", text: "Sad", location: "Berlin" },
  { emoji: "🤩", text: "Excited!", location: "NYC" },
];

// Colors for pie chart slices
const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F"];

export const RightSideBar = () => {
  return (
    <div className="w-full h-full p-4 rounded-2xl bg-white shadow-lg flex flex-col gap-4">
      {/* Mood of the Day */}
      <Card size="small" className="rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Mood of the Day</h2>
        <div className="flex flex-col gap-2 text-2xl w-full">
          <span className="flex items-center text-center">
            {moodOfTheDay.emoji} <span className="text-base">Happy</span>
          </span>
          <span className="text-xs text-gray-600">
            {moodOfTheDay.count} People feeling this way
          </span>
        </div>
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
                data={distribution}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ emoji }) => emoji}
              >
                {distribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Live Mood Feed */}
      <Card size="small" className="rounded-xl shadow flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold">Live Mood Feed</h2>
        <span className="text-xs">30 moods shared worldwide</span>
        <div className="flex flex-col gap-2">
          {recentMoods.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg border border-gray-200 hover:border-blue-500 p-1"
            >
              <span className="text-xl">{m.emoji}</span>
              <div className="flex flex-col">
                <span className="text-sm text-gray-800">{m.text}</span>
                <span className="text-xs text-gray-500">
                  <EnvironmentOutlined /> {m.location} - <ClockCircleOutlined />
                  Today
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
