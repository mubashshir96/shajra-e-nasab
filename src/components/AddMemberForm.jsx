import { useState } from "react";
import { supabase } from "../supabase";

export default function AddMemberForm({ members, onAdd, onClose }) {
  const [form, setForm] = useState({
    name: "",
    gender: "male",
    parent_id: "",
    dob: "",
    pob: "",
    dod: "",
    pod: "",
    village: "",
    district: "",
    state: "",
    country: "",
    address: "",
    education: "",
    occupation: "",
    notes: "",
  });

  const [photoFile, setPhotoFile] = useState(null);

  // 🔁 update handler
  const update = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ submit handler (photo + date safe)
  const submit = async () => {
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    let photo_url = null;

    // 📸 PHOTO UPLOAD
    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("member-photos")
        .upload(fileName, photoFile);

      if (uploadError) {
        alert("Photo upload failed");
        return;
      }

      const { data } = supabase.storage
        .from("member-photos")
        .getPublicUrl(fileName);

      photo_url = data.publicUrl;
    }

    await onAdd({
      name: form.name,
      gender: form.gender,
      parent_id: form.parent_id || null,

      dob: form.dob || null,
      dod: form.dod || null,

      pob: form.pob || null,
      pod: form.pod || null,

      village: form.village || null,
      district: form.district || null,
      state: form.state || null,
      country: form.country || null,

      address: form.address || null,
      education: form.education || null,
      occupation: form.occupation || null,
      notes: form.notes || null,

      photo_url, // ✅ SAVE PHOTO URL
    });

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          width: 420,
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 8,
        }}
      >
        <h2>Add Family Member</h2>

        {/* 📸 PHOTO */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
        />

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={update}
        />

        <select name="gender" value={form.gender} onChange={update}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          name="parent_id"
          value={form.parent_id}
          onChange={update}
        >
          <option value="">No Parent (Root)</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <hr />

        <label>Date of Birth</label>
        <input type="date" name="dob" value={form.dob} onChange={update} />

        <input
          name="pob"
          placeholder="Place of Birth"
          value={form.pob}
          onChange={update}
        />

        <label>Date of Death (optional)</label>
        <input type="date" name="dod" value={form.dod} onChange={update} />

        <input
          name="pod"
          placeholder="Place of Death"
          value={form.pod}
          onChange={update}
        />

        <hr />

        <input
          name="village"
          placeholder="Village / City"
          value={form.village}
          onChange={update}
        />

        <input
          name="district"
          placeholder="District"
          value={form.district}
          onChange={update}
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={update}
        />

        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={update}
        />

        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={update}
        />

        <input
          name="education"
          placeholder="Education"
          value={form.education}
          onChange={update}
        />

        <input
          name="occupation"
          placeholder="Occupation"
          value={form.occupation}
          onChange={update}
        />

        <textarea
          name="notes"
          placeholder="Notes / Family History"
          value={form.notes}
          onChange={update}
        />

        <br />

        <button type="button" onClick={submit}>
          Add
        </button>

        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
