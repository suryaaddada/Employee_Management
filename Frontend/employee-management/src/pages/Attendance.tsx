import { useEffect, useState } from "react";
import { markAttendance, getAttendance } from "../services/attendanceService";
import { getEmployees } from "../services/employeeService";
import type { Employee } from "../models/Employee";
import type { Attendance } from "../models/Attendance";
import { toast, ToastContainer } from "react-toastify";

const AttendancePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);

  const [form, setForm] = useState({
    employeeId: 0,
    date: new Date().toISOString().split("T")[0],
    checkIn: "",
    checkOut: "",
    isPresent: true,
  });

  const [filters, setFilters] = useState({
    employeeId: "",
    date: "",
  });

  const loadData = () => {
    getEmployees().then(setEmployees);
    getAttendance().then(setAttendanceList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "employeeId"
          ? Number(value)
          : value,
    });
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        checkIn: form.checkIn ? form.checkIn + ":00" : undefined,
        checkOut: form.checkOut ? form.checkOut + ":00" : undefined,
      };

      await markAttendance(payload);
      toast.success("Attendance marked successfully!");
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const getEmployeeName = (id: number) =>
    employees.find((emp) => emp.id === id)?.name || "Unknown";

  const filteredAttendance = attendanceList.filter((att) => {
    const matchEmployee =
      !filters.employeeId || att.employeeId === Number(filters.employeeId);
    const formattedDate = att.date?.split("T")[0];
    const matchDate = !filters.date || formattedDate === filters.date;
    return matchEmployee && matchDate;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800">Attendance</h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">

          <h3 className="text-lg font-medium text-gray-700">Mark Attendance</h3>

          <div>
            <label className="text-sm text-gray-600">Employee</label>
            <select
              name="employeeId"
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-gray-600">Check In</label>
              <input
                type="time"
                name="checkIn"
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Check Out</label>
              <input
                type="time"
                name="checkOut"
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="isPresent"
              checked={form.isPresent}
              onChange={handleChange}
            />
            Present
          </label>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>

        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-gray-700">Filters</h3>
          <div className="space-y-2">

            <div>
              <label className="text-sm text-gray-600">Employee</label>
              <select
                name="employeeId"
                onChange={handleFilterChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                name="date"
                onChange={handleFilterChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </div>

            <button
              onClick={() => setFilters({ employeeId: "", date: "" })}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

    
      <div className="bg-white border rounded-lg overflow-hidden">
        <h2 className="p-4 font-semibold text-gray-700 border-b">
          Attendance Records
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
            </tr>
          </thead>

          <tbody>
            {filteredAttendance.map((att) => (
              <tr key={att.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{getEmployeeName(att.employeeId)}</td>
                <td className="p-3">{att.date?.split("T")[0]}</td>
                <td className="p-3">
                  <span
                    className={
                      att.isPresent
                        ? "text-green-600 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {att.isPresent ? "Present" : "Absent"}
                  </span>
                </td>
                <td className="p-3">{att.checkIn}</td>
                <td className="p-3">{att.checkOut}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAttendance.length === 0 && (
          <p className="p-4 text-sm text-gray-500 text-center">
            No records found
          </p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AttendancePage;