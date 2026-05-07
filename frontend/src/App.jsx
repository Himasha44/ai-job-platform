import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import EmployerDashboard from "./pages/EmployerDashboard";
import AiResume from "./pages/AiResume";
import "./App.css";

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isAuthPage =
        location.pathname === "/login" || location.pathname === "/register";

    return (
        <div className="app-shell">
            {!isAuthPage && (
                <header className="topbar">
                    <div className="brand-block">
                        <div className="brand-logo">AJ</div>
                        <div>
                            <h1 className="brand-title">AI Job Platform</h1>
                            <p className="brand-subtitle">Smart hiring and career growth</p>
                        </div>
                    </div>

                    <nav className="top-nav">
                        <Link to="/" className="nav-item">Jobs</Link>
                        <Link to="/ai-resume" className="nav-item">AI Resume</Link>

                        {user?.role === "employer" && (
                            <Link to="/employer" className="nav-item">
                                Employer Dashboard
                            </Link>
                        )}

                        {!user ? (
                            <>
                                <Link to="/login" className="nav-item outline-btn">Login</Link>
                                <Link to="/register" className="nav-item solid-btn">Register</Link>
                            </>
                        ) : (
                            <div className="user-area">
                                <div className="user-badge">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-role">{user.role}</span>
                                </div>
                                <button className="danger-btn" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </nav>
                </header>
            )}

            <main className={isAuthPage ? "auth-main" : "content-main"}>
                <Routes>
                    <Route path="/" element={<Jobs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/employer" element={<EmployerDashboard />} />
                    <Route path="/ai-resume" element={<AiResume />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;