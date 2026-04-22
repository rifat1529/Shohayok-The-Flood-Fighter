import "../styles/submit.css";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api/http";

export default function SubmitReport() {
  const [form, setForm] = useState({ opType: "", helped: "", support: "", notes: "" });
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const activeMission = JSON.parse(localStorage.getItem("activeMission"));
  const editingReport = JSON.parse(localStorage.getItem("editingReport"));
  useEffect(() => {
  if (editingReport) {
    setForm({
      opType: editingReport.helpType,
      helped: editingReport.peopleHelped,
      support: editingReport.helpType,
      notes: editingReport.notes
    });
  }
}, []);
  const handleSubmit = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("volunteerId", user.id);
    formData.append("missionId", editingReport?.missionId || activeMission.id);
    formData.append("area", editingReport?.area || activeMission.area);
    formData.append("helpType", form.support.toLowerCase());
    formData.append("peopleHelped", form.helped);
    formData.append("notes", form.notes);

    if (file) {
      formData.append("image", file);
    }

    // 🔥 IF EDIT → UPDATE
    if (editingReport) {
      await fetch(`http://localhost:5000/reports/${editingReport.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      localStorage.removeItem("editingReport");
    } 
    // 🔥 ELSE → NEW
    else {
      await fetch("http://localhost:5000/reports/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
    }

    setSubmitted(true);

  } catch (err) {
    alert("Failed to submit");
  }
};

  if (submitted) {
    return (
      <div className="sr-root">
        <Navbar />
        <div className="sr-center">
          <div className="sr-success">
            <div className="sr-s-icon">📋</div>
            <div className="sr-s-title">Report Submitted</div>
            <div className="sr-s-sub">
              Your operation report has been sent for admin review.
            </div>
            <button className="sr-s-btn" onClick={() => setSubmitted(false)}>
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sr-root">
      <Navbar />
      <div className="sr-center">
        <div className="sr-card">
          <div className="sr-header">
            <div className="sr-icon">📋</div>
            <div>
              <p className="sr-eyebrow">FIELD REPORT</p>
              <h2 className="sr-title">Submit Operation Report</h2>
            </div>
          </div>

          <div className="sr-body">
            <div className="two-col">
              <div>
                <label className="sr-label">OPERATION TYPE</label>
                <input
                  className="sr-input"
                  placeholder="e.g. Flood Rescue"
                  value={form.opType}
                  onChange={set("opType")}
                />
              </div>
              <div>
                <label className="sr-label">PEOPLE HELPED</label>
                <input
                  className="sr-input"
                  type="number"
                  value={form.helped}
                  onChange={set("helped")}
                />
              </div>
            </div>

            <label className="sr-label">SUPPORT TYPE</label>
            <div className="support-chips">
              {["Rescue", "Food", "Medicine"].map((s) => (
                <span
                  key={s}
                  className={`support-chip ${
                    form.support === s ? `sel-${s.toLowerCase()}` : ""
                  }`}
                  onClick={() => setForm({ ...form, support: s })}
                >
                  {s}
                </span>
              ))}
            </div>

            <label className="sr-label">EVIDENCE / PHOTOS</label>
            <div className="file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="file-upload-icon">📸</div>
              <div className="file-upload-label">
                Click to upload photo evidence
              </div>
              {file && <div className="file-name">✓ {file.name}</div>}
            </div>

            <label className="sr-label">EXTRA NOTES</label>
            <textarea
              className="sr-textarea"
              value={form.notes}
              onChange={set("notes")}
            />

            <hr className="sr-divider" />

            <button className="sr-submit" onClick={handleSubmit}>
              📤 SUBMIT REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}