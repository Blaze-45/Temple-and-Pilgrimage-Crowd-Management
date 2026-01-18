import { useState } from "react";
import { Login } from "./components/auth/Login";
import { PilgrimDashboard } from "./components/pilgrim/PilgrimDashboard";
import { SOSDashboard } from "./components/sos/SOSDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";

export default function App() {
  const storedUser = localStorage.getItem("user");
  const [role, setRole] = useState<string | null>(
    storedUser ? JSON.parse(storedUser).role : null
  );

  if (!role) {
    return <Login onLogin={setRole} />;
  }

  if (role === "PILGRIM") {
    return <PilgrimDashboard onBack={() => setRole(null)} />;
  }

  if (role === "SOS") {
    return <SOSDashboard onBack={() => setRole(null)} />;
  }

  if (role === "ADMIN") {
    return <AdminDashboard onBack={() => setRole(null)} />;
  }

  return null;
}
