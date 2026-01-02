import { supabase } from "../supabase";
import { useState } from "react";

export default function EditMemberModal({ member, onClose, onUpdated }) {
  const [name, setName] = useState(member.name);
  const [gender, setGender] = useState(member.gender);

  const updateMember = async () => {
    const { error } = await supabase
      .from("family_members")
      .update({
        name,
        gender,
        updated_at: new Date()
      })
      .eq("id", member.id);

    if (!error) {
      onUpdated();
      onClose();
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="modal">
      <h3>Edit Family Member</h3>

      <input value={name} onChange={e => setName(e.target.value)} />
      <select value={gender} onChange={e => setGender(e.target.value)}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <button onClick={updateMember}>💾 Save</button>
      <button onClick={onClose}>❌ Cancel</button>
    </div>
  );
}
