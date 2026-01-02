import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useLang } from "../context/LanguageContext";

import AddMemberForm from "../components/AddMemberForm";
import EditMemberModal from "../components/EditMemberModal";
import TreeViewD3 from "../components/TreeViewD3";
import { exportAsImage, exportAsPDF } from "../utils/exportShajra.mjs";
import MemberDetailModal from "../components/MemberDetailModal";

export default function Dashboard() {
  const { t, lang, setLang, isRTL } = useLang();

  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [viewMember, setViewMember] = useState(null);
  const [profile, setProfile] = useState(null);

  /* ================= AUTH ================= */

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("blocked")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [user]);

  /* ================= MEMBERS ================= */

  useEffect(() => {
    if (!user) return;
    loadMembers();
  }, [user]);

  const loadMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("user_id", user.id);

    setMembers(data || []);
  };

  const addMember = async (m) => {
    const { error } = await supabase.from("members").insert({
      ...m,
      user_id: user.id,
    });

    if (error) {
      alert(error.message);
      return;
    }
    loadMembers();
  };

  const updateMember = async (m) => {
    const { error } = await supabase
      .from("members")
      .update({
        name: m.name,
        father_id: m.father_id,
        village: m.village,
        dob: m.dob,
        gender: m.gender,
        notes: m.notes,
      })
      .eq("id", m.id)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadMembers();
    setSelected(null);
  };

  const deleteMember = async (id) => {
    if (!confirm("⚠️ Are you sure you want to delete this member?")) return;

    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadMembers();
    setSelected(null);
  };

  /* ================= PHOTO ================= */

  const uploadPhoto = async (file, memberId) => {
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${memberId}.${ext}`;

    await supabase.storage
      .from("member-photos")
      .upload(path, file, { upsert: true });

    const { data } = supabase.storage
      .from("member-photos")
      .getPublicUrl(path);

    await supabase
      .from("members")
      .update({ photo_url: data.publicUrl })
      .eq("id", memberId)
      .eq("user_id", user.id);

    loadMembers();
  };

  const removePhoto = async (memberId) => {
    await supabase
      .from("members")
      .update({ photo_url: null })
      .eq("id", memberId)
      .eq("user_id", user.id);

    loadMembers();
  };

  /* ================= GUARDS ================= */

  if (profile?.blocked) {
    return (
      <h2 style={{ color: "red", padding: 40 }}>
        🚫 Your account has been blocked by admin
      </h2>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h3>{t.loginMsg}</h3>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div style={{ padding: 20 }} dir={isRTL ? "rtl" : "ltr"}>
      <h1>🌳 {t.title}</h1>

      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="ur">اردو</option>
      </select>

      <br /><br />

      <button onClick={() => setShowAdd(true)}>➕ {t.addMember}</button>
      <button onClick={exportAsImage}>{t.downloadImage}</button>
      <button onClick={exportAsPDF}>{t.downloadPDF}</button>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
      >
        {t.logout}
      </button>

      <button onClick={() => (window.location.href = "/admin")}>
        👑 Admin Panel
      </button>

      {showAdd && (
        <AddMemberForm
          members={members}
          onAdd={addMember}
          onClose={() => setShowAdd(false)}
        />
      )}

      <TreeViewD3
        members={members}
        onView={(m) => setViewMember(m)}
        onEdit={(m) => setSelected(m)}
      />

      {selected && (
       <EditMemberModal
          member={selected}
          members={members}
          onUpdate={updateMember}
          onDelete={deleteMember}
          onClose={() => setSelected(null)}
      />

      )}

      {viewMember && (
        <MemberDetailModal
          member={viewMember}
          onEdit={(m) => {
            setViewMember(null);
            setSelected(m);
          }}
          onPhotoUpload={uploadPhoto}
          onPhotoRemove={removePhoto}
          onClose={() => setViewMember(null)}
        />
      )}
    </div>
  );
}
