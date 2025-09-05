"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import SplashText from "./SplashText";

function Splash() {
  useEffect(() => {
    // lock scroll
    document.body.style.overflow = "hidden";

    // unlock after splash is done
    const timer = setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 3000); // delay(3.5s) + duration(0.5s)

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto"; // safety cleanup
    };
  }, []);

  return (
    <motion.div
      animate={{
        height: 0,
        transition: { duration: 0.5, delay: 2.5 },
      }}
      className="fixed top-0 z-[99999] flex items-center justify-center w-screen h-screen overflow-hidden bg-[#ededf0] dark:bg-[#19191c]"
    >
      <SplashText />
    </motion.div>
  );
}

export default Splash;
