import React, { useState } from "react";
import "../styles/inst.css";
export default function AddInstruction() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "alert",
    district: "",
    priority: "low",
    targetType: "public",
    missionId: "",
    receiverId: "",
    instructionType: "general"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      console.log("Form data:", form);

      // TODO: API call here

      // reset form
      setForm({
        title: "",
        content: "",
        type: "alert",
        district: "",
        priority: "low",
        targetType: "public",
        missionId: "",
        receiverId: "",
        instructionType: "general"
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Instruction</h2>

      {/* TITLE */}
      <div className="form-group">
        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      {/* CONTENT */}
      <div className="form-group">
        <label>Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
        />
      </div>

      {/* TYPE + DISTRICT */}
      <div className="row">
        <div className="form-group">
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="alert">Alert</option>
            <option value="info">Info</option>
          </select>
        </div>

        <div className="form-group">
          <label>District</label>
          <input
            name="district"
            value={form.district}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* TARGET */}
      <div className="row">
        <div className="form-group">
          <label>Delivery Target</label>
          <select name="targetType" value={form.targetType} onChange={handleChange}>
            <option value="public">Public</option>
            <option value="mission">Mission</option>
            <option value="volunteer_head">Volunteer Head</option>
            <option value="all_volunteers">All Volunteers</option>
          </select>
        </div>

        <div className="form-group">
          <label>Instruction Type</label>
          <select name="instructionType" value={form.instructionType} onChange={handleChange}>
            <option value="general">General</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* CONDITIONAL */}
      {form.targetType === "mission" && (
        <input
          name="missionId"
          placeholder="Mission ID"
          value={form.missionId}
          onChange={handleChange}
        />
      )}

      {form.targetType === "volunteer_head" && (
        <input
          name="receiverId"
          placeholder="Head ID"
          value={form.receiverId}
          onChange={handleChange}
        />
      )}

      {/* PRIORITY */}
      <div className="form-group">
        <label>Priority</label>
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Sending..." : "Submit"}
      </button>
    </div>
  );
}