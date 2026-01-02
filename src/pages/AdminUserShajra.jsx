import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import TreeViewD3 from "../components/TreeViewD3";

export default function AdminUserShajra() {
  const { userId } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadMembers();
  }, [userId]);

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    setMembers(data || []);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🌳 User Shajra</h2>
      <p>User ID: {userId}</p>

      {members.length === 0 ? (
        <p>No Shajra data found</p>
      ) : (
        <TreeViewD3 members={members} onSelect={() => {}} />
      )}
    </div>
  );
}
