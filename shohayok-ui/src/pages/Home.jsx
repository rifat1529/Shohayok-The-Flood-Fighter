import "../styles/home.css"; 
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Login kora user-er data check kora ---
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/requests");
        const data = await response.json();
        setReports(data.length > 0 ? data : STATIC_REPORTS);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports(STATIC_REPORTS);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <>
      

      <div className="home-root">
        <div className="home-container">

          <header className="hero">
            <div className="hero-content">
              <span style={{color: '#ef4444', letterSpacing: '4px', fontSize: '13px', fontWeight: '700'}}>SHOHAYOK v2.0 // LIVE</span>
              <h1 className="hero-heading">Rescue.<br /><span>Respond.</span><br />Recover.</h1>
              <p style={{color: '#94a3b8', marginBottom: '32px', fontSize: '18px'}}>Bangladesh's coordination network for real-time flood relief and emergency rescue.</p>
              <div className="hero-actions">
                <Link to="/map" className="btn-primary">View Live Map</Link>
              </div>
            </div>
            <div className="stat-card" style={{background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #ef4444', padding: '30px', borderRadius: '24px', textAlign: 'center'}}>
              <span style={{fontSize: '52px', color: '#ef4444', fontWeight: '800', display: 'block'}}>34</span>
              <span style={{fontSize: '11px', color: '#64748b', letterSpacing: '2px'}}>ACTIVE REQUESTS</span>
            </div>
          </header>

          <h2 style={{marginBottom: '24px', color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px'}}>Latest Operations</h2>
          
          <div className="reports-grid">
            {reports.map((r) => (
              <div key={r.id} className="report-card">
                <img className="report-img" src={r.img || "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80"} alt={r.area} />
                <div className="report-body">
                  <h3 style={{fontSize: '24px', fontWeight: '700', marginBottom: '8px'}}>{r.area}</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '14px'}}>
                    <span>{r.date || "Just now"}</span>
                    <span style={{color: '#4ade80', fontWeight: '600'}}>+{r.rescued || 0} Rescued</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="sos-banner">
            <div>
              <h3 style={{fontSize: '32px', fontWeight: '800', marginBottom: '8px'}}>In an Emergency?</h3>
              <p style={{fontSize: '16px', opacity: '0.9'}}>Don't wait. Our rescue teams are monitoring the network 24/7.</p>
            </div>
            {/* Ekhane currentUser pass kora hochche auto-fill er jonno */}
            <Link 
              to="/need-help" 
              state={{ userData: currentUser }} 
              className="btn-emergency"
            >
              GET HELP NOW
            </Link>
          </section>

        </div>
      </div>
    </>
  );
}

const STATIC_REPORTS = [
  { id: 1, area: "Sylhet", date: "12 Jan 2026", rescued: 120, img: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80" },
  { id: 2, area: "Sunamganj", date: "08 Jan 2026", rescued: 84, img: "https://images.unsplash.com/photo-1597435877854-a2c66f28da2f?w=600&q=80" },
];