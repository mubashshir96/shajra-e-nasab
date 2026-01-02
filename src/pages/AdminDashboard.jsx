import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // 1️⃣ Profiles
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, role, blocked");

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    // 2️⃣ Root members (parent_id = null)
    const { data: roots, error: memberErr } = await supabase
      .from("members")
      .select("user_id, name, village")
      .is("parent_id", null);

    if (memberErr) {
      console.error(memberErr);
      alert(memberErr.message);
      return;
    }

    // 3️⃣ Merge profiles + members
    const merged = profiles.map((p) => {
      const root = roots.find((r) => r.user_id === p.id);
      return {
        ...p,
        name: root?.name || "-",
        village: root?.village || "-",
      };
    });

    setUsers(merged);
  };

  const toggleBlock = async (id, blocked) => {
    await supabase
      .from("profiles")
      .update({ blocked: !blocked })
      .eq("id", id);

    loadUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm("⚠️ Delete user profile only?")) return;

    await supabase.from("profiles").delete().eq("id", id);
    loadUsers();
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.village}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>🛡️ Admin Panel</h1>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search by name or village"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 8, marginBottom: 12, width: "40%" }}
      />

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Village</th>
            <th>Role</th>
            <th>Status</th>
            <th>Shajra</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.village}</td>
              <td>{u.role}</td>
              <td>{u.blocked ? "🚫 Blocked" : "✅ Active"}</td>

              <td>
                <button
                  onClick={() => navigate(`/admin/shajra/${u.id}`)}
                >
                  🌳 View Shajra
                </button>
              </td>

              <td>
                <button onClick={() => toggleBlock(u.id, u.blocked)}>
                  {u.blocked ? "Unblock" : "Block"}
                </button>{" "}
                <button
                  onClick={() => deleteUser(u.id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
