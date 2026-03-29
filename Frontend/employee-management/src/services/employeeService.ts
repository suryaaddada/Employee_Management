import api from "./api";
import type {Employee}  from "../models/Employee";

export const getEmployees = async () => {
  const response = await api.get("/Employees");
  return response.data;
};

export const addEmployee = async (data: Employee) => {
  const res = await api.post("/Employees", data);
  return res.data;
};

export const deleteEmployee = async (id: number) => {
  await api.delete(`/Employees/${id}`);
};

export const updateEmployee = async (
  id: number,
  data: Employee
): Promise<void> => {
  await api.put(`/Employees/${id}`, data);
};