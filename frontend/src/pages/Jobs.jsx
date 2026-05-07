import { useEffect, useState } from "react";
import API from "../api/api";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [message, setMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchJobs = async () => {
        try {
            const response = await API.get("/jobs");
            setJobs(response.data);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load jobs.");
        }
    };

    const applyJob = async (jobId) => {
        if (!user) {
            setMessage("Please login before applying.");
            return;
        }

        if (user.role !== "jobseeker") {
            setMessage("Only job seekers can apply for jobs.");
            return;
        }

        try {
            await API.post("/applications", {
                user_id: user.id,
                job_id: jobId,
            });

            setMessage("Application submitted successfully.");
        } catch (error) {
            console.error(error);
            setMessage("Application failed.");
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div>
            <section className="hero">
                <div>
                    <h2>Discover your next career move</h2>
                    <p>
                        Explore job opportunities, connect with employers, and use AI-powered
                        tools to better understand your skills and career path.
                    </p>
                </div>

                <div className="hero-stats">
                    <div className="stat-card">
                        <h3>{jobs.length}</h3>
                        <span>Available Jobs</span>
                    </div>
                    <div className="stat-card">
                        <h3>{user ? "1" : "0"}</h3>
                        <span>Active Session</span>
                    </div>
                    <div className="stat-card">
                        <h3>AI</h3>
                        <span>Smart Career Support</span>
                    </div>
                </div>
            </section>

            {message && <div className="message">{message}</div>}

            <div className="section-header">
                <div>
                    <h3>Open Positions</h3>
                    <p>Browse all currently available opportunities</p>
                </div>
                <div className="info-chip">
                    {user ? `Logged in as ${user.role}` : "Browse as guest"}
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="empty-state">
                    <h3>No jobs available yet</h3>
                    <p>Employers haven’t posted any jobs yet. Check back later.</p>
                </div>
            ) : (
                <div className="jobs-grid">
                    {jobs.map((job) => (
                        <div className="job-card" key={job.id}>
                            <div className="job-card-top">
                                <div>
                                    <h4>{job.title}</h4>
                                    <div className="job-company">{job.company}</div>
                                </div>
                                <div className="meta-pill">Job ID #{job.id}</div>
                            </div>

                            <p className="job-description">{job.description}</p>

                            <div className="job-meta">
                                {job.location && <span className="meta-pill">📍 {job.location}</span>}
                                {job.salary && <span className="meta-pill">💰 {job.salary}</span>}
                                <span className="meta-pill">Posted by User #{job.created_by}</span>
                            </div>

                            <button className="primary-btn" onClick={() => applyJob(job.id)}>
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Jobs;