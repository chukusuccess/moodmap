"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function SplashText() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("scrolling to top");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        opacity: 0,
        transition: { duration: 0.8, delay: 3.5 },
      }}
      className="flex flex-col items-center justify-center w-full h-full"
    >
      <Image
        className="w-4/5 h-auto sm:w-1/5 sm:h-auto"
        src={"/moodmaplogo.png"}
        alt="cover"
        width={1000}
        height={1000}
      />
      <br />
      <span className="uppercase font-bold text-2xl">MOODMAP</span>
    </motion.div>
  );
}

export default SplashText;
