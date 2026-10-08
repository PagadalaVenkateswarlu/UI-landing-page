import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function SignedOut() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const signIn = () => { login(); navigate("/"); };
  return (
    <div className="signedout">
      <h1>You're signed out</h1>
      <p className="lead">Your session was closed.</p>
      <button className="btn" onClick={signIn}>Sign in with SSO</button>
    </div>
  );
}
