import "../styles/home.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserTracker from "../components/UserTracker";

export default function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ DELETE FUNCTION (OUTSIDE useEffect)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this report?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/reports/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      setReports(prev => prev.filter(r => r.id !== id));

    } catch (err) {
      console.error(err);
      alert("Error deleting report");
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/reports/approved");
        const data = await res.json();

        if (Array.isArray(data)) {
          setReports(data);
        } else {
          console.error("Invalid response:", data);
          setReports([]);
        }

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

      {/* USER TRACKING */}
      {currentUser?.role === "user" && <UserTracker />}

      <div className="home-root">
        <div className="home-container">

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
                    alt={r.district}
                  />

                  {/* ✅ ADMIN DELETE BUTTON */}
                  {currentUser?.role === "admin" && (
                    <button onClick={() => handleDelete(r.id)}>
                      🗑 Delete
                    </button>
                  )}

                  <div className="report-body">
                    <h3>{r.district}</h3>

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
                        ❤️ {r.peopleHelped || 0} helped
                      </span>
                    </div>

                    <div style={{ marginTop: "10px", fontSize: "13px" }}>
                      📊 Requests: {r.totalRequests || 0} <br />
                      ✅ Accepted: {r.acceptedRequests || 0} <br />
                      👥 Needed: {r.totalPeopleRequested || 0}
                    </div>

                    <div style={{ marginTop: "8px", fontSize: "13px" }}>
                      🚁 Rescue: {r.rescueCount || 0} <br />
                      🍱 Food: {r.foodCount || 0} <br />
                      💊 Medicine: {r.medicineCount || 0}
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

          {currentUser?.role === "user" && (
            <section className="sos-banner">
              <div>
                <h3>In an Emergency?</h3>
                <p>Teams are tracking in real-time.</p>
              </div>

              <Link to="/need-help" className="btn-emergency">
                GET HELP NOW
              </Link>
            </section>
          )}

        </div>
      </div>
    </>
  );
}