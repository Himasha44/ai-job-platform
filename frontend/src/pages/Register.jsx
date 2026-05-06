import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
            setMessage("Registration successful. Please login.");
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            setMessage("Registration failed. Email may already exist.");
            console.error(error);
        }
    };

    return (
        <div className="page">
            <div className="form-card">
                <h2>Create Account</h2>

                {message && <p className="message">{message}</p>}

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="jobseeker">Job Seeker</option>
                        <option value="employer">Employer</option>
                        <option value="trainer">Trainer</option>
                    </select>

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;