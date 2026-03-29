import { Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      
      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#eee" }}>
        <img src="https://via.placeholder.com/50" alt="logo" />
       <button
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }}
>
  Logout
</button>
      </header>

      {/* BODY */}
      <main style={{ flex: 1, padding: "10px", overflow: "auto" }}>
        <Outlet />
      </main>

      {/* FOOTER NAV */}
      <footer style={{ display: "flex", justifyContent: "space-around", padding: "10px", background: "#eee" }}>
        <button onClick={() => navigate("/app")}>Employees</button>
        <button onClick={() => navigate("/app/attendance")}>Attendance</button>
      </footer>

    </div>
  );
}

export default Layout;