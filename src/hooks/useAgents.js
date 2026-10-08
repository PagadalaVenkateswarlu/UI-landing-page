import { useEffect, useState } from "react";
import { fetchAgents, fetchAttention } from "../api/agentsApi";

// Loads agents + attention items once. Aborts on unmount.
export default function useAgents() {
  const [state, setState] = useState({ agents: [], attention: [], loading: true, error: null });

  useEffect(() => {
    const ctrl = new AbortController();
    Promise.all([fetchAgents(ctrl.signal), fetchAttention(ctrl.signal)])
      .then(([agents, attention]) => setState({ agents, attention, loading: false, error: null }))
      .catch((err) => {
        if (err.name !== "AbortError") setState((s) => ({ ...s, loading: false, error: err.message }));
      });
    return () => ctrl.abort();
  }, []);

  return state;
}
