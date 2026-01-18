import { useState } from "react";
import { login, UserRole } from "@/app/auth/auth";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

interface Props {
  onLoginSuccess: (role: UserRole) => void;
  defaultRole: UserRole; // ✅ NEW
}

export function LoginPage({ onLoginSuccess, defaultRole }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole); // ✅ USE DEFAULT
  const [error, setError] = useState("");

  const handleLogin = () => {
    const ok = login({ username, password, role });
    if (!ok) {
      setError("Invalid credentials");
      return;
    }
    onLoginSuccess(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
      <Card className="w-[380px] p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Temple Access Login
        </h2>

        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <select
            className="w-full border rounded px-3 py-2"
            value={role}
            onChange={e => setRole(e.target.value as UserRole)}
          >
            <option value="pilgrim">Pilgrim</option>
            <option value="admin">Temple Admin</option>
            <option value="sos">Emergency Ops</option>
          </select>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <Button className="w-full bg-orange-500" onClick={handleLogin}>
            Login
          </Button>
        </div>

        <div className="text-xs text-slate-500 mt-4">
          Demo credentials:
          <br />
          pilgrim / 1234
          <br />
          admin / admin123
          <br />
          sos / sos123
        </div>
      </Card>
    </div>
  );
}
