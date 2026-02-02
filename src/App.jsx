import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login, setLoading, logout } from "./app/features/authSlice";
import { Toaster, toast } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const notifiedRef = useRef(false);
  // Fix: Session expiry toast spam
  const getUserData = React.useCallback(async () => {
    try {
      await api.get("/");
    } catch (e) {
      console.debug("warmup failed", e);
    }
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: token },
        });
        if (data.user) {
          if (!localStorage.getItem("token")) return;
          dispatch(login({ token, user: data.user }));
          const lastPath = localStorage.getItem("lastPath");
          if (
            lastPath &&
            (lastPath.startsWith("/app") || lastPath.startsWith("/view"))
          ) {
            navigate(lastPath, { replace: true });
          }
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.message);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(() => {
    const limit = 3 * 60 * 60 * 1000;
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("lastActive", "0");
      return;
    }
    const lastActiveStr = localStorage.getItem("lastActive");
    const lastActive = lastActiveStr ? Number(lastActiveStr) : 0;

    if (lastActive && Date.now() - lastActive > limit) {
      dispatch(logout());
      localStorage.setItem("lastActive", "0");
      navigate("/auth?state=login", { replace: true });
      if (!notifiedRef.current) {
        toast.error("Session expired. Please sign in again.");
        notifiedRef.current = true;
      }
    }

    const touch = () => localStorage.setItem("lastActive", String(Date.now()));
    touch();
    const onActivity = () => touch();
    window.addEventListener("mousemove", onActivity);
    window.addEventListener("keydown", onActivity);
    const id = setInterval(() => {
      const last = Number(localStorage.getItem("lastActive") || "0");
      if (last && Date.now() - last > limit) {
        dispatch(logout());
        localStorage.setItem("lastActive", "0");
        const path = window.location.pathname || "";
        if (!path.startsWith("/auth")) {
          navigate("/auth?state=login", { replace: true });
        }
        if (!notifiedRef.current) {
          toast.error("Session expired. Please sign in again.");
          notifiedRef.current = true;
        }
      }
    }, 60000);
    return () => {
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      clearInterval(id);
    };
  }, [dispatch, navigate]);
  useEffect(() => {
    const id = "G-HF1VRJ6D7P";
    const url = window.location.href;
    const title = document.title || "Resume Builder";
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_location: url,
        page_title: title,
        page_path: location.pathname + location.search,
        send_to: id,
      });
    }
    localStorage.setItem("lastPath", location.pathname + location.search);
  }, [location.pathname, location.search]);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="auth" element={<Login />} />
        <Route path="verify-email/:token" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </>
  );
};

export default App;
