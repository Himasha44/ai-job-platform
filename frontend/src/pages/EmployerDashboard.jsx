import { useState } from "react";
import API from "../api/api";

function EmployerDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        company: "",
        location: "",
        salary: "",
    });

    const [message, setMessage] = useState("");

    if (!user || user.role !== "employer") {
        return (
            <div className="empty-state">
                <h3>Access Denied</h3>
                <p>Only employers can access this dashboard.</p>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const createJob = async (e) => {
        e.preventDefault();

        try {
            await API.post("/jobs", {
                ...formData,
                created_by: user.id,
            });

            setMessage("Job posted successfully.");

            setFormData({
                title: "",
                description: "",
                company: "",
                location: "",
                salary: "",
            });
        } catch (error) {
            console.error(error);
            setMessage("Failed to post job.");
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <h2>Employer Dashboard</h2>
                <p>Create and manage job opportunities from one place.</p>
            </div>

            <div className="summary-strip">
                <div className="summary-box">
                    <h4>Logged In User</h4>
                    <span>{user.name}</span>
                </div>
                <div className="summary-box">
                    <h4>Role</h4>
                    <span>{user.role}</span>
                </div>
                <div className="summary-box">
                    <h4>Platform Area</h4>
                    <span>Hiring</span>
                </div>
            </div>

            {message && <div className="message">{message}</div>}

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h4>Hiring Tips</h4>
                    <p>
                        Use clear job titles, detailed descriptions, and simple salary/location
                        information to attract better candidates.
                    </p>
                    <ul>
                        <li>Be specific about required skills</li>
                        <li>Write simple, readable job descriptions</li>
                        <li>Mention location and salary when possible</li>
                        <li>Post roles in a structured format</li>
                    </ul>
                </div>

                <div className="dashboard-card">
                    <h4>Post a New Job</h4>

                    <form className="form-grid" onSubmit={createJob}>
                        <div className="input-group">
                            <label>Job Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Frontend Developer Intern"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe responsibilities, required skills, and expectations..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="input-group">
                            <label>Company</label>
                            <input
                                type="text"
                                name="company"
                                placeholder="ABC Tech"
                                value={formData.company}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Colombo"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Salary</label>
                            <input
                                type="text"
                                name="salary"
                                placeholder="LKR 50,000"
                                value={formData.salary}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="primary-btn">Publish Job</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EmployerDashboard;