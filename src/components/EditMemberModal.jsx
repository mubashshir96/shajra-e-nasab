import { useState } from "react";

export default function EditMemberModal({
  member,
  members,
  onUpdate,
  onDelete,
  onClose,
}) {
  const [form, setForm] = useState({
    id: member.id,
    name: member.name || "",
    father_id: member.father_id || "",
    village: member.village || "",
    dob: member.dob || "",
  });

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>✏️ Edit Family Member</h2>

        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <label>Father</label>
        <select
          value={form.father_id || ""}
          onChange={(e) =>
            setForm({ ...form, father_id: e.target.value || null })
          }
        >
          <option value="">-- No Father --</option>
          {members
            .filter((m) => m.id !== member.id)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
        </select>

        <label>Village</label>
        <input
          value={form.village}
          onChange={(e) =>
            setForm({ ...form, village: e.target.value })
          }
        />

        <label>Date of Birth</label>
        <input
          type="date"
          value={form.dob || ""}
          onChange={(e) =>
            setForm({ ...form, dob: e.target.value })
          }
        />

        <div style={{ marginTop: 15 }}>
          <button
            style={{ background: "green", color: "#fff" }}
            onClick={() => onUpdate(form)}
          >
            💾 Update
          </button>

          <button
            style={{ background: "red", color: "#fff", marginLeft: 8 }}
            onClick={() => onDelete(member.id)}
          >
            🗑 Delete
          </button>

          <button onClick={onClose} style={{ marginLeft: 8 }}>
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* styles */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 20,
  width: 360,
  borderRadius: 10,
};

