import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import "../styles/inst.css";

export default function Feedback() {
  const [form, setForm] = useState({
    missionId: "",
    volunteerId: "",
    rating: "5",
    comments: ""
  });
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("/feedback", {
        ...form,
        rating: Number(form.rating)
      });
      setMessage("Feedback submitted. Thank you for confirming the rescue experience.");
      setForm({ missionId: "", volunteerId: "", rating: "5", comments: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="card" style={{ maxWidth: "620px", margin: "40px auto" }}>
        <div className="card-header">
          <div>
            <h2 className="title">Mission Feedback</h2>
            <p className="title-sub">AFTER RESCUE CONFIRMATION</p>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Mission ID</label>
            <input value={form.missionId} onChange={(e) => setForm({ ...form, missionId: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Volunteer ID</label>
            <input value={form.volunteerId} onChange={(e) => setForm({ ...form, volunteerId: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
          </div>

          <div className="form-group">
            <label>Comments</label>
            <textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
          </div>

          <button className="submit-btn">Submit Feedback</button>
        </form>

        {message && <p style={{ marginTop: "16px" }}>{message}</p>}
      </div>
    </div>
  );
}
