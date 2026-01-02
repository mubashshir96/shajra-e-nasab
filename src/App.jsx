import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { LanguageProvider } from "./context/LanguageContext";
import { isAdmin } from "./utils/isAdmin";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserShajra from "./pages/AdminUserShajra";

/* 🔐 Admin Guard */
function AdminGuard() {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    isAdmin().then(setAllowed);
  }, []);

  if (allowed === null) return <p>Checking admin access...</p>;
  if (!allowed) return <h3 style={{ padding: 20 }}>❌ Access Denied</h3>;

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="shajra/:userId" element={<AdminUserShajra />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* 🔓 Public */}
          <Route path="/login" element={<Login />} />

          {/* 👤 User */}
          <Route path="/" element={<Dashboard />} />

          {/* 👑 Admin */}
          <Route path="/admin/*" element={<AdminGuard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
