import { useState } from "react";

export default function EditMemberModal({ member, onUpdate, onDelete, onClose }) {
  const [form, setForm] = useState({
    id: member.id,
    name: member.name || "",
    father_id: member.father_id || "",
    village: member.village || "",
    dob: member.dob || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: 10 }}>✏️ Edit Family Member</h2>

        {/* Name */}
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* Father ID */}
        <label>Father ID</label>
        <input
          name="father_id"
          value={form.father_id}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* Village */}
        <label>Village</label>
        <input
          name="village"
          value={form.village}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* DOB */}
        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* ACTIONS */}
        <div style={btnRow}>
          <button
            style={saveBtn}
            onClick={() => onUpdate(form)}
          >
            💾 Update
          </button>

          <button
            style={deleteBtn}
            onClick={() => onDelete(member.id)}
          >
            🗑 Delete
          </button>

          <button
            style={cancelBtn}
            onClick={onClose}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  width: 320,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const inputStyle = {
  width: "100%",
  padding: 8,
  marginBottom: 10,
  borderRadius: 5,
  border: "1px solid #ccc",
};

const btnRow = {
  display: "flex",
  gap: 8,
  marginTop: 10,
};

const saveBtn = {
  flex: 1,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 5,
  cursor: "pointer",
};

const deleteBtn = {
  flex: 1,
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 5,
  cursor: "pointer",
};

const cancelBtn = {
  flex: 1,
  background: "#6b7280",
  color: "#fff",
  border: "none",
  padding: 8,
  borderRadius: 5,
  cursor: "pointer",
};
