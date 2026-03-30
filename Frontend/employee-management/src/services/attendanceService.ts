import api from "./api";
import type { Attendance } from "../models/Attendance";
export const markAttendance = (data: Attendance) =>{
    api.post("/Attendance/mark", data);
   
}
  

export const getAttendance =async() =>{
    const res = await api.get("/Attendance");
    return res.data;
}
  