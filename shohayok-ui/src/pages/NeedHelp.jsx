import { useState } from "react";
import Navbar from "../components/Navbar";

export default function NeedHelp() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", district: "", subDistrict: "", village: "", trapped: "", need: "" });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (submitted) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
          .nh-root { min-height:100vh; background:#0a0c10; font-family:'Rajdhani',sans-serif; color:#e2e8f0; }
          .nh-center { display:flex; align-items:center; justify-content:center; min-height:calc(100vh - 64px); padding:24px; }
          .success-card { max-width:420px; width:100%; background:rgba(255,255,255,0.03); border:1px solid rgba(34,197,94,0.25); border-radius:20px; padding:48px 36px; text-align:center; }
          .success-icon { font-size:60px; margin-bottom:16px; }
          .success-title { font-size:28px; font-weight:700; color:#4ade80; margin-bottom:10px; }
          .success-sub { font-size:15px; color:#475569; line-height:1.7; margin-bottom:28px; }
          .success-id { font-family:'Share Tech Mono',monospace; font-size:13px; color:#334155; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:10px 16px; margin-bottom:28px; }
          .success-id span { color:#818cf8; }
          .back-btn { background:linear-gradient(135deg,#059669,#10b981); color:white; border:none; border-radius:10px; padding:13px 32px; font-size:15px; font-weight:700; font-family:'Rajdhani',sans-serif; letter-spacing:1.5px; cursor:pointer; }
        `}</style>
        <div className="nh-root">
          <Navbar />
          <div className="nh-center">
            <div className="success-card">
              <div className="success-icon">✅</div>
              <div className="success-title">Request Submitted</div>
              <div className="success-sub">Your emergency request is now in our system. Our response team will reach you as soon as possible.</div>
              <div className="success-id">Request ID: <span>#REQ-{Math.floor(Math.random() * 90000) + 10000}</span></div>
              <button className="back-btn" onClick={() => setSubmitted(false)}>Submit Another</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        .nh-root {
          min-height: 100vh;
          background: #0a0c10;
          background-image: radial-gradient(ellipse 70% 40% at 50% 0%, rgba(220,38,38,0.07) 0%, transparent 60%);
          font-family: 'Rajdhani', sans-serif;
          color: #e2e8f0;
          padding-bottom: 60px;
        }

        .nh-center {
          display: flex;
          justify-content: center;
          padding: 36px 20px;
        }

        .nh-card {
          width: 100%;
          max-width: 500px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
        }

        .nh-card-top {
          background: linear-gradient(135deg, rgba(220,38,38,0.18), rgba(220,38,38,0.06));
          border-bottom: 1px solid rgba(220,38,38,0.2);
          padding: 28px 32px;
        }

        .nh-eyebrow {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #ef4444;
          letter-spacing: 3px;
          margin-bottom: 6px;
        }

        .nh-title {
          font-size: 30px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 4px;
        }

        .nh-sub {
          font-size: 13px;
          color: #64748b;
        }

        .nh-body {
          padding: 28px 32px;
        }

        /* Toggle */
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 24px;
          cursor: pointer;
        }

        .toggle-label {
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }

        .toggle-switch {
          width: 44px; height: 24px;
          border-radius: 100px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          position: relative;
          transition: background 0.2s;
        }

        .toggle-switch.on {
          background: rgba(99,102,241,0.3);
          border-color: rgba(99,102,241,0.4);
        }

        .toggle-knob {
          position: absolute;
          top: 3px; left: 3px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #475569;
          transition: transform 0.2s, background 0.2s;
        }

        .toggle-switch.on .toggle-knob {
          transform: translateX(20px);
          background: #818cf8;
        }

        /* Fields */
        .field-section {
          margin-bottom: 20px;
        }

        .field-section-title {
          font-size: 10px;
          font-family: 'Share Tech Mono', monospace;
          color: #475569;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .nh-label {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #64748b;
          letter-spacing: 2px;
          margin-bottom: 6px;
          display: block;
        }

        .nh-input, .nh-select {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 15px;
          font-family: 'Rajdhani', sans-serif;
          color: #e2e8f0;
          outline: none;
          box-sizing: border-box;
          margin-bottom: 12px;
          transition: border-color 0.2s;
          appearance: none;
        }

        .nh-input::placeholder { color: #334155; }
        .nh-input:focus, .nh-select:focus { border-color: rgba(239,68,68,0.4); }
        .nh-select option { background: #1e293b; }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 12px;
        }

        /* Submit */
        .nh-submit {
          width: 100%;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px;
          font-size: 17px;
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 2px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 8px;
        }

        .nh-submit:hover { opacity: 0.88; transform: scale(1.01); }

        .register-hint {
          text-align: center;
          font-size: 13px;
          color: #475569;
          margin-top: 16px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.5px;
        }

        .register-hint a {
          color: #818cf8;
          text-decoration: none;
        }
      `}</style>

      <div className="nh-root">
        <Navbar />
        <div className="nh-center">
          <div className="nh-card">
            <div className="nh-card-top">
              <p className="nh-eyebrow">🚨 EMERGENCY REQUEST</p>
              <h2 className="nh-title">Need Help?</h2>
              <p className="nh-sub">Fill this form to request emergency rescue or relief.</p>
            </div>

            <div className="nh-body">
              {/* Toggle */}
              <div className="toggle-row" onClick={() => setIsRegistered(!isRegistered)}>
                <span className="toggle-label">Already Registered?</span>
                <div className={`toggle-switch ${isRegistered ? "on" : ""}`}>
                  <div className="toggle-knob" />
                </div>
              </div>

              {/* Personal info (only if not registered) */}
              {!isRegistered && (
                <div className="field-section">
                  <p className="field-section-title">Personal Information</p>
                  <div className="input-grid">
                    <div>
                      <label className="nh-label">FULL NAME</label>
                      <input className="nh-input" placeholder="Your name" value={form.name} onChange={set("name")} />
                    </div>
                    <div>
                      <label className="nh-label">PHONE</label>
                      <input className="nh-input" placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} />
                    </div>
                  </div>
                  <label className="nh-label">DISTRICT</label>
                  <input className="nh-input" placeholder="e.g. Sunamganj" value={form.district} onChange={set("district")} />
                  <div className="input-grid">
                    <div>
                      <label className="nh-label">SUB-DISTRICT</label>
                      <input className="nh-input" placeholder="Upazila" value={form.subDistrict} onChange={set("subDistrict")} />
                    </div>
                    <div>
                      <label className="nh-label">VILLAGE</label>
                      <input className="nh-input" placeholder="Village name" value={form.village} onChange={set("village")} />
                    </div>
                  </div>
                </div>
              )}

              {/* Situation */}
              <div className="field-section">
                <p className="field-section-title">Situation Details</p>
                <label className="nh-label">PEOPLE TRAPPED</label>
                <input className="nh-input" placeholder="e.g. 6" type="number" value={form.trapped} onChange={set("trapped")} />
                <label className="nh-label">MAIN NEED</label>
                <select className="nh-select" value={form.need} onChange={set("need")}>
                  <option value="">Select type of help</option>
                  <option value="rescue">🚁 Rescue</option>
                  <option value="food">🍱 Food</option>
                  <option value="medicine">💊 Medicine</option>
                  <option value="shelter">🏕 Safe Shelter</option>
                </select>
              </div>

              <button className="nh-submit" onClick={() => setSubmitted(true)}>
                🚨 SUBMIT HELP REQUEST
              </button>

              {!isRegistered && (
                <p className="register-hint">
                  Want faster help next time? <a href="/register">Complete registration →</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
