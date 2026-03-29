import api from "./api";

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/Auth/Login", data);
  return res.data;
};

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/Auth/Register", data);
  return res.data;
};