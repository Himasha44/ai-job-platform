import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "jobseeker",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await API.post("/users/register", formData);
            setMessage("Registration successful. Redirecting to login...");
            setTimeout(() => navigate("/login"), 1200);
        } catch (error) {
            setMessage("Registration failed. Email may already exist.");
            console.error(error);
        }
    };

    return (
        <div className="auth-layout">
            <div className="auth-left">
                <div>
                    <h2>Create your account</h2>
                    <p>
                        Join the platform as a job seeker, employer, or trainer and start
                        using a more structured and modern hiring environment.
                    </p>

                    <div className="auth-feature-list">
                        <div className="auth-feature">Job seekers can apply for relevant roles</div>
                        <div className="auth-feature">Employers can post and manage openings</div>
                        <div className="auth-feature">AI-powered assistance can guide decisions</div>
                    </div>
                </div>

                <p>Built to connect talent, learning, and opportunity in one platform.</p>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h3>Register</h3>
                    <p>Set up your profile to get started</p>

                    {message && <div className="message">{message}</div>}

                    <form className="form-grid" onSubmit={handleRegister}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

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
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="jobseeker">Job Seeker</option>
                                <option value="employer">Employer</option>
                                <option value="trainer">Trainer</option>
                            </select>
                        </div>

                        <button type="submit" className="primary-btn">Create Account</button>
                    </form>

                    <p style={{ marginTop: "18px" }}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;