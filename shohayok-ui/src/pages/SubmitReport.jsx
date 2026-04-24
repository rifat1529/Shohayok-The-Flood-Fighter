import "../styles/submit.css";
import { useState, useEffect } from "react"; // ✅ FIXED
import Navbar from "../components/Navbar";

export default function SubmitReport() {
  const [form, setForm] = useState({
    opType: "",
    helped: "",
    support: "",
    notes: ""
  });

  const [files, setFiles] = useState([]); // ✅ multi file
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const activeMission = JSON.parse(localStorage.getItem("activeMission"));
  const editingReport = JSON.parse(localStorage.getItem("editingReport"));

  // ✅ preload edit data
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

  // 🔥 SAFE GUARD (VERY IMPORTANT)
  if (!activeMission && !editingReport) {
    return (
      <div className="sr-root">
        <Navbar />
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>⚠️ No Mission Found</h2>
          <p>Please complete a mission first</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("volunteerId", user.id);
      formData.append(
        "missionId",
        editingReport?.missionId || activeMission?.id
      );
      formData.append(
        "area",
        editingReport?.area || activeMission?.area
      );
      formData.append("helpType", form.support.toLowerCase());
      formData.append("peopleHelped", form.helped);
      formData.append("notes", form.notes);

      // ✅ MULTIPLE IMAGES (max 5)
      files.forEach((file) => {
        formData.append("images", file);
      });

      if (editingReport) {
        await fetch(`http://localhost:5000/reports/${editingReport.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        localStorage.removeItem("editingReport");
      } else {
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
      console.error(err);
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

            <label className="sr-label">EVIDENCE / PHOTOS (max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles([...e.target.files])}
            />

            {files.length > 0 && (
              <div>
                {files.map((f, i) => (
                  <div key={i}>✓ {f.name}</div>
                ))}
              </div>
            )}

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