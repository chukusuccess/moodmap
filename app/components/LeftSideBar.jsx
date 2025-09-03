"use client";
import { Form, Input, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoodService } from "../services/mood.service";

const emojiOptions = [
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

export const LeftSideBar = () => {
  const [form] = Form.useForm();
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [share, setShare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUserId(localStorage.getItem("cuid"));
    }
  }, []);

  const handleSubmit = async (values) => {
    if (!selectedEmoji) return;

    // 🛑 Spam-control: check last post timestamp
    const lastPost = localStorage.getItem("lastMoodPost");
    if (lastPost && Date.now() - parseInt(lastPost) < 60 * 1000) {
      // 1 min cooldown (adjust later)
      messageApi.warning("You can only post once per minute.");
      return;
    }

    setLoading(true);
    try {
      let coords = { lat: null, lng: null };

      // 🌍 Try to get geolocation
      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              };
              resolve();
            },
            () => resolve(), // ignore errors, allow posting
            { enableHighAccuracy: true }
          );
        });
      }

      const payload = {
        emoji: selectedEmoji,
        lat: coords.lat,
        lng: coords.lng,
        userAgent: navigator.userAgent,
        text: values.text || "",
        userId: currentUserId ? currentUserId : null,
      };

      await MoodService.createMood(payload);

      // ✅ success
      messageApi.success("Mood posted successfully!");
      form.resetFields();
      setSelectedEmoji(null);
      localStorage.setItem("lastMoodPost", Date.now().toString());
      setShare(false);
    } catch (err) {
      console.error("Error posting mood:", err);
      messageApi.error("Failed to post mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:h-full p-4 rounded-2xl bg-white shadow-lg flex flex-col">
      {contextHolder}

      <motion.h2
        whileTap={{ scale: 0.8 }}
        onClick={() => setShare((prev) => !prev)}
        className="text-lg font-semibold mb-4 transition-all ease-in-out duration-200 cursor-pointer"
      >
        Share Your Mood
      </motion.h2>

      <AnimatePresence>
        {share && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="flex flex-col flex-grow"
            >
              {/* Emoji grid */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                {emojiOptions.map((emoji) => (
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    key={emoji}
                    type="button"
                    className={`text-xl p-1 rounded-lg border flex items-center justify-center ${
                      selectedEmoji === emoji
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                    }`}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>

              {/* Optional text */}
              <Form.Item name="text" label="What's on your mind?">
                <Input.TextArea
                  rows={3}
                  maxLength={100}
                  showCount
                  placeholder={`Tell the world why you feel ${
                    selectedEmoji ?? "this way"
                  } today (optional)`}
                />
              </Form.Item>

              {/* Submit button */}
              <Form.Item className="mt-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    block
                    disabled={!selectedEmoji}
                    loading={loading}
                  >
                    Post Mood
                  </Button>
                </motion.div>
              </Form.Item>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
