import api from "./api";
import type { Department } from "../models/Department";

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get("/Department");
  return response.data;
};