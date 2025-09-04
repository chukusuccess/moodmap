import React from "react";
import { Spin } from "antd";

export const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <Spin style={{ color: "#fd356e" }} />
    </div>
  );
};
