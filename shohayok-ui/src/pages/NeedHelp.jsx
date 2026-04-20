import "../styles/help.css";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function NeedHelp() {
  const location = useLocation();
  const user = location.state?.userData || JSON.parse(localStorage.getItem("user")) || {};

  // --- States Define (Error fix korar jonno) ---
  const [submitted, setSubmitted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(!!user.id);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    userId: user.id || "",
    name: user.name || "",
    phone: user.phone || "",
    district: "",
    subDistrict: "",
    village: "",
    trapped: 1,
    need: "rescue"
  });

  // Helper to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // লজিক অনুযায়ী সঠিক URL সেট করা
    const url = isRegistered 
      ? "http://localhost:5000/requests"        // রেজিস্টার্ড ইউজারের জন্য
      : "http://localhost:5000/requests/guest";  // গেস্ট ইউজারের জন্য

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    };

    // যদি ইউজার রেজিস্টার্ড হয়, তবে হেডার-এ টোকেন পাঠাতে হবে
    if (isRegistered) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, options);

    if (response.ok) {
      setSubmitted(true);
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Request failed");
    }
  } catch (err) {
    alert("Connection error: " + err.message);
  } finally {
    setLoading(false);
  }
};

  // --- Success View (Apnar deya original styling) ---
  if (submitted) {
    return (
      <>
        
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

  // --- Form View (Apnar deya original styling) ---
  return (
    <>
      

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
              <div className="toggle-row" onClick={() => setIsRegistered(!isRegistered)}>
                <span className="toggle-label">Already Registered?</span>
                <div className={`toggle-switch ${isRegistered ? "on" : ""}`}>
                  <div className="toggle-knob" />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {!isRegistered && (
                  <div className="field-section">
                    <p className="field-section-title">Personal Information</p>
                    <div className="input-grid">
                      <div>
                        <label className="nh-label">FULL NAME</label>
                        <input name="name" className="nh-input" placeholder="Your name" value={form.name} onChange={handleChange} required />
                      </div>
                      <div>
                        <label className="nh-label">PHONE</label>
                        <input name="phone" className="nh-input" placeholder="01XXXXXXXXX" value={form.phone} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                )}

                <div className="field-section">
                  <p className="field-section-title">Location Details</p>
                  <label className="nh-label">DISTRICT</label>
                  <input name="district" className="nh-input" placeholder="e.g. Sunamganj" value={form.district} onChange={handleChange} required />
                  <div className="input-grid">
                    <div>
                      <label className="nh-label">SUB-DISTRICT</label>
                      <input name="subDistrict" className="nh-input" placeholder="Upazila" value={form.subDistrict} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="nh-label">VILLAGE</label>
                      <input name="village" className="nh-input" placeholder="Village name" value={form.village} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div className="field-section">
                  <p className="field-section-title">Situation Details</p>
                  <label className="nh-label">PEOPLE TRAPPED</label>
                  <input name="trapped" className="nh-input" type="number" value={form.trapped} onChange={handleChange} required />
                  <label className="nh-label">MAIN NEED</label>
                  <select name="need" className="nh-select" value={form.need} onChange={handleChange}>
                    <option value="rescue">🚁 Rescue</option>
                    <option value="food">🍱 Food</option>
                    <option value="medicine">💊 Medicine</option>
                    <option value="shelter">🏕 Safe Shelter</option>
                  </select>
                </div>

                <button type="submit" className="nh-submit" disabled={loading}>
                  {loading ? "SENDING..." : "🚨 SUBMIT HELP REQUEST"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}