"use client";
import { useEffect, useState } from "react";
import Splash from "./components/Splash";
import { motion } from "framer-motion";
import { message } from "antd";
import dayjs from "dayjs";
import { LeftSideBar } from "./components/LeftSideBar";
import { RightSideBar } from "./components/RightSideBar";

import dynamic from "next/dynamic";

const MoodMap = dynamic(() => import("./components/MoodMap"), { ssr: false });

export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="flex flex-col items-center justify-center max-w-screen noscroll">
      <Splash />
      <div className="w-screen p-4 noscroll">
        {contextHolder}
        <div className="w-full h-fit sm:h-[80vh] flex flex-col sm:flex-row sm:items-start sm:justify-start gap-4 noscroll">
          <div className="sm:flex-1/5 flex-1 w-full sm:w-fit">
            <LeftSideBar />
          </div>
          <div className="rounded-2xl bg-white sm:flex-3/5 flex-1 w-full aspect-square sm:aspect-auto sm:w-fit sm:h-full">
            <MoodMap />
          </div>
          <div className="sm:flex-1/5 flex-1 w-full sm:w-fit">
            <RightSideBar />
          </div>
        </div>
      </div>
    </div>
  );
}
