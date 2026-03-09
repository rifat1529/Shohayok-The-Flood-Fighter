import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        .login-root {
          min-height: 100vh;
          background: #0a0c10;
          background-image: radial-gradient(ellipse 60% 50% at 30% 50%, rgba(99,102,241,0.07) 0%, transparent 60%);
          font-family: 'Rajdhani', sans-serif;
          color: #e2e8f0;
        }

        .login-layout {
          display: flex;
          min-height: calc(100vh - 64px);
        }

        /* Left Panel */
        .login-left {
          flex: 1;
          display: none;
          background: linear-gradient(160deg, rgba(99,102,241,0.12) 0%, rgba(220,38,38,0.06) 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 60px 48px;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        @media(min-width: 768px) { .login-left { display: flex; } }

        .login-left::before {
          content: '';
          position: absolute;
          bottom: -100px; right: -100px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: rgba(220,38,38,0.05);
        }

        .left-tag {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #6366f1;
          letter-spacing: 3px;
          margin-bottom: 20px;
        }

        .left-heading {
          font-size: 44px;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .left-heading span { color: #ef4444; }

        .left-desc {
          font-size: 15px;
          color: #475569;
          line-height: 1.7;
          max-width: 360px;
          margin-bottom: 40px;
        }

        .left-stats {
          display: flex;
          gap: 28px;
        }

        .stat {
          border-left: 2px solid rgba(99,102,241,0.3);
          padding-left: 14px;
        }

        .stat .num {
          font-size: 28px;
          font-weight: 700;
          color: #818cf8;
          font-family: 'Share Tech Mono', monospace;
        }

        .stat .lbl {
          font-size: 11px;
          color: #475569;
          letter-spacing: 1px;
        }

        /* Right / Form Panel */
        .login-right {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 36px 28px;
        }

        .login-form {
          width: 100%;
        }

        .form-icon {
          width: 50px; height: 50px;
          background: rgba(99,102,241,0.15);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          margin-bottom: 20px;
        }

        .form-tag {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #6366f1;
          letter-spacing: 3px;
          margin-bottom: 6px;
        }

        .form-heading {
          font-size: 32px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 28px;
        }

        .field-label {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #64748b;
          letter-spacing: 2px;
          margin-bottom: 7px;
          display: block;
        }

        .field-wrap {
          position: relative;
          margin-bottom: 18px;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 15px;
          font-family: 'Rajdhani', sans-serif;
          color: #e2e8f0;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .field-input::placeholder { color: #334155; }
        .field-input:focus { border-color: rgba(99,102,241,0.4); }

        .toggle-pass {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
        }

        .forgot-link {
          display: block;
          text-align: right;
          font-size: 13px;
          color: #6366f1;
          text-decoration: none;
          margin-bottom: 22px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }

        .forgot-link:hover { color: #818cf8; }

        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 14px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 2px;
          cursor: pointer;
          transition: opacity 0.2s;
          margin-bottom: 20px;
        }

        .login-btn:hover { opacity: 0.85; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .divider hr {
          flex: 1;
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .divider span {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #334155;
          letter-spacing: 1px;
        }

        .register-row {
          text-align: center;
          font-size: 14px;
          color: #475569;
        }

        .register-row a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 600;
        }

        .register-row a:hover { color: #a5b4fc; }
      `}</style>

      <div className="login-root">
        <Navbar />
        <div className="login-layout">

          {/* Left decorative panel */}
          <div className="login-left">
            <p className="left-tag">// RESCUE NETWORK</p>
            <h2 className="left-heading">Coordinate.<br />Respond.<br /><span>Save Lives.</span></h2>
            <p className="left-desc">
              Bangladesh's emergency response platform — connecting those in need with rescue teams in real-time.
            </p>
            <div className="left-stats">
              <div className="stat">
                <div className="num">2.4k</div>
                <div className="lbl">PEOPLE HELPED</div>
              </div>
              <div className="stat">
                <div className="num">18</div>
                <div className="lbl">ACTIVE MISSIONS</div>
              </div>
              <div className="stat">
                <div className="num">34</div>
                <div className="lbl">OPEN REQUESTS</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="login-right">
            <div className="login-form">
              <div className="form-icon">🛡</div>
              <p className="form-tag">SECURE ACCESS</p>
              <h2 className="form-heading">Sign In</h2>

              <label className="field-label">EMAIL ADDRESS</label>
              <div className="field-wrap">
                <input
                  className="field-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <label className="field-label">PASSWORD</label>
              <div className="field-wrap">
                <input
                  className="field-input"
                  placeholder="Enter password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 42 }}
                />
                <button className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>

              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>

              <button className="login-btn">LOGIN →</button>

              <div className="divider">
                <hr /><span>OR</span><hr />
              </div>

              <p className="register-row">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
