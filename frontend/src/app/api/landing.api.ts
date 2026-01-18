import { api } from "./client";

export const getLandingStats = async () => {
  const res = await api.get("/report/landing");
  return res.data;
};
