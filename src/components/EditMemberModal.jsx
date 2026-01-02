import { useState } from "react";

export default function EditMemberModal({ member, onUpdate, onDelete, onClose }) {
  const [name, setName] = useState(member.name);
  const [gender, setGender] = useState(member.gender);
  const [relation, setRelation] = useState(member.relation);

  const save = () => {
    onUpdate({
      ...member,
      name,
      gender,
      relation,
    });
    onClose();
  };

  const remove = () => {
    if (confirm("Delete this member?")) {
      onDelete(member.id);
      onClose();
    }
  };

  return (
    <div style={overlay}>
      <div style={box}>
        <h3>Edit Member</h3>

        <input value={name} onChange={(e) => setName(e.target.value)} />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select value={relation} onChange={(e) => setRelation(e.target.value)}>
          <option value="self">Self</option>
          <option value="father">Father</option>
          <option value="mother">Mother</option>
          <option value="child">Child</option>
        </select>

        <div style={{ marginTop: 10 }}>
          <button onClick={save}>Save</button>
          <button onClick={remove} style={{ marginLeft: 8 }}>
            Delete
          </button>
          <button onClick={onClose} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const box = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 280,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};
