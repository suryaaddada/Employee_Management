import api from "./api";
import type {Employee}  from "../models/Employee";

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await api.get("/Employees");
  return res.data;
};

export const addEmployee = async (data: Employee): Promise<Employee> => {
  const res = await api.post("/Employees", data);
  return res.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await api.delete(`/Employees/${id}`);
};

export const updateEmployee = async (
  id: number,
  data: Employee
): Promise<void> => {
  await api.put(`/Employees/${id}`, data);
}; 

  export const deleteMultipleEmployees = async (ids: number[]) => {
  return await api.post("/Employees/delete-multiple", ids);
};