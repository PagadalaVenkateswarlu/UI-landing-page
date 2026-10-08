import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import useAgents from "../hooks/useAgents";
import { useCanAccess } from "../utils";

/*
 * Shell for every agent. Real agent UIs plug in here, lazy-loaded per slug, e.g.:
 *   const MODULES = { "dynamic-scheduling": lazy(() => import("../agents/dynamicScheduling")) };
 * Backend must still authorize every data call; this check only decides what to show.
 */
export default function AgentPage() {
  const { slug } = useParams();
  const { agents, loading } = useAgents();
  const canAccess = useCanAccess();

  if (loading) return <p className="empty">Loading agent...</p>;
  const agent = agents.find((a) => a.slug === slug);
  if (!agent) return <div className="empty"><p>We couldn't find that agent.</p><Link to="/" className="btn">Back to landing</Link></div>;
  if (!canAccess(agent)) return <Navigate to="/no-access" replace />;

  return (
    <>
      <p><Link to="/">← Landing</Link></p>
      <h1>{agent.name}</h1>
      <p className="lead">{agent.description}</p>
      <h2>Sub-agents</h2>
      <div className="grid">
        {agent.subAgents.map((s) => (
          <div key={s.id} className="card"><h3>{s.name}</h3><p>Sources: {agent.dataSources.join(", ")}</p></div>
        ))}
      </div>
    </>
  );
}
