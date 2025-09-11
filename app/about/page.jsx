"use client";
import React, { useState, useEffect } from "react";
import { message } from "antd";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { AuthService } from "../services/auth.service";

const AboutPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [username, setUsername] = useState(null);

  // get username (localStorage first, then Appwrite)
  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) {
      setUsername(stored);
    } else {
      AuthService.getUser()
        .then((user) => {
          if (user?.name) {
            setUsername(user.name);
            localStorage.setItem("username", user.name);
          }
        })
        .catch(() => {}); // ignore errors if not logged in
    }
  }, []);

  // format today's date for calendar reminder
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;

  return (
    <div className="max-h-screen h-screen w-full noscroll bg-[#ededf0] dark:bg-[#19191c] dark:text-[#c3c3c6] text-[#232325e6] flex flex-col items-center justify-start p-8 text-center sm:p-20 text-sm sm:text-base overflow-y-auto">
      {contextHolder}
      <div className="w-full lg:w-2/5">
        {/* Heading */}
        <h1 className="text-2xl">About Moodly</h1>
        <br />
        <h3 className="text-[#fd356e] font-semibold">
          A visual, collective emotional snapshot of humanity.
        </h3>
        <br />

        {/* What it is */}
        <p className="opacity-70 first-letter:opacity-100 first-letter:text-2xl">
          Moodly is a Global Mood Map that lets people anonymously share how
          they feel with just an emoji and (approximate) location. Those
          emotions are instantly pinned on an interactive world map, and
          displayed across different regions. <br />
          <br />
          <span>
            We&apos;re connected by feelings 😊, no matter where we live 🌍.
          </span>
        </p>
        <br />
        <hr className="opacity-20" />
        <br />

        {/* Reminder Section */}
        <h2 className="text-[#fd356e] font-semibold">
          Don&apos;t Miss Tomorrow
        </h2>
        <br />
        <p className="opacity-70">
          Moods reset daily! ⏳ — today&apos;s global snapshot will be gone
          tomorrow. Come back every day to share and explore the world&apos;s
          emotions in real time.
          <br />
          <br />
          Add to calendar
        </p>
        <br />
        <div className="flex justify-center">
          <AddToCalendarButton
            name={`Daily Mood Check-in${username ? ` with ${username}` : ""}`}
            options={["Apple", "Google", "iCal", "Microsoft365"]}
            location={"Earth"}
            startDate={dateStr}
            startTime="09:00"
            endTime="09:05"
            description={"Take a minute to share your mood today 🌍✨"}
            timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
            buttonsList={true}
            hideTextLabelButton={true}
            buttonStyle="round"
            lightMode="bodyScheme"
          />
        </div>
        <br />
        <hr className="opacity-20" />
        <br />

        {/* Why it matters */}
        <h2 className="text-[#fd356e] font-semibold">Why it Matters</h2>
        <br />
        <p className="opacity-70">
          Every mood you share is more than just an emoji. it&apos;s an
          anonymous signal that contributes to a bigger picture. These
          collective insights can help:
          <div className="w-full my-5">
            <b className="underline underline-offset-2">Communities</b>
            <p className="w-full">
              see they&apos;re not alone, fostering empathy and connection.
            </p>
            <br />
            <b className="underline underline-offset-2">Researchers</b>
            <p className="w-full">
              understand global emotional trends and how people respond to
              events.
            </p>
            <br />
            <b className="underline underline-offset-2">
              Humanitarian aid groups & NGOs
            </b>
            <p className="w-full">
              detect distress signals during crises to respond faster.
            </p>
            <br />
            <b className="underline underline-offset-2">
              Mental health & wellness apps
            </b>
            <p className="w-full">
              tune their support resources based on real, global emotional
              patterns.
            </p>
          </div>
          By sharing your mood, you&apos;re adding a pixel to a global picture
          that can help the world listen, understand, and act with compassion.
        </p>
        <br />
        <hr className="opacity-20" />
        <br />

        {/* About the Developer */}
        <h2 className="text-[#fd356e] font-semibold">About the Developer</h2>
        <br />
        <p className="opacity-70">
          Hi 👋 I&apos;m the creator of Moodly,{" "}
          <a
            className="text-[#fd356e]"
            href="https://chukusuccess.vercel.app/?title=home"
            target="_blank"
          >
            Success Chuku
          </a>{" "}
          — a developer passionate about building tools that connect people in
          meaningful ways. This project was born out of a desire to turn code
          into community, empathy, and awareness.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
