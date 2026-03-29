import { useEffect, useState } from "react";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
    updateEmployee,
} from "../services/employeeService";

interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
  phone: string;
  departmentId: number;
}

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    salary: "",
    phone: "",
    departmentId: "",
  });

  const loadEmployees = () => {
    getEmployees().then(setEmployees);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  return (
    <div>
      <h2>Employees</h2>

      {/* Add Form */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}/>
        <input name="departmentId" placeholder="Department Id" value={form.departmentId} onChange={handleChange} />

       <button type="submit">
  {editingId ? "Update Employee" : "Add Employee"}
</button>
      </form>

      <br />

      {/* Table */}
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
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
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.salary}</td>
              <td>{emp.departmentId}</td>
              <td>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
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