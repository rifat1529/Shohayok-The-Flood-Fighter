import "../styles/home.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserTracker from "../components/UserTracker";

export default function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/reports/approved");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
      <Navbar />

      {/* 🔥 USER LOCATION TRACKER */}
      {currentUser?.role === "user" && <UserTracker />}

      <div className="home-root">
        <div className="home-container">

          {/* HERO */}
          <header className="hero">
            <div className="hero-content">
              <span style={{ color: "#ef4444" }}>
                SHOHAYOK v2.0 // LIVE
              </span>

              <h1 className="hero-heading">
                Rescue.<br />
                <span>Respond.</span><br />
                Recover.
              </h1>

              <div className="hero-actions">
                <Link to="/map" className="btn-primary">
                  🗺️ View Live Map
                </Link>
              </div>
            </div>
          </header>

          {/* POSTS */}
          <h2>Latest Operations</h2>

          <div className="reports-grid">
            {loading ? (
              <p>Loading...</p>
            ) : reports.length === 0 ? (
              <p>No reports published yet</p>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="report-card">

                  <img
                    src={
                      r.image ||
                      "https://images.unsplash.com/photo-1547683905-f686c993aae5"
                    }
                    alt={r.area}
                  />

                  <div className="report-body">
                    <h3>{r.area}</h3>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      color: "#94a3b8"
                    }}>
                      <span>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>

                      <span style={{ color: "#4ade80" }}>
                        +{r.peopleHelped} helped
                      </span>
                    </div>

                    <div style={{ marginTop: "8px" }}>
                      <span className="badge">
                        {r.helpType}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* USER SOS */}
          {currentUser?.role === "user" && (
            <section className="sos-banner">
              <div>
                <h3>In an Emergency?</h3>
                <p>Teams are tracking in real-time.</p>
              </div>

              <Link
                to="/need-help"
                className="btn-emergency"
              >
                GET HELP NOW
              </Link>
            </section>
          )}

        </div>
      </div>
    </>
  );
}