"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Input, message, Empty, Card, Button } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import { MoodService } from "@/app/services/mood.service";
import dayjs from "dayjs";
import { useAuth } from "@/app/contexts/AuthProvider";
import { useRouter } from "next/navigation";

const { Search } = Input;

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUserId(localStorage.getItem("cuid"));
    }
  }, []);

  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    if (!currentUserId) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await MoodService.getUserMoods(currentUserId);
        setHistory(res.documents);
      } catch (err) {
        console.error("Error loading history:", err);
        messageApi.error("Could not load mood history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUserId]);

  const filtered = history.filter((m) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      m.emoji.includes(lower) ||
      (m.text && m.text.toLowerCase().includes(lower))
    );
  });

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

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <Empty description="No moods yet. Share your first mood!" />
        ) : (
          filtered.map((m) => (
            <motion.div
              key={m.$id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                size="small"
                className="rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-800">
                      {m.text || "No caption"}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <ClockCircleOutlined />{" "}
                      {dayjs(m.$createdAt).format("MMM D, YYYY h:mm A")}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
        <div className="my-10 w-full flex flex-row gap-5">
          {filtered.length === 0 && (
            <Button
              block
              type="primary"
              size="large"
              onClick={() => router.push("/")}
            >
              Share mood
            </Button>
          )}
          <Button
            block
            danger
            type="default"
            size="large"
            onClick={() => logout()}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
