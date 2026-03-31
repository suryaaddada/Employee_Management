import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { exportEmployees, exportAttendance,exportDepartments,exportSalary } from "../services/reportService";
import {logout} from "../services/authService";

function Layout() {
  const navigate = useNavigate();
  const [showReports, setShowReports] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <aside
        style={{
          width: "220px",
          background: "#1f2937",
          color: "white",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>HR SYSTEM</h3>

        <button onClick={() => navigate("/app")} style={btnStyle}>
          Employees
        </button>

        <button onClick={() => navigate("/app/attendance")} style={btnStyle}>
          Attendance
        </button>

        <button onClick={() => navigate("/app/analysis")} style={btnStyle}>
          Analysis
        </button>

       <button
          onClick={() => setShowReports(!showReports)}
          style={btnStyle}>
          Reports ▼
        </button>

        {showReports && (
          <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
            
            <button onClick={exportEmployees} style={subBtn}>
              Export Employees
            </button>

              <button onClick={exportDepartments} style={subBtn}>
                Export Departments
              </button>

              <button onClick={exportAttendance} style={subBtn}>
                Export Attendance
              </button>

            <button onClick={exportSalary} style={subBtn}>
              Export Salary
            </button>

          </div>
        )} 
        <button
            onClick={async () => {
              await logout(); 
              navigate("/login");}} style={btnStyle} >
            Logout
          </button>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        

        
        <main style={{ flex: 1, padding: "10px", overflow: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "transparent",
  color: "white",
  border: "1px solid #374151",
  padding: "8px",
  cursor: "pointer",
  textAlign: "left"
}; 

const subBtn: React.CSSProperties = {
  background: "#374151",
  color: "white",
  border: "none",
  padding: "6px",
  cursor: "pointer",
  textAlign: "left"
};

export default Layout;