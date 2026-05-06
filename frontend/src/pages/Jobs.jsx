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

            setMessage("Applied successfully.");
        } catch (error) {
            console.error(error);
            setMessage("Application failed.");
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="page">
            <h1>Available Jobs</h1>

            {message && <p className="message">{message}</p>}

            <div className="job-list">
                {jobs.length === 0 ? (
                    <p>No jobs available yet.</p>
                ) : (
                    jobs.map((job) => (
                        <div className="job-card" key={job.id}>
                            <h3>{job.title}</h3>
                            <p>{job.description}</p>
                            <p>
                                <strong>Company:</strong> {job.company}
                            </p>

                            {job.location && (
                                <p>
                                    <strong>Location:</strong> {job.location}
                                </p>
                            )}

                            {job.salary && (
                                <p>
                                    <strong>Salary:</strong> {job.salary}
                                </p>
                            )}

                            <button onClick={() => applyJob(job.id)}>Apply</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Jobs;