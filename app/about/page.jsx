"use client";
import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Divider } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const AboutPage = () => {
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  return (
    <div className="max-h-screen h-screen w-full noscroll bg-[#ededf0] dark:bg-[#19191c] dark:text-[#c3c3c6] text-[#232325e6] flex flex-col items-center justify-start p-8 text-center sm:p-20 text-sm sm:text-base">
      {contextHolder}
      <div className="w-full lg:w-2/3">
        <h1 className="text-2xl">About Moodly</h1>
        <br />
        <h3 className="text-[#fd356e] font-semibold">
          A visual, collective emotional snapshot of humanity.
        </h3>
        <br />
        <p className="opacity-70 first-letter:opacity-100 first-letter:text-2xl ">
          Moodly is a Global Mood Map that lets people anonymously share how
          they feel with just an emoji and (approximate) location. Those
          emotions are instantly pinned on an interactive world map, and
          displayed across different regions. <br />
          <br />
          <span>
            We&apos;re connected by feelings 😊, no matter where we live.
          </span>
        </p>
        <br />
        <hr className="opacity-20 bg-[#ededf0] dark:bg-[#19191c]" />
        <br />
        {/* <h2 className="text-[#fd356e] font-semibold">About the Developer</h2> */}
        <br />
        <p className="opacity-70">{/* About me */}</p>
      </div>
    </div>
  );
};

export default AboutPage;
