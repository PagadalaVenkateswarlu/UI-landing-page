import { apiGet, apiPost } from "./client";
import { AGENT_REGISTRY, ATTENTION_ITEMS } from "../data/agentRegistry";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true"
  || (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== "false");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/*
 * Expected backend contract (the backend filters by the user's real permissions):
 * GET  /agents      -> [{ id, slug, name, domain, description, status, subAgents:[{id,name}], dataSources:[..], roles:[..] }]
 * GET  /attention   -> [{ id, text, agentSlug, roles:[..], severity }]
 * POST /agents/:id/access-request  { reason }
 */
export async function fetchAgents(signal) {
  if (USE_MOCK) { await wait(300); return AGENT_REGISTRY; }
  return apiGet("/agents", { signal });
}
export async function fetchAttention(signal) {
  if (USE_MOCK) { await wait(200); return ATTENTION_ITEMS; }
  return apiGet("/attention", { signal });
}
export async function requestAccess(agentId, reason = "") {
  if (USE_MOCK) { await wait(200); return { ok: true }; }
  return apiPost(`/agents/${agentId}/access-request`, { reason });
}
