import { useEffect, useState } from "react";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
  deleteMultipleEmployees,
} from "../services/employeeService";


import type { Employee } from "../models/Employee"; 

import { getDepartments } from "../services/DepartmentService";
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
  const target = e.target;

  const { name, value } = target;

  const isCheckbox = target instanceof HTMLInputElement && target.type === "checkbox";

  setForm({
    ...form,
    [name]: isCheckbox
      ? target.checked
      : name === "employeeId" || name === "departmentId"
      ? Number(value)
      : value
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
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const getDepartmentName = (id: number) => {
  return departments.find(d => d.id === id)?.name || "Unknown";
};

  const handleBulkDelete = async () => {
  if (selectedIds.length === 0) {
    alert("No employees selected");
    return;
  }

  try {
    await deleteMultipleEmployees(selectedIds);

    const res = await getEmployees();
    setEmployees(res);

    setSelectedIds([]);
  } catch (err) {
    console.log(err);
  }
};
  return (
    <div>
      <h2>Employees</h2>

      {/* Add Form */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}/>
        <select
  name="departmentId"
  value={form.departmentId}
  onChange={handleChange}
>
  <option value="">Select Department</option>

  {departments.map((dept) => (
    <option key={dept.id} value={dept.id}>
      {dept.name}
    </option>
  ))}
</select>

       <button type="submit">
  {editingId ? "Update Employee" : "Add Employee"}
</button>
<button onClick={handleBulkDelete}>
  Delete Selected
</button>
      </form>

      <br />

      {/* Table */}
      <table border={1} cellPadding={10}>
        <thead>
          
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Dept</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}> 
            <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(emp.id!)}
                  onChange={() => handleSelect(emp.id!)}
                />
              </td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.salary}</td>
              <td>{getDepartmentName(emp.departmentId)}</td>
              <td>
                <button onClick={() =>handleDelete(emp.id!)}>Delete</button>
                <button onClick={() => handleEdit(emp)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;