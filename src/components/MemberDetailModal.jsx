export default function MemberDetailModal({
  member,
  onEdit,
  onPhotoUpload,
  onPhotoRemove,
  onClose,
}) {
  return (
    <div style={overlay}>
      <div style={modal}>
        {/* PHOTO */}
        <img
          src={member.photo_url || "/avatar.png"}
          alt="profile"
          style={photo}
        />

        {/* PHOTO ACTIONS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 15 }}>
          <label style={btn}>
            📷 Change Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                e.target.files &&
                onPhotoUpload(e.target.files[0], member.id)
              }
            />
          </label>

          <button
            style={{ ...btn, background: "#dc2626", color: "#fff" }}
            onClick={() => onPhotoRemove(member.id)}
          >
            🗑 Remove Photo
          </button>
        </div>

        {/* DETAILS */}
        <h3>{member.name}</h3>
        <p><b>Gender:</b> {member.gender || "-"}</p>
        <p><b>DOB:</b> {member.dob || "-"}</p>
        <p><b>Village:</b> {member.village || "-"}</p>
        <p><b>Notes:</b> {member.notes || "-"}</p>

        {/* ACTIONS */}
        <div style={actions}>
          <button
            style={{ ...btn, background: "#2563eb", color: "#fff" }}
            onClick={() => onEdit(member)}
          >
            ✏️ Edit Member
          </button>

          <button
            style={{ ...btn, background: "#6b7280", color: "#fff" }}
            onClick={onClose}
          >
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  background: "#fff",
  padding: 20,
  width: 380,
  borderRadius: 12,
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};

const photo = {
  width: 120,
  height: 120,
  borderRadius: "50%",
  objectFit: "cover",
  display: "block",
  margin: "0 auto 10px",
};

const btn = {
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  cursor: "pointer",
  background: "#f3f4f6",
  fontSize: 14,
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 15,
};
