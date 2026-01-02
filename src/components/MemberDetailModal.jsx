export default function MemberDetailModal({
  member,
  onClose,
  onEditPhoto,
  onRemovePhoto,
}) {
  if (!member) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          width: 450,
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 8,
        }}
      >
        <h2 style={{ textAlign: "center" }}>👤 Member Details</h2>

        {/* 📸 PHOTO */}
        {member.photo_url && (
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <img
              src={member.photo_url}
              alt="Member"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #16a34a",
              }}
            />
          </div>
        )}

        {/* 🔘 PHOTO ACTIONS */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <button onClick={onEditPhoto}>Change Photo</button>{" "}
          {member.photo_url && (
            <button onClick={onRemovePhoto}>Remove Photo</button>
          )}
        </div>

        <p><b>Name:</b> {member.name}</p>
        <p><b>Gender:</b> {member.gender}</p>

        <p><b>DOB:</b> {member.dob || "-"}</p>
        <p><b>POB:</b> {member.pob || "-"}</p>

        <p><b>DOD:</b> {member.dod || "-"}</p>
        <p><b>POD:</b> {member.pod || "-"}</p>

        <hr />

        <p><b>Education:</b> {member.education || "-"}</p>
        <p><b>Occupation:</b> {member.occupation || "-"}</p>

        <p><b>Notes:</b> {member.notes || "-"}</p>

        <div style={{ textAlign: "right" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
