import React, { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Toast from "./Toast";
import { useAuth } from "../auth/AuthContext";
import useIdleTimeout from "../hooks/useIdleTimeout";

const IDLE_MIN = Number(import.meta.env.VITE_IDLE_MINUTES || 15);

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const signOut = useCallback(() => { logout(); navigate("/signed-out"); }, [logout, navigate]);
  const warn = useCallback(() => setMsg("You will be signed out in 1 minute due to inactivity."), []);
  useIdleTimeout({ minutes: IDLE_MIN, onWarn: warn, onTimeout: signOut });

  return (
    <>
      <Header onSignOut={signOut} />
      <main className="main"><Outlet /></main>
      <footer className="footer">
        <span>Environment: {import.meta.env.VITE_ENV_LABEL || "Production"}</span>
        <span>v2.4.1</span>
        <span>All activity is logged for audit</span>
        <span>Session ends after {IDLE_MIN} min idle</span>
      </footer>
      <Toast message={msg} onDone={() => setMsg("")} />
    </>
  );
}
