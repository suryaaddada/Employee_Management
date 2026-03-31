import { useEffect, useState } from "react";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
  deleteMultipleEmployees,
} from "../services/employeeService";

import type { Employee } from "../models/Employee";
import { getDepartments } from "../services/departmentService";
import type { Department } from "../models/Department";

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    salary: "",
    phone: "",
    departmentId: "",
  });

  const loadEmployees = () => {
    getEmployees().then(setEmployees);
    getDepartments().then(setDepartments);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEdit = (emp: Employee) => {
    setForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      salary: emp.salary.toString(),
      departmentId: emp.departmentId.toString(),
    });
    setEditingId(emp.id!);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      salary: Number(form.salary),
      departmentId: Number(form.departmentId),
    };

    try {
      if (editingId) {
        await updateEmployee(editingId, payload);
        setEditingId(null);
      } else {
        await addEmployee(payload);
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        salary: "",
        departmentId: "",
      });

      loadEmployees();
    } catch (err) {
      console.log(err);
      alert("Error saving employee");
    }
  };

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    loadEmployees();
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    await deleteMultipleEmployees(selectedIds);
    setSelectedIds([]);
    loadEmployees();
  };

  const getDepartmentName = (id: number) =>
    departments.find((d) => d.id === id)?.name || "Unknown";

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.salary.trim() &&
    !isNaN(Number(form.salary)) &&
    form.departmentId;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>

   
      <form
        onSubmit={handleSubmit}
        className="bg-blue-50 border border-blue-100 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <input
          name="name"
          placeholder="Name *"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded text-sm"
        />
        <input
          name="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded text-sm"
        />
        <input
          name="salary"
          placeholder="Salary *"
          value={form.salary}
          onChange={handleChange}
          className="border p-2 rounded text-sm"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded text-sm"
        />
        <select
          name="departmentId"
          value={form.departmentId}
          onChange={handleChange}
          className="border p-2 rounded text-sm col-span-1 md:col-span-2"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm disabled:bg-gray-400 hover:bg-blue-700 transition"
          >
            {editingId ? "Update" : "Add"}
          </button>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition"
            >
              Delete Selected
            </button>
          )}
        </div>
      </form>

      
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3"></th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Salary</th>
              <th className="p-3">Dept</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.id!)}
                    onChange={() => handleSelect(emp.id!)}
                  />
                </td>
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.salary}</td>
                <td className="p-3">{getDepartmentName(emp.departmentId)}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id!)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {employees.length === 0 && (
          <p className="p-4 text-gray-500 text-center text-sm">
            No employees found
          </p>
        )}
      </div>
    </div>
  );
}

export default Employees;