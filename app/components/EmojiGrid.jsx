"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "./styles.css";

const moods = [
  "😀",
  "😢",
  "😡",
  "🤩",
  "😴",
  "😎",
  "🤔",
  "🥳",
  "😭",
  "😇",
  "😤",
  "🤯",
  "🥺",
  "😱",
  "😍",
  "😅",
  "😌",
  "🤒",
  "😷",
  "🤕",
  "🥶",
  "🥵",
  "😈",
  "👻",
  "🤡",
  "💩",
  "🤖",
  "🎉",
  "🔥",
  "🌊",
  "🌸",
  "🍕",
  "☕",
  "⚡",
  "❤️",
  "⭐",
];

const IconWithDynamicScale = ({ index, x, y }) => {
  const iconRef = useRef(null);

  // Calculate the icon's position in the grid
  const row = Math.floor(index / 6);
  const isOffsetRow = row % 2 === 1;

  const distance = useTransform([x, y], ([latestX, latestY]) => {
    if (!iconRef.current) return 1;

    const rect = iconRef.current.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 3;
    const iconCenterY = rect.top + rect.height / 3;

    const watchface = document.getElementById("watchface");
    if (!watchface) return 1;

    const watchfaceRect = watchface.getBoundingClientRect();
    const distanceFromLeft = Math.max(0, iconCenterX - watchfaceRect.left);
    const distanceFromRight = Math.max(0, watchfaceRect.right - iconCenterX);
    const distanceFromTop = Math.max(0, iconCenterY - watchfaceRect.top);
    const distanceFromBottom = Math.max(0, watchfaceRect.bottom - iconCenterY);

    const minDistance = Math.min(
      distanceFromLeft,
      distanceFromRight,
      distanceFromTop,
      distanceFromBottom
    );

    const margin = 70;

    if (
      iconCenterX < watchfaceRect.left ||
      iconCenterX > watchfaceRect.right ||
      iconCenterY < watchfaceRect.top ||
      iconCenterY > watchfaceRect.bottom
    ) {
      return 0;
    }

    if (minDistance < margin) {
      return minDistance / margin;
    }

    return 1;
  });

  return (
    <motion.div
      // whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      ref={iconRef}
      id={`icon-${index + 1}`}
      style={{ scale: distance }}
      className={`icon bg-radial-[at_25%_25%] from-white via-blue-100 to-zinc-400 to-75% ${
        isOffsetRow ? "offset" : ""
      }`}
    >
      {moods[index]}
    </motion.div>
  );
};

export default function Honeycomb({ count = 36 }) {
  const hexagons = Array.from({ length: count });
  const dragRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <div ref={dragRef} id="watchface" className="watchface">
      <motion.div
        id="draggablegrid"
        drag
        dragConstraints={{
          left: -180,
          right: 180,
          top: -80,
          bottom: 80,
        }}
        style={{ x, y }}
        className="draggable-grid"
      >
        <div className="grid-container">
          {hexagons.map((_, index) => (
            <IconWithDynamicScale key={index} index={index} x={x} y={y} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
