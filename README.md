# UI-landing-page (PTOF Agents Console)

## Run
npm install
cp .env.example .env.local
npm run dev        # http://localhost:5173 (mock data)
npm run build      # outputs dist/ for any static host / container

Local development uses mock data unless `VITE_USE_MOCK=false` is explicitly set.
Set it to `false` only when the backend is running at `http://localhost:8080`.

## Structure
src/api/        API client + agent endpoints (mock switch via VITE_USE_MOCK)
src/auth/       AuthContext + ProtectedRoute (replace mock with SSO)
src/components/ Header, AgentCard, AgentPanel, Layout, ErrorBoundary, Toast
src/data/       Mock agent registry (production: GET /agents)
src/hooks/      useAgents, usePins, useIdleTimeout
src/pages/      Landing, AgentPage, NoAccess, SignedOut
src/styles/     app.css (theme tokens, light/dark)

## Before production
1. Replace mock auth in AuthContext with SSO (Azure AD/Okta); use httpOnly cookies, not localStorage tokens.
2. Backend must enforce roles on every API call; UI filtering is convenience only.
3. Set VITE_USE_MOCK=false and implement the API contract in src/api/agentsApi.js.
4. Remove the dev-only "View as" switcher (already hidden in production builds).
5. Add security headers (CSP, HSTS), audit logging, e-signature for GxP sign-offs.
6. Wire ErrorBoundary to your error tracker; add CI (lint, tests, npm audit) and Docker/K8s deploy.
