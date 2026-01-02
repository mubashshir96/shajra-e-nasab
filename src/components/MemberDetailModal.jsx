export default function MemberDetailModal({ member, onEdit, onClose }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <img
          src={member.photo_url || "/avatar.png"}
          style={photo}
        />

        <h3>{member.name}</h3>
        <p><b>Gender:</b> {member.gender || "-"}</p>
        <p><b>DOB:</b> {member.dob || "-"}</p>
        <p><b>Village:</b> {member.village || "-"}</p>

        <div style={{ marginTop: 15 }}>
          <button onClick={() => onEdit(member)}>✏️ Edit</button>
          <button onClick={onClose}>❌ Close</button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 20,
  width: 350,
  borderRadius: 10,
};

const photo = {
  width: 120,
  height: 120,
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: 10,
};
