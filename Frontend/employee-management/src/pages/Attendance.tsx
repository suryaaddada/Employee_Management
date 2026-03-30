import { useEffect, useState } from "react";
import { markAttendance, getAttendance } from "../services/attendanceService";
import { getEmployees } from "../services/employeeService";
import type { Employee } from "../models/Employee";
import type { Attendance } from "../models/Attendance";
const AttendancePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);

  const [form, setForm] = useState({
    employeeId: 0,
    date: new Date().toISOString().split("T")[0],
    checkIn: "",
    checkOut: "",
    isPresent: true
  });
  async function loadData() {
  const empRes = await getEmployees();
  const attRes = await getAttendance();

  setEmployees(empRes);
  setAttendanceList(attRes);
}
  // Load employees + attendance
  useEffect(() => {
  const fetchData = async () => {
    const empRes = await getEmployees();
    const attRes = await getAttendance();

    setEmployees(empRes);
    setAttendanceList(attRes);
  };

  fetchData();
}, []);

  

  // Handle input change
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const target = e.target;

  setForm({
    ...form,
    [target.name]:
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.name === "employeeId"
        ? Number(target.value)
        : target.value
  });
};

  // Submit attendance
  const handleSubmit = async () => {
  try {
    const payload = {
      ...form,
      checkIn: form.checkIn ? form.checkIn + ":00" : undefined,
      checkOut: form.checkOut ? form.checkOut + ":00" : undefined
    };

    await markAttendance(payload);

    alert("Attendance marked");
    loadData();
  } catch (err) {
    console.log(err);
  }
};

const getEmployeeName = (id: number) => {
  return employees.find(emp => emp.id === id)?.name || "Unknown";
};
  return (
    <div>
      <h2>Mark Attendance</h2>

      
      <select name="employeeId" onChange={handleChange}>
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <input
        type="time"
        name="checkIn"
        onChange={handleChange}
      />

      <input
        type="time"
        name="checkOut"
        onChange={handleChange}
      />

      <label>
        Present:
        <input
          type="checkbox"
          name="isPresent"
          checked={form.isPresent}
          onChange={handleChange}
        />
      </label>

      <button onClick={handleSubmit}>Submit</button>

      <hr />

      {/* Attendance Table */}
      <h2>Attendance Records</h2>

      <table border={1}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>

        <tbody>
          {attendanceList.map((att) => (
            <tr key={att.id}>
              <td>{getEmployeeName(att.employeeId)}</td>
              <td>{att.date}</td>
              <td>{att.isPresent ? "Present" : "Absent"}</td>
              <td>{att.checkIn}</td>
              <td>{att.checkOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;