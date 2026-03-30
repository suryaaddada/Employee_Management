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

    setForm({
      ...form,
      [name]: value,
    });
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
      name: form.name,
      email: form.email,
      phone: form.phone,
      salary: Number(form.salary),
      departmentId: Number(form.departmentId),
    };

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
  };

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    loadEmployees();
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("No employees selected");
      return;
    }

    await deleteMultipleEmployees(selectedIds);
    setSelectedIds([]);
    loadEmployees();
  };

  const getDepartmentName = (id: number) =>
    departments.find((d) => d.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <h2 className="text-xl font-semibold text-gray-700">
        Employees
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-3 bg-white p-4 rounded border"
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="departmentId"
          value={form.departmentId}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            {editingId ? "Update" : "Add"}
          </button>

          <button
            type="button"
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete Selected
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Select</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Dept</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">

                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.id!)}
                    onChange={() => handleSelect(emp.id!)}
                  />
                </td>

                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.email}</td>
                <td className="p-2">{emp.salary}</td>
                <td className="p-2">{getDepartmentName(emp.departmentId)}</td>

                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(emp.id!)}
                    className="text-red-500"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleEdit(emp)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Employees;