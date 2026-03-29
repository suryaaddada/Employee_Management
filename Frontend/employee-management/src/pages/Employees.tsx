import { useEffect, useState } from "react";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addEmployee({
      name: form.name,
      email: form.email,
      salary: Number(form.salary),
      phone: form.phone,
      departmentId: Number(form.departmentId),
    });

    setForm({
      name: "",
      email: "",
      salary: "",
        phone: "",
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

        <button type="submit">Add Employee</button>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;