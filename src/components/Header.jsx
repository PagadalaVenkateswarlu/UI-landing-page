import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ROLE_LABELS } from "../data/agentRegistry";

export default function Header({ onSignOut }) {
  const { user, switchRole } = useAuth();
  const dev = import.meta.env.DEV; // role switcher shows only in dev builds
  const toggleTheme = () => {
    const el = document.documentElement;
    el.setAttribute("data-theme", el.getAttribute("data-theme") === "dark" ? "light" : "dark");
  };
  return (
    <header className="header">
      <Link to="/" className="brand">
        <b>Process Team of the Future</b>
        <span>Manufacturing · Agents Console</span>
      </Link>
      {dev && (
        <label className="viewas">View as{" "}
          <select value={user.roles[0]} onChange={(e) => switchRole(e.target.value)}>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      )}
      <button className="ib" onClick={toggleTheme} aria-label="Toggle light or dark theme">Theme</button>
      <div className="user">
        <div className="av">{user.initials}</div>
        <div>{user.name}<small>{user.shift} · SSO verified</small></div>
      </div>
      <button className="ib" onClick={onSignOut}>Sign out</button>
    </header>
  );
}
