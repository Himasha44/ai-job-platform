import { useEffect, useState } from "react";
import API from "../api/api";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [message, setMessage] = useState("");

    const [selectedJob, setSelectedJob] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);

    const [applicationData, setApplicationData] = useState({
        phone: "",
        portfolio_url: "",
        cover_letter: "",
    });

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

    const openApplicationForm = (job) => {
        if (!user) {
            setMessage("Please login before applying.");
            return;
        }

        if (user.role !== "jobseeker") {
            setMessage("Only job seekers can apply for jobs.");
            return;
        }

        setSelectedJob(job);
        setMessage("");
    };

    const closeApplicationForm = () => {
        setSelectedJob(null);
        setResumeFile(null);
        setApplicationData({
            phone: "",
            portfolio_url: "",
            cover_letter: "",
        });
    };

    const handleApplicationChange = (e) => {
        setApplicationData({
            ...applicationData,
            [e.target.name]: e.target.value,
        });
    };

    const submitApplication = async (e) => {
        e.preventDefault();

        if (!resumeFile) {
            setMessage("Please upload your resume.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("user_id", user.id);
            formData.append("job_id", selectedJob.id);
            formData.append("phone", applicationData.phone);
            formData.append("portfolio_url", applicationData.portfolio_url);
            formData.append("cover_letter", applicationData.cover_letter);
            formData.append("resume", resumeFile);

            await API.post("/applications", formData);

            setMessage("Application uploaded successfully.");
            closeApplicationForm();
        } catch (error) {
            console.error(error);

            const errorMessage =
                error.response?.data?.message || "Application upload failed.";

            setMessage(errorMessage);
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
                        Explore job opportunities, connect with employers, and upload your
                        complete application with a resume and cover letter.
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
                                {job.location && (
                                    <span className="meta-pill">📍 {job.location}</span>
                                )}
                                {job.salary && (
                                    <span className="meta-pill">💰 {job.salary}</span>
                                )}
                                <span className="meta-pill">
                  Posted by User #{job.created_by}
                </span>
                            </div>

                            <button
                                className="primary-btn"
                                onClick={() => openApplicationForm(job)}
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedJob && (
                <div className="modal-overlay">
                    <div className="application-modal">
                        <div className="modal-header">
                            <div>
                                <h3>Upload Application</h3>
                                <p>
                                    Applying for <strong>{selectedJob.title}</strong> at{" "}
                                    <strong>{selectedJob.company}</strong>
                                </p>
                            </div>

                            <button className="close-btn" onClick={closeApplicationForm}>
                                ×
                            </button>
                        </div>

                        <form className="form-grid" onSubmit={submitApplication}>
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="0771234567"
                                    value={applicationData.phone}
                                    onChange={handleApplicationChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Portfolio / LinkedIn URL</label>
                                <input
                                    type="text"
                                    name="portfolio_url"
                                    placeholder="https://yourportfolio.com"
                                    value={applicationData.portfolio_url}
                                    onChange={handleApplicationChange}
                                />
                            </div>

                            <div className="input-group">
                                <label>Cover Letter</label>
                                <textarea
                                    name="cover_letter"
                                    placeholder="Write a short message to the employer..."
                                    value={applicationData.cover_letter}
                                    onChange={handleApplicationChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="input-group">
                                <label>Upload Resume</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                    required
                                />
                                <small>Accepted formats: PDF, DOC, DOCX. Max size: 5MB.</small>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={closeApplicationForm}
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="primary-btn">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Jobs;