import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="maintenance">
          <div className="maintenance-icon">💥</div>
          <h1>Terjadi Kesalahan</h1>
          <p>Coba refresh halaman ini.</p>
          {import.meta.env.DEV && (
            <pre style={{ fontSize: ".7rem", textAlign: "left", maxWidth: "90vw", overflowX: "auto" }}>
              {String(this.state.error)}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
