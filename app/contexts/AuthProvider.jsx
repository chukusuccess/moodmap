"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Result } from "antd";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthService } from "../services/auth.service";

const AuthContext = createContext({
  currentUser: null,
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getAuthUser = async () => {
      setLoading(true);
      try {
        const res = await AuthService.getUser();
        if (res.status === true) {
          setCurrentUser({ id: res.$id, fullname: res.name, email: res.email });
          setIsAuthenticated(true);
          localStorage.setItem("cuid", res.$id);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("cuid");
        }
      } catch (e) {
        console.error("Auth Check Failed:", e.message);
        localStorage.removeItem("cuid");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    getAuthUser();
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.replace("/auth");
    setLoading(false);
  }, [router]);

  const value = useMemo(() => ({ currentUser, logout }), [currentUser, logout]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <div className="w-screen h-screen max-h-screen pt-20 dark:bg-[#232325e6] bg-[#ededf0] dark:text-[#c3c3c6] text-[#232325e6]">
        <Result
          status="403"
          title={
            <span className="dark:text-[#c3c3c6] text-[#232325e6]">Oops!</span>
          }
          subTitle={
            <span className="dark:text-[#c3c3c6] text-[#232325e6]">
              Sorry, you have to be logged in to view this page.
            </span>
          }
          extra={
            <Link replace href={"/auth"}>
              <span className="bg-white hover:bg-[#000] py-2 px-6 rounded-full">
                Login
              </span>
            </Link>
          }
        />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth() MUST BE USED WITHIN AN <AuthProvider/> !!!");
  }

  return context;
};

export { AuthProvider, useAuth };
