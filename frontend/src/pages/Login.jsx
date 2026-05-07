import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await API.post("/users/login", formData);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            navigate("/");
        } catch (error) {
            console.error("Login error:", error);

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data ||
                "Login failed. Please check your email and password.";

            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <div className="auth-left">
                <div>
                    <div className="auth-logo">AI Job Platform</div>

                    <h2>Welcome back</h2>

                    <p>
                        Login to explore job opportunities, apply for openings, post jobs as
                        an employer, and use AI-powered career tools.
                    </p>

                    <div className="auth-feature-list">
                        <div className="auth-feature">Find suitable jobs</div>
                        <div className="auth-feature">Apply as a job seeker</div>
                        <div className="auth-feature">Post jobs as an employer</div>
                    </div>
                </div>

                <p className="auth-footer-text">
                    Smart job matching and skill development platform.
                </p>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h3>Login</h3>
                    <p>Enter your account details to continue</p>

                    {message && <div className="message">{message}</div>}

                    <form className="form-grid" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="auth-switch-text">
                        Don’t have an account? <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;