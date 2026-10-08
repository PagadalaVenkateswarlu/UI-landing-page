import React from "react";

// One failing agent must not crash the whole console.
export default class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error, info) {
    // PRODUCTION: send to your error tracker (Sentry, App Insights).
    console.error("Agent crashed", error, info);
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="empty">
          <p>This agent failed to load. Other agents are not affected.</p>
          <button className="btn" onClick={() => this.setState({ failed: false })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
