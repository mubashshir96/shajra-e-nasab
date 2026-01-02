import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useLang } from "../context/LanguageContext";

import AddMemberForm from "../components/AddMemberForm";
import EditMemberModal from "../components/EditMemberModal";
import TreeViewD3 from "../components/TreeViewD3";
import { exportAsImage, exportAsPDF } from "../utils/exportShajra.mjs";
import MemberDetailModal from "../components/MemberDetailModal";

export default function Dashboard() {
	const updateMember = async (m) => {
  const { error } = await supabase
    .from("members")
    .update({
      name: m.name,
      father_id: m.father_id,
      village: m.village,
      dob: m.dob,
    })
    .eq("id", m.id)
    .eq("user_id", user.id); // 🔐 owner check

  if (error) {
    alert("Update failed: " + error.message);
    return;
  }

  loadMembers();
};

  const { t, lang, setLang, isRTL } = useLang();

  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);

  const [showAdd, setShowAdd] = useState(false); // ✅ IMPORTANT
  const [selected, setSelected] = useState(null);
  const [viewMember, setViewMember] = useState(null); // 👁 View Details

  // 🔑 GET USER
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // 📥 LOAD MEMBERS
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
	const [profile, setProfile] = useState(null);

useEffect(() => {
  if (!user) return;

  supabase
    .from("profiles")
    .select("blocked")
    .eq("id", user.id)
    .single()
    .then(({ data }) => setProfile(data));
}, [user]);

if (profile?.blocked) {
  return (
    <h2 style={{ color: "red", padding: 40 }}>
      🚫 Your account has been blocked by admin
    </h2>
  );
}

  // ➕ ADD MEMBER
  const addMember = async (m) => {
  const { error } = await supabase.from("members").insert({
   	 ...m,
   	 user_id: user.id,
 	 });

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  loadMembers();
};


  // 🔒 LOGIN CHECK
  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h3>{t.loginMsg}</h3>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }} dir={isRTL ? "rtl" : "ltr"}>
      <h1>🌳 {t.title}</h1>

      {/* 🌐 Language */}
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="ur">اردو</option>
      </select>

      <br /><br />

      {/* 🔘 BUTTONS */}
      <button onClick={() => setShowAdd(true)}>
        ➕ {t.addMember}
      </button>

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
	<button
  	onClick={() => (window.location.href = "/admin")}
	>
  	👑 Admin Panel
   	</button>


      {/* ✅ ADD MEMBER POPUP */}
      {showAdd && (
        <AddMemberForm
          members={members}
          onAdd={addMember}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* 🌳 TREE */}
	<TreeViewD3
 	 members={members}
  	   onView={(m) => setViewMember(m)}
 		 onEdit={(m) => setSelected(m)}
	/>


      {/* ✏️ EDIT MODAL */}
      {selected && (
        <EditMemberModal
          member={selected}
          onUpdate={async (m) => {
            await supabase.from("members").update(m).eq("id", m.id);
            loadMembers();
            setSelected(null);
          }}
          onDelete={async (id) => {
            await supabase.from("members").delete().eq("id", id);
            loadMembers();
            setSelected(null);
          }}
          onClose={() => setSelected(null)}
        />
      )}
	{/* 👁 VIEW DETAILS MODAL */}
	{viewMember && (
 	 <MemberDetailModal
   		 member={viewMember}
    onClose={() => setViewMember(null)}
  />
)}

    </div>
  );
}
