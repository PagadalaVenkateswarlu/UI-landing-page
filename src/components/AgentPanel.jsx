import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DOMAINS } from "../data/agentRegistry";
import { requestAccess } from "../api/agentsApi";
import { STATUS_LABEL } from "../utils";

export default function AgentPanel({ agent, allowed, onClose, onMessage }) {
  const navigate = useNavigate();
  const closeRef = useRef(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const go = async () => {
    if (allowed) { navigate(`/agents/${agent.slug}`); return; }
    setBusy(true);
    try { await requestAccess(agent.id); onMessage(`Access request sent for ${agent.name}`); onClose(); }
    catch (e) { onMessage("Could not send the request. Try again."); }
    finally { setBusy(false); }
  };

  return (
    <aside className="panel open" aria-label="Agent details">
      <button ref={closeRef} className="ib dark" onClick={onClose}>Close</button>
      <h3>{agent.name}</h3>
      <span className={`st ${agent.status}`}><i />{STATUS_LABEL[agent.status]}</span>
      <p className="lead">{agent.description}</p>
      <h4>Sub-agents</h4>
      <ul>
        {agent.subAgents.map((s) => (
          <li key={s.id}>{s.name}<span className="lockb">{allowed ? "Open" : "Locked"}</span></li>
        ))}
      </ul>
      <h4>Data sources</h4>
      <p>{agent.dataSources.join(", ")}</p>
      <h4>Access</h4>
      <p>{DOMAINS[agent.domain]} · {allowed ? "You have access" : "Needs approval from your manager"}. Opens are logged for audit.</p>
      <button className="btn" onClick={go} disabled={busy}>{allowed ? `Open ${agent.name}` : "Request access"}</button>
      <button className="btn sec" onClick={onClose}>Cancel</button>
    </aside>
  );
}
