import React from "react";
import { STATUS_LABEL } from "../utils";

export default function AgentCard({ agent, allowed, pinned, onOpen, onPin }) {
  const open = () => onOpen(agent);
  return (
    <div
      className={`card${allowed ? "" : " lock"}`}
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
      aria-label={`${agent.name}${allowed ? "" : " (no access)"}`}
    >
      <button
        className="pin"
        aria-pressed={pinned}
        aria-label={`Pin ${agent.name}`}
        onClick={(e) => { e.stopPropagation(); onPin(agent.slug); }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {pinned ? "★" : "☆"}
      </button>
      <h3>{agent.name}</h3>
      <p>{agent.description}</p>
      <div className="meta">
        <span className={`st ${agent.status}`}><i />{STATUS_LABEL[agent.status]}</span>
        {allowed ? <span>{agent.subAgents.length} sub-agents</span> : <span>Request access</span>}
      </div>
    </div>
  );
}
