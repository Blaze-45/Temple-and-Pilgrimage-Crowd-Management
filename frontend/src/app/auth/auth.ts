export type UserRole = "pilgrim" | "admin" | "sos";

interface LoginPayload {
  username: string;
  password: string;
  role: UserRole;
}

const DUMMY_USERS: LoginPayload[] = [
  { username: "pilgrim", password: "1234", role: "pilgrim" },
  { username: "admin", password: "admin123", role: "admin" },
  { username: "sos", password: "sos123", role: "sos" },
];

export function login(payload: LoginPayload): boolean {
  const user = DUMMY_USERS.find(
    u =>
      u.username === payload.username &&
      u.password === payload.password &&
      u.role === payload.role
  );

  if (!user) return false;

  localStorage.setItem(
    "authUser",
    JSON.stringify({
      username: user.username,
      role: user.role,
    })
  );

  return true;
}

export function logout() {
  localStorage.removeItem("authUser");
}

export function getAuthUser() {
  const raw = localStorage.getItem("authUser");
  return raw ? JSON.parse(raw) : null;
}
