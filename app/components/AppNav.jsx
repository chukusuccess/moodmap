"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MenuOutlined, CloseOutlined, GlobalOutlined } from "@ant-design/icons";
import { Drawer, Button, Divider } from "antd";

const AppNavbar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const navLinks = [
    { label: "See Mood History", path: "/home/history" },
    { label: "About", path: "/" },
  ];

  return (
    <header className="w-full fixed top-0 z-50 px-6 py-3 subtle-shadow bg-white flex items-center justify-between">
      <Link
        href="/"
        className="text-xl font-semibold text-gray-800 flex items-center gap-2"
      >
        <GlobalOutlined />{" "}
        <div className="flex flex-col">
          <span>Global Mood Map</span>
          <span className="text-xs opacity-50 font-light">
            ✨Real-time emotions worldwide
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
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
          {navLinks.map((link) => (
            <li className="decoration-0 list-none w-full" key={link.path}>
              <Link
                style={{ color: "#1e2939" }}
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
