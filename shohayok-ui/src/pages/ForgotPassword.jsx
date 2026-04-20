import "../styles/forgot.css";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [otpSent, setOtpSent] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");

  return (
    <>
      

      <div className="fp-root">
        <Navbar />
        <div className="fp-center">
          <div className="fp-card">

            {resetDone ? (
              <div className="fp-success">
                <div className="fp-success-icon">✅</div>
                <div className="fp-success-title">Password Reset!</div>
                <div className="fp-success-sub">You can now log in with your new password.</div>
                <button className="fp-btn green" style={{ marginTop: 24 }} onClick={() => window.location.href = "/login"}>
                  Go to Login
                </button>
              </div>
            ) : (
              <>
                <div className="fp-icon">🔐</div>
                <p className="fp-tag">Account Recovery</p>
                <h2 className="fp-heading">Forgot Password</h2>

                <div className="fp-steps">
                  <div className={`fp-step ${!otpSent ? "active" : "done"}`} />
                  <div className={`fp-step ${otpSent ? "active" : ""}`} />
                </div>

                {!otpSent ? (
                  <>
                    <p className="fp-sub">Enter your registered email and we'll send you a verification code.</p>
                    <label className="fp-label">EMAIL ADDRESS</label>
                    <input className="fp-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    <button className="fp-btn" onClick={() => setOtpSent(true)}>Send OTP →</button>
                  </>
                ) : (
                  <>
                    <p className="fp-sub">Enter the OTP sent to <strong style={{ color: "#818cf8" }}>{email || "your email"}</strong> and set a new password.</p>
                    <label className="fp-label">VERIFICATION CODE</label>
                    <input className="fp-input" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
                    <label className="fp-label">NEW PASSWORD</label>
                    <input className="fp-input" placeholder="New password" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
                    <button className="fp-btn green" onClick={() => setResetDone(true)}>Reset Password ✓</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
