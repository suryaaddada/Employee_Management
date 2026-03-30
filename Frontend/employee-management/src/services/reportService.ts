import { getEmployees } from "./employeeService";
import { getDepartments } from "./departmentService";
import { getAttendance } from "./attendanceService";

const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
  const csv = [headers, ...rows]
    .map(r => r.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
};

export const exportEmployees = async () => {
  const employees = await getEmployees();
  const departments = await getDepartments();

  const getDept = (id: number) =>
    departments.find(d => d.id === id)?.name || "Unknown";

  downloadCSV(
    "employees.csv",
    ["Name", "Email", "Phone", "Department", "Salary"],
    employees.map(e => [
      e.name,
      e.email,
      e.phone,
      getDept(e.departmentId),
      String(e.salary)
    ])
  );
};


export const exportAttendance = async () => {
  const attendance = await getAttendance();

  downloadCSV(
    "attendance.csv",
    ["Employee", "Date", "CheckIn", "CheckOut"],
    attendance.map(a => [
      String(a.employeeName || a.employeeId),
      a.date,
      a.checkIn ?? "",
      a.checkOut ?? ""
    ])
  );
}; 

export const exportDepartments = async () => {
  const [departments, employees] = await Promise.all([
    getDepartments(),
    getEmployees()
  ]);

  const getEmpCount = (deptId: number) =>
    employees.filter(e => e.departmentId === deptId).length;

  downloadCSV(
    "departments.csv",
    ["Id", "Name", "No of Employees"],
    departments.map(d => [
      String(d.id),
      d.name,
      String(getEmpCount(d.id))
    ])
  );
};

export const exportSalary = async () => {
  const [employees, departments] = await Promise.all([
    getEmployees(),
    getDepartments()
  ]);

  const getDeptName = (id: number) =>
    departments.find(d => d.id === id)?.name || "Unknown";

  downloadCSV(
    "salary.csv",
    ["Name", "Department", "Salary"],
    employees.map(e => [
      e.name,
      getDeptName(e.departmentId),
      String(e.salary)
    ])
  );
};