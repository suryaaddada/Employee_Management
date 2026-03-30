import { useEffect, useState } from "react";
import { getEmployees } from "../services/employeeService";
import { getDepartments } from "../services/departmentService";
import type { Employee } from "../models/Employee";
import type { Department } from "../models/Department";

function Analysis() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    getEmployees().then(setEmployees);
    getDepartments().then(setDepartments);
  }, []);

  const hiringTrend = employees.reduce((acc:Record<string,number>, emp) => {
    const date = new Date(emp.dateofjoining || new Date());
    const key = date.toLocaleString("default", { month: "short", year: "numeric" });

    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // 📊 Department Growth
  const deptGrowth = departments.map((dept) => ({
    name: dept.name,
    count: employees.filter(emp => emp.departmentId === dept.id).length
  }));

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold text-gray-700">
        Analysis
      </h2>

      {/* Hiring Trend */}
      <div className="bg-white border rounded p-4">
        <h3 className="font-semibold mb-2">Hiring Trend</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Month</th>
              <th className="p-2 text-left">Employees Joined</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(hiringTrend).map(([month, count]) => (
              <tr key={month} className="border-t">
                <td className="p-2">{month}</td>
                <td className="p-2">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Department Growth */}
      <div className="bg-white border rounded p-4">
        <h3 className="font-semibold mb-2">Department Growth</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Employee Count</th>
            </tr>
          </thead>
          <tbody>
            {deptGrowth.map((dept) => (
              <tr key={dept.name} className="border-t">
                <td className="p-2">{dept.name}</td>
                <td className="p-2">{dept.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Analysis;