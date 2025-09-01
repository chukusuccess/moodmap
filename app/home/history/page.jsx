"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button, Input, message } from "antd";
import {
  CheckCircleOutlined,
  CloseSquareOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
// import { useAuth } from "@/app/contexts/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";

const { Search } = Input;

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  // const { currentUser } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-6 pb-20 w-full">
      {contextHolder}
      <Search
        variant="filled"
        size="large"
        className="w-full bg-white rounded-md subtle-shadow"
        placeholder="Search your mood history..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      <div className="flex flex-col">
        List mood history here or show calendar style history for logged in
        users. Think about to add some fun extras later
      </div>
    </div>
  );
}
