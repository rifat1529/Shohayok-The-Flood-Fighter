import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const REPORTS = [
  { id: 1, area: "Sylhet", date: "12 Jan 2026", rescued: 120, img: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80", tag: "Flood Relief" },
  { id: 2, area: "Sunamganj", date: "08 Jan 2026", rescued: 84, img: "https://images.unsplash.com/photo-1597435877854-a2c66f28da2f?w=600&q=80", tag: "Rescue Op" },
];

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        .home-root {
          min-height: 100vh;
          background: #0a0c10;
          font-family: 'Rajdhani', sans-serif;
          color: #e2e8f0;
          padding-bottom: 60px;
        }

        .home-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 36px 24px;
        }

        /* Hero */
        .hero {
          position: relative;
          background: linear-gradient(135deg, rgba(220,38,38,0.12), rgba(15,23,42,0.8));
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 20px;
          padding: 40px 36px;
          margin-bottom: 36px;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 80% 50%, rgba(220,38,38,0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .hero-eyebrow {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #ef4444;
          letter-spacing: 3px;
          margin-bottom: 10px;
        }

        .hero-heading {
          font-size: 48px;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1.05;
          margin-bottom: 14px;
          letter-spacing: 1px;
        }

        .hero-heading span {
          color: #ef4444;
        }

        .hero-sub {
          font-size: 16px;
          color: #64748b;
          max-width: 440px;
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-map {
          display: flex; align-items: center; gap: 8px;
          background: rgba(34,197,94,0.12);
          color: #4ade80;
          border: 1px solid rgba(34,197,94,0.3);
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1.5px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-map:hover { background: rgba(34,197,94,0.2); }

        .btn-chat {
          display: flex; align-items: center; gap: 8px;
          background: rgba(99,102,241,0.12);
          color: #818cf8;
          border: 1px solid rgba(99,102,241,0.3);
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1.5px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-chat:hover { background: rgba(99,102,241,0.2); }

        .hero-badge {
          position: absolute;
          top: 28px; right: 28px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #64748b;
          text-align: right;
        }

        .hero-badge .big {
          font-size: 36px;
          color: #ef4444;
          font-weight: 700;
          display: block;
          line-height: 1;
        }

        /* Reports */
        .section-title {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #64748b;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-bottom: 36px;
        }

        .report-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }

        .report-card:hover {
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-2px);
        }

        .report-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
          filter: brightness(0.65) saturate(0.8);
        }

        .report-body {
          padding: 16px 18px;
        }

        .report-tag {
          font-size: 10px;
          font-family: 'Share Tech Mono', monospace;
          color: #ef4444;
          letter-spacing: 2px;
          margin-bottom: 6px;
        }

        .report-area {
          font-size: 20px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 4px;
        }

        .report-meta {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #64748b;
          font-family: 'Share Tech Mono', monospace;
        }

        .report-meta strong {
          color: #4ade80;
          font-size: 15px;
        }

        /* Need Help CTA */
        .need-help-cta {
          position: relative;
          background: linear-gradient(135deg, rgba(220,38,38,0.2), rgba(239,68,68,0.08));
          border: 1px solid rgba(220,38,38,0.35);
          border-radius: 16px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          overflow: hidden;
        }

        .need-help-cta::after {
          content: '🚨';
          position: absolute;
          right: 140px;
          font-size: 80px;
          opacity: 0.08;
        }

        .cta-text h3 {
          font-size: 24px;
          font-weight: 700;
          color: #fca5a5;
          margin-bottom: 4px;
        }

        .cta-text p {
          font-size: 14px;
          color: #64748b;
        }

        .btn-need-help {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 36px;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 2px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .btn-need-help:hover {
          background: #dc2626;
          transform: scale(1.03);
        }
      `}</style>

      <div className="home-root">
        <Navbar />
        <div className="home-container">

          {/* Hero */}
          <div className="hero">
            <p className="hero-eyebrow">// DISASTER RESPONSE NETWORK</p>
            <h1 className="hero-heading">Rescue.<br /><span>Respond.</span><br />Recover.</h1>
            <p className="hero-sub">Real-time coordination for flood relief and emergency rescue across Bangladesh.</p>
            <div className="hero-actions">
              <Link to="/map" className="btn-map">🗺 Map View</Link>
              <Link to="/chat" className="btn-chat">💬 Chat</Link>
            </div>
            <div className="hero-badge">
              <span className="big">34</span>
              ACTIVE REQUESTS
            </div>
          </div>

          {/* Reports */}
          <p className="section-title">Recent Rescue Reports</p>
          <div className="reports-grid">
            {REPORTS.map((r) => (
              <div key={r.id} className="report-card">
                <img className="report-img" src={r.img} alt={r.area} />
                <div className="report-body">
                  <p className="report-tag">{r.tag}</p>
                  <p className="report-area">{r.area}</p>
                  <div className="report-meta">
                    <span>📅 {r.date}</span>
                    <span>👥 <strong>{r.rescued}</strong> rescued</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Need Help CTA */}
          <div className="need-help-cta">
            <div className="cta-text">
              <h3>Are you in danger?</h3>
              <p>Request emergency rescue immediately. We're here 24/7.</p>
            </div>
            <Link to="/need-help" className="btn-need-help">NEED HELP</Link>
          </div>

        </div>
      </div>
    </>
  );
}
