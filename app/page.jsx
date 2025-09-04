"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Input, Button, message, Tooltip } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import Splash from "./components/Splash";
import { RightSideBar } from "./components/RightSideBar";
import { MoodService } from "./services/mood.service";
import { moodCategories } from "./resources/constants";

const MoodMap = dynamic(() => import("./components/MoodMap"), { ssr: false });

export const emojiOptions = moodCategories.flatMap((cat) =>
  cat.emojis.map((e) => e.emoji)
);

export const colors = moodCategories.map((cat) => ({
  name: cat.name,
  hex: cat.color,
}));

export default function Home() {
  const [panTo, setPanTo] = useState(null);
  const [form] = Form.useForm();
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [share, setShare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

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
    <div className="flex flex-col items-center justify-center max-w-screen noscroll">
      <Splash />
      <div className="w-screen p-4 noscroll">
        {contextHolder}
        <div className="w-full h-fit sm:h-[85vh] flex flex-col sm:flex-row sm:items-start sm:justify-start gap-4 noscroll">
          <div className="rounded-xl sm:flex-3/5 flex-1 w-full aspect-square sm:aspect-auto sm:w-fit sm:h-full relative">
            <motion.div
              whileTap={{ scale: 0.8 }}
              onClick={() => setShare((prev) => !prev)}
              className="absolute z-[999] top-3 w-full flex items-center justify-center cursor-pointer "
            >
              <div className="w-3/4 bg-[#f5f5f520] px-3 sm:py-1 py-2 rounded-full backdrop-blur-xl flex items-center justify-between">
                <span className="text-xs sm:text-base">
                  Click to share your mood
                </span>
                {/* <span className="text-xs opacity-50">
                  <EnvironmentOutlined /> UK
                </span> */}
              </div>
            </motion.div>
            <div className="absolute z-[9999] top-14 w-full flex items-center justify-center">
              <AnimatePresence>
                {share && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#f5f5f520] backdrop-blur-xl rounded-xl p-2"
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
                            className={`text-xl p-1 rounded-lg flex items-center justify-center cursor-pointer ${
                              selectedEmoji === emoji
                                ? "bg-blue-100 border-blue-500"
                                : "bg-[#00000050] hover:bg-gray-100"
                            }`}
                            onClick={() => setSelectedEmoji(emoji)}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>

                      {/* Optional text */}
                      <Form.Item
                        name="text"
                        label={
                          <span className="text-[#c3c3c6]">
                            What's on your mind?
                          </span>
                        }
                      >
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
            <div className="absolute z-[999] flex sm:flex-col flex-row bottom-5 sm:bottom-auto sm:top-52 sm:right-3 bg-[#f5f5f520] backdrop-blur-xl rounded-full sm:py-2 py-1 sm:px-1 px-2 sm:space-y-2 place-self-center space-x-2 sm:space-x-0">
              {colors.map((item, index) => {
                return (
                  <Tooltip
                    className="cursor-pointer"
                    title={item.name}
                    key={index}
                  >
                    <div
                      className={`sm:w-6 sm:h-6 w-4 h-4 rounded-full ${item.hex}`}
                    ></div>
                  </Tooltip>
                );
              })}
            </div>
            <MoodMap setPanTo={setPanTo} />
          </div>
          <div className="sm:flex-1/5 flex-1 w-full sm:w-fit sm:h-full h-fit">
            <RightSideBar onPanTo={panTo} />
          </div>
        </div>
      </div>
    </div>
  );
}
