// src/utils/isAdmin.js
import { supabase } from "../supabase";

export async function isAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();   // 🔥 IMPORTANT FIX

  if (error) {
    console.error("Admin check error:", error);
    return false;
  }

  return data?.role === "admin";
}
