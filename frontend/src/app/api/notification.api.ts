import { api } from "./client";

export const getNotifications = async (devoteeId: string) => {
  const res = await api.get(`/notifications/${devoteeId}`);
  return res.data;
};
