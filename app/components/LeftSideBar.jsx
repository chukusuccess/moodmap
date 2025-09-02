import { Form, Input, Button } from "antd";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emojiOptions = ["😀", "😢", "😡", "🤩", "😴", "🤔", "😎", "🥳"];

export const LeftSideBar = () => {
  const [form] = Form.useForm();
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [share, setShare] = useState(false);

  const handleSubmit = (values) => {
    const payload = {
      emoji: selectedEmoji,
      text: values.text || "",
      // geolocation + user_id here before saving
    };
    console.log("Submitting mood:", payload);
  };

  return (
    <div
      className={`w-full sm:h-full
       p-4 rounded-2xl bg-white shadow-lg flex flex-col`}
    >
      <motion.h2
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        onClick={() => setShare((prev) => !prev)}
        className="text-lg font-semibold mb-4 transition-all ease-in-out duration-200"
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
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    block
                    disabled={!selectedEmoji}
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
