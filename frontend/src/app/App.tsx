import { useState } from "react";

import { LandingPage } from "./components/landing/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { PilgrimDashboard } from "./components/pilgrim/PilgrimDashboard";
import { SOSDashboard } from "./components/sos/SOSDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";

import { getAuthUser, logout, UserRole } from "./auth/auth";

type View = "landing" | "login" | "dashboard";

export default function App() {
  const stored = getAuthUser();

  const [view, setView] = useState<View>(
    stored?.role ? "dashboard" : "landing"
  );
  const [role, setRole] = useState<UserRole | null>(stored?.role ?? null);

  /* ---------------- LANDING ---------------- */
  if (view === "landing") {
    return (
      <LandingPage
        onRoleSelect={(selectedRole) => {
          setRole(selectedRole);
          setView("login");
        }}
      />
    );
  }

  /* ---------------- LOGIN ---------------- */
  if (view === "login" && role) {
  return (
    <LoginPage
      defaultRole={role} // ✅ THIS IS THE KEY
      onLoginSuccess={() => {
        setView("dashboard");
      }}
    />
  );
}


  /* ---------------- DASHBOARDS ---------------- */
  const handleLogout = () => {
    logout();
    setRole(null);
    setView("landing");
  };

  if (view === "dashboard" && role === "pilgrim") {
    return <PilgrimDashboard onBack={handleLogout} />;
  }

  if (view === "dashboard" && role === "sos") {
    return <SOSDashboard onBack={handleLogout} />;
  }

  if (view === "dashboard" && role === "admin") {
    return <AdminDashboard onBack={handleLogout} />;
  }

  return null;
}
