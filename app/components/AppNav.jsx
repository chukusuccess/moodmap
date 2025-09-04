"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  MenuOutlined,
  CloseOutlined,
  MoonOutlined,
  SunOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Drawer, Button, Divider, Switch } from "antd";
import { useTheme } from "../contexts/DarkModeProvider";

const AppNavbar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const { theme, setTheme } = useTheme();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "See Mood History", path: "/home/history" },
    { label: "About", path: "/" },
  ];

  return (
    <header className="w-full fixed top-0 z-[99999] px-6 py-3 subtle-shadow bg-[#fff] dark:bg-[#000] text-[#fd356e] flex items-center justify-between">
      <Link href="/" className="text-xl font-semibold flex items-center gap-2">
        <SmileOutlined className="text-4xl animate-pulse" />{" "}
        <div className="flex flex-col">
          <span>Moodly</span>
          <span className="text-xs opacity-80 font-light dark:text-[#c3c3c6] text-[#232325e6]">
            Real-time emotions worldwide ✨
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 p-2">
          <Switch
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </div>
        <Button
          type="primary"
          htmlType="button"
          icon={open ? <CloseOutlined /> : <MenuOutlined />}
          onClick={toggleDrawer}
          className="sm:hidden"
        />
      </div>

      <Drawer
        closeIcon={null}
        placement="right"
        zIndex={99999}
        style={{
          background: theme === "dark" ? "#19191c" : "#ededf0",
          color: theme === "dark" ? "#ededf0" : "#232325e6",
        }}
        onClose={toggleDrawer}
        open={open}
        title="MoodMap."
        extra={
          <Button
            type="primary"
            htmlType="button"
            icon={<CloseOutlined />}
            onClick={toggleDrawer}
            className="w-fit"
          />
        }
      >
        <ul className="flex flex-col decoration-0 list-none items-center w-full">
          {navLinks.map((link, index) => (
            <li className="decoration-0 list-none w-full" key={index}>
              <Link
                style={{ color: theme === "dark" ? "#ededf0" : "#232325e6" }}
                href={link.path}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center text-base font-semibold active:bg-gray-200 hover:bg-gray-200"
              >
                {link.label}
              </Link>
              <Divider />
            </li>
          ))}
        </ul>
      </Drawer>
    </header>
  );
};

export default AppNavbar;
