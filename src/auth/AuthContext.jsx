import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

/*
 * AuthContext: single place the UI asks "who is this and what can they do?"
 * MOCK mode below is for local dev only.
 * PRODUCTION: replace login/logout with your SSO (Azure AD / Okta) using
 * oidc-client-ts or MSAL, with httpOnly secure session cookies set by your backend.
 * Never trust roles from the browser: the API must enforce access on every call.
 */
const AuthContext = createContext(null);

const MOCK_USER = {
  id: "u-1001",
  name: "Venkat",
  initials: "MN",
  shift: "Day Shift",
  roles: ["MANUFACTURING"], // MANUFACTURING | QUALITY | SUPPLY | ENGINEERING | COMMERCIAL | ADMIN
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER); // PRODUCTION: start null, load from /api/me

  const logout = useCallback(() => {
    // PRODUCTION: call backend /auth/logout (revoke session) then redirect to IdP logout.
    setUser(null);
  }, []);

  const login = useCallback(() => {
    // PRODUCTION: redirect to SSO authorize endpoint.
    setUser(MOCK_USER);
  }, []);

  // Dev helper only: lets you preview other roles. Remove in production builds.
  const switchRole = useCallback((role) => setUser((u) => (u ? { ...u, roles: [role] } : u)), []);

  const value = useMemo(() => ({ user, login, logout, switchRole }), [user, login, logout, switchRole]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
