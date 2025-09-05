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
import { useTheme } from "@/app/contexts/DarkModeProvider";

const { Search } = Input;

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [currentUserId, setCurrentUserId] = useState(null);

  const { theme } = useTheme();

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
    <div className="p-6 pb-20 w-full min-h-screen dark:bg-[#232325e6] bg-[#ededf0] dark:text-[#c3c3c6] text-[#232325e6] flex flex-col items-center">
      {contextHolder}
      <div className="w-full sm:max-w-1/3">
        <Search
          variant="filled"
          size="large"
          className="w-full dark:bg-[#ffffff60] bg-[#00000020] backdrop-blur-xl rounded-md subtle-shadow"
          placeholder="Search your mood history..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16 }}
          allowClear
        />
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 mb-4">
          {filtered.length === 0 ? (
            <Empty
              description={
                <span className="text-[#ededf0] opacity-50">
                  No moods yet. Share your first mood!
                </span>
              }
            />
          ) : (
            filtered.map((m) => (
              <motion.div
                key={m.$id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className=""
              >
                <Card
                  size="small"
                  variant="borderless"
                  style={{
                    background: theme === "dark" ? "#19191c" : "#fff",
                    color: theme === "dark" ? "#ededf0" : "#232325e6",
                    borderRadius: "0.75rem",
                    padding: 6,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-sm">{m.text || "No caption"}</span>
                      <span className="text-xs flex items-center gap-1 opacity-50">
                        <ClockCircleOutlined />{" "}
                        {dayjs(m.$createdAt).format("MMM D, YYYY h:mm A")}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
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
