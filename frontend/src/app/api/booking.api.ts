import { api } from "./client";

export const createBooking = async (payload: {
  slotId: string;
  priority?: string | null;
}) => {
  const res = await api.post("/booking/create", payload);
  return res.data;
};
