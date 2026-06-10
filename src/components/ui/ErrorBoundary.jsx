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
          <div className="maintenance-icon">⚠️</div>
          <h1>Ups, terjadi kesalahan</h1>
          <p>{import.meta.env.DEV ? String(this.state.error) : "Coba muat ulang halaman."}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              background: "linear-gradient(135deg, #D97706, #F97316)",
              color: "#fff", border: "none", borderRadius: 50,
              padding: "10px 28px", fontWeight: 600, fontSize: ".9rem", cursor: "pointer",
            }}>
            Muat Ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
