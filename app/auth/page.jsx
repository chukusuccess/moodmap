"use client";
import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { AuthService } from "../services/auth.service";

const { Title, Link } = Typography;

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const toggleMode = () => setIsSignUp(!isSignUp);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isSignUp) {
        // 1. Create user
        await AuthService.createUser({
          email: values.email,
          password: values.password,
          fullName: values.name,
        });

        // 2. Auto-login after signup
        await AuthService.login({
          email: values.email,
          password: values.password,
        });

        messageApi.success("Account created! Redirecting...");
      } else {
        // Sign in
        await AuthService.login({
          email: values.email,
          password: values.password,
        });

        messageApi.success("Welcome back!");
      }

      // Redirect to history page
      router.push("/home/history");
    } catch (err) {
      console.error("Auth error:", err);
      messageApi.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen h-screen noscroll bg-[#ededf0] dark:bg-[#19191c] flex flex-col items-center justify-center px-4 w-full">
      {contextHolder}
      <div className="bg-white dark:bg-black shadow-md rounded-xl p-8 w-full max-w-md">
        <Title level={3} className="text-center mb-6">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Title>

        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="text-[#c3c3c6]"
          >
            <Form
              size="large"
              name={isSignUp ? "signupForm" : "signinForm"}
              layout="vertical"
              onFinish={onFinish}
            >
              {isSignUp && (
                <Form.Item
                  name="name"
                  label={<span className="text-[#c3c3c6]">Name</span>}
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input placeholder="John Doe" />
                </Form.Item>
              )}

              <Form.Item
                name="email"
                label={<span className="text-[#c3c3c6]">Email</span>}
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="you@example.com" />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-[#c3c3c6]">Password</span>}
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  loading={loading}
                  size="large"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-4">
              <span className="text-[#c3c3c6]">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <Link onClick={toggleMode}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Link>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
