import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import NoAccess from "./pages/NoAccess";
import SignedOut from "./pages/SignedOut";

// Each agent is lazy-loaded so the landing page stays fast with 26+ agents.
// Map agent route -> real agent module. Unmapped agents use the placeholder page.
const AgentPage = lazy(() => import("./pages/AgentPage"));

export default function App() {
  return (
    <Routes>
      <Route path="/signed-out" element={<SignedOut />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Landing />} />
        <Route
          path="agents/:slug/*"
          element={
            <ErrorBoundary>
              <Suspense fallback={<p className="empty">Loading agent...</p>}>
                <AgentPage />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route path="no-access" element={<NoAccess />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
