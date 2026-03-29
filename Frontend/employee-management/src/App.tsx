import { useEffect } from "react";
import { getEmployees } from "./services/employeeService";

function App() {
  useEffect(() => {
    getEmployees()
      .then(data => console.log("Employees:", data))
      .catch(err => console.log("Error:", err));
  }, []);

  return (
    <div>
      <h1>Employee Management System</h1>
    </div>
  );
}

export default App;