import "../styles/help.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NeedHelp() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔐 ONLY USER ALLOWED
  if (!user || user.role !== "user") {
    return <div style={{ padding: "20px" }}>Access Denied</div>;
  }

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: user.id,
    name: user.name || "",
    phone: user.phone || "",
    district: "",
    subDistrict: "",
    village: "",
    trapped: 1,
    need: "rescue"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUCCESS UI
  if (submitted) {
    return (
      <div className="nh-root">
        <Navbar />
        <div className="nh-center">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <div className="success-title">Request Submitted</div>
            <div className="success-sub">
              Our rescue team will reach you as soon as possible.
            </div>
            <button className="back-btn" onClick={() => navigate("/")}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nh-root">
      <Navbar />

      <div className="nh-center">
        <div className="nh-card">

          {/* 🔥 TOP SECTION */}
          <div className="nh-card-top">
            <p className="nh-eyebrow">🚨 EMERGENCY REQUEST</p>
            <h2 className="nh-title">Need Help?</h2>
            <p className="nh-sub">
              Fill this form to request emergency rescue or relief.
            </p>
          </div>

          {/* 🔥 FORM BODY */}
          <div className="nh-body">
            <form onSubmit={handleSubmit}>

              {/* Location */}
              <div className="field-section">
                <p className="field-section-title">Location Details</p>

                <input
                  name="district"
                  className="nh-input"
                  placeholder="District"
                  value={form.district}
                  onChange={handleChange}
                  required
                />

                <div className="input-grid">
                  <input
                    name="subDistrict"
                    className="nh-input"
                    placeholder="Sub District"
                    value={form.subDistrict}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="village"
                    className="nh-input"
                    placeholder="Village"
                    value={form.village}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Situation */}
              <div className="field-section">
                <p className="field-section-title">Situation Details</p>

                <input
                  name="trapped"
                  type="number"
                  className="nh-input"
                  value={form.trapped}
                  onChange={handleChange}
                />

                <select
                  name="need"
                  className="nh-select"
                  value={form.need}
                  onChange={handleChange}
                >
                  <option value="rescue">🚁 Rescue</option>
                  <option value="food">🍱 Food</option>
                  <option value="medicine">💊 Medicine</option>
                  <option value="shelter">🏕 Shelter</option>
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
  );
}