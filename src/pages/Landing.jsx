import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import useAgents from "../hooks/useAgents";
import usePins from "../hooks/usePins";
import { useCanAccess } from "../utils";
import { DOMAINS, ROLE_LABELS } from "../data/agentRegistry";
import AgentCard from "../components/AgentCard";
import AgentPanel from "../components/AgentPanel";
import Toast from "../components/Toast";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canAccess = useCanAccess();
  const { agents, attention, loading, error } = useAgents();
  const [pins, togglePin] = usePins();
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");
  const [recent, setRecent] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const bySlug = useMemo(() => Object.fromEntries(agents.map((a) => [a.slug, a])), [agents]);
  const open = useCallback((agent) => {
    setSelected(agent);
    setRecent((r) => [agent.slug, ...r.filter((s) => s !== agent.slug)].slice(0, 4));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents
      .filter((a) => (domain === "all" || a.domain === domain))
      .filter((a) => !q || `${a.name} ${a.description} ${a.subAgents.map((s) => s.name).join(" ")}`.toLowerCase().includes(q))
      .sort((a, b) => canAccess(b) - canAccess(a));
  }, [agents, query, domain, user]); // eslint-disable-line

  const mine = attention.filter((t) => user.roles.includes("ADMIN") || t.roles.some((r) => user.roles.includes(r)));
  const pinned = pins.map((s) => bySlug[s]).filter((a) => a && canAccess(a));
  const recentAgents = recent.map((s) => bySlug[s]).filter((a) => a && canAccess(a));
  const availableCount = agents.filter(canAccess).length;
  const card = (a) => (
    <AgentCard key={a.slug} agent={a} allowed={canAccess(a)} pinned={pins.includes(a.slug)} onOpen={open} onPin={togglePin} />
  );

  if (loading) return <p className="empty">Loading your agents...</p>;
  if (error) return <div className="empty"><p>Could not load agents: {error}</p><button className="btn" onClick={() => window.location.reload()}>Reload</button></div>;

  return (
    <>
      <div className="ctx" role="status">
        <div><span>Shift</span> <b>Day · 06:00–18:00</b></div>
        <div><span>Site</span> <b>PFS3, Indianapolis</b></div>
        <div><span>Active batch</span> <b>E051648 (B6)</b></div>
      </div>
      <h1>Where to, {user.name.split(" ")[0]}?</h1>
      <p className="lead">
        Showing what's relevant for {user.roles.includes("ADMIN") ? "all roles" : ROLE_LABELS[user.roles[0]]}.{" "}
        {availableCount} of {agents.length} agents available to you.
      </p>

      <h2>Needs your attention <small>Items for your role</small></h2>
      <div className="att">
        {mine.length === 0 && <div className="empty">Nothing needs your attention right now.</div>}
        {mine.map((t) => (
          <button key={t.id} onClick={() => bySlug[t.agentSlug] && open(bySlug[t.agentSlug])}>
            <span className="dot" style={{ background: `var(--${t.severity})` }} />
            <span><p>{t.text}</p><small>{bySlug[t.agentSlug]?.name}</small></span>
          </button>
        ))}
      </div>

      {pinned.length > 0 && (<><h2>Pinned <small>Your shortcuts</small></h2><div className="row">{pinned.map(card)}</div></>)}
      {recentAgents.length > 0 && (<><h2>Recently used</h2><div className="row">{recentAgents.map(card)}</div></>)}

      <h2>All agents <small>{visible.length} shown</small></h2>
      <input ref={searchRef} className="searchbox" type="search" placeholder="Search agents, KPIs, batches (Ctrl+K)" aria-label="Search agents" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="chips" role="group" aria-label="Filter by area">
        {["all", ...Object.keys(DOMAINS)].map((d) => (
          <button key={d} className="chip" aria-pressed={domain === d} onClick={() => setDomain(d)}>
            {d === "all" ? "All" : DOMAINS[d]}
          </button>
        ))}
      </div>
      <div className="grid">
        {visible.length === 0 && <div className="empty">No agents match "{query}". Clear the search or pick another area.</div>}
        {visible.map(card)}
      </div>

      {selected && (
        <AgentPanel agent={selected} allowed={canAccess(selected)} onClose={() => setSelected(null)} onMessage={setMsg} />
      )}
      <Toast message={msg} onDone={() => setMsg("")} />
    </>
  );
}
