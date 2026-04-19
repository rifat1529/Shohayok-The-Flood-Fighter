import { useState, useEffect } from "react"; // Data fetch korar jonno
import { Link } from "react-router-dom";

export default function Home() {
  const [reports, setReports] = useState([]); // Database theke data ekhane thakbe
  const [loading, setLoading] = useState(true);

  // --- Database theke data fetch korar logic ---
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Apnar backend API URL (e.g., http://localhost:5000/requests)
        const response = await fetch("http://localhost:5000/requests");
        const data = await response.json();
        
        // Jodi backend-e data thake tobe seta set korbe, na thakle default/static data dekhabe
        setReports(data.length > 0 ? data : STATIC_REPORTS);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports(STATIC_REPORTS); // Error hoile static data dekhabe
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

        .home-root {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, #1a1c24 0%, #0a0c10 100%);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f8fafc;
          padding-bottom: 80px;
        }

        .home-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .hero {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px;
          padding: 60px;
          margin-bottom: 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
        }

        .hero-content { z-index: 2; max-width: 600px; }

        .hero-heading {
          font-size: 64px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .hero-heading span {
          background: linear-gradient(90deg, #ef4444, #f87171);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-primary {
          background: #ef4444;
          color: white;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          transition: 0.3s;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 56px;
        }

        .report-card {
          background: #16181d;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          transition: 0.3s;
        }

        .report-img { width: 100%; height: 200px; object-fit: cover; }
        .report-body { padding: 24px; }

        .sos-banner {
          background: linear-gradient(90deg, #7f1d1d 0%, #ef4444 100%);
          border-radius: 24px;
          padding: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-emergency {
          background: white;
          color: #ef4444;
          padding: 18px 40px;
          border-radius: 16px;
          font-weight: 800;
          text-decoration: none;
        }
      `}</style>

      <div className="home-root">
        {/* Navbar bad deya hoyeche ReferenceError fix korar jonno */}
        <div className="home-container">

          <header className="hero">
            <div className="hero-content">
              <span style={{color: '#ef4444', letterSpacing: '4px', fontSize: '13px'}}>SHOHAYOK v2.0</span>
              <h1 className="hero-heading">Rescue.<br /><span>Respond.</span><br />Recover.</h1>
              <p style={{color: '#94a3b8', marginBottom: '32px'}}>Real-time coordination network for flood relief operations in Bangladesh.</p>
              <div className="hero-actions">
                <Link to="/map" className="btn-primary">View Live Map</Link>
              </div>
            </div>
            <div className="stat-card" style={{border: '1px solid #ef4444', padding: '20px', borderRadius: '20px'}}>
              <span style={{fontSize: '48px', color: '#ef4444', fontWeight: '800'}}>34</span><br/>
              <span style={{fontSize: '12px', color: '#64748b'}}>ACTIVE REQUESTS</span>
            </div>
          </header>

          <h2 style={{marginBottom: '20px', color: '#64748b', fontSize: '14px', textTransform: 'uppercase'}}>Latest Operations</h2>
          
          <div className="reports-grid">
            {reports.map((r) => (
              <div key={r.id} className="report-card">
                <img className="report-img" src={r.img || "https://via.placeholder.com/600x400"} alt={r.area} />
                <div className="report-body">
                  <h3 style={{fontSize: '24px', marginBottom: '8px'}}>{r.area}</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', color: '#64748b'}}>
                    <span>{r.date}</span>
                    <span style={{color: '#4ade80'}}>+{r.rescued} Rescued</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="sos-banner">
            <div>
              <h3 style={{fontSize: '32px', fontWeight: '800'}}>In an Emergency?</h3>
              <p>Request immediate help from our rescue teams.</p>
            </div>
            <Link to="/need-help" className="btn-emergency">GET HELP NOW</Link>
          </section>

        </div>
      </div>
    </>
  );
}

// Static fallback data
const STATIC_REPORTS = [
  { id: 1, area: "Sylhet", date: "12 Jan 2026", rescued: 120, img: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80", tag: "Flood Relief" },
  { id: 2, area: "Sunamganj", date: "08 Jan 2026", rescued: 84, img: "https://images.unsplash.com/photo-1597435877854-a2c66f28da2f?w=600&q=80", tag: "Rescue Op" },
];