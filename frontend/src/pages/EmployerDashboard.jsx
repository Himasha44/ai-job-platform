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
            <div className="page">
                <h2>Access Denied</h2>
                <p>Only employers can access this page.</p>
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
        <div className="page">
            <div className="form-card">
                <h2>Employer Dashboard</h2>
                <p>Post a new job opening</p>

                {message && <p className="message">{message}</p>}

                <form onSubmit={createJob}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Job title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Job description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>

                    <input
                        type="text"
                        name="company"
                        placeholder="Company name"
                        value={formData.company}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="salary"
                        placeholder="Salary"
                        value={formData.salary}
                        onChange={handleChange}
                    />

                    <button type="submit">Post Job</button>
                </form>
            </div>
        </div>
    );
}

export default EmployerDashboard;