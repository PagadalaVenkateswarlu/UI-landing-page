import React from "react";
import { Link } from "react-router-dom";

export default function NoAccess() {
  return (
    <div className="empty">
      <h1>You don't have access to this agent</h1>
      <p>Request access from the landing page and your manager will be notified.</p>
      <Link to="/" className="btn">Back to landing</Link>
    </div>
  );
}
