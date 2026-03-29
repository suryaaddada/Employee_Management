import api from "./api";

export const getEmployees = async () => {
  const response = await api.get("/Employees");
  return response.data;
};