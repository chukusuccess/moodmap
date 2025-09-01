"use client";
import React from "react";
import { motion } from "framer-motion";
import SplashText from "./SplashText";

function Splash() {
  return (
    <motion.div
      animate={{
        height: 0,
        transition: { duration: 0.5, delay: 3.5 },
      }}
      className="absolute top-0 z-[99999] flex items-center justify-center w-screen h-screen overflow-hidden bg-[#f0f0f0]"
    >
      <SplashText />
    </motion.div>
  );
}

export default Splash;
