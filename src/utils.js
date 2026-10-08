import { useAuth } from "./auth/AuthContext";

export const STATUS_LABEL = { live: "Live", beta: "Beta", maint: "Maintenance" };

// UI-only convenience. The backend must enforce the same rule on every API call.
export function useCanAccess() {
  const { user } = useAuth();
  return (agent) => user.roles.includes("ADMIN") || agent.roles.some((r) => user.roles.includes(r));
}
