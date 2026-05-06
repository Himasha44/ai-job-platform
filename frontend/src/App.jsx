import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import EmployerDashboard from "./pages/EmployerDashboard";

function App() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
      <div>
        <nav className="navbar">
          <h2>AI Job Platform</h2>

          <div className="nav-links">
            <Link to="/">Jobs</Link>

            {user?.role === "employer" && (
                <Link to="/employer">Employer Dashboard</Link>
            )}

            {!user ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
            ) : (
                <button onClick={logout}>Logout</button>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employer" element={<EmployerDashboard />} />
        </Routes>
      </div>
  );
}

export default App;