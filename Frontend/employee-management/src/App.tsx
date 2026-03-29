import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import Layout from "./components/Layout";
import Employees from "./pages/Employees";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>


        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected layout */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Employees />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;