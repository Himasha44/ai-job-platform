import { useState } from "react";
import API from "../api/api";

function AiResume() {
    const [resumeText, setResumeText] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [message, setMessage] = useState("");

    const analyzeResume = async () => {
        if (!resumeText.trim()) {
            setMessage("Please paste your resume text first.");
            return;
        }

        try {
            setMessage("Analyzing resume...");
            setRecommendations(null);

            const response = await API.post("/ai/analyze-resume", { resumeText });
            setAnalysis(response.data.result);
            setMessage("Resume analyzed successfully.");
        } catch (error) {
            console.error(error);
            setMessage("AI resume analysis failed.");
        }
    };

    const getRecommendations = async () => {
        if (!resumeText.trim()) {
            setMessage("Please paste your resume text first.");
            return;
        }

        try {
            setMessage("Generating job recommendations...");
            setAnalysis(null);

            const response = await API.post("/ai/recommend-jobs", { resumeText });
            setRecommendations(response.data.result);
            setMessage("Recommendations generated successfully.");
        } catch (error) {
            console.error(error);
            setMessage("AI job recommendation failed.");
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <h2>AI Resume Studio</h2>
                <p>
                    Paste resume content to extract skills, summarize qualifications, and
                    get job recommendations.
                </p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h4>Resume Input</h4>

                    {message && <div className="message">{message}</div>}

                    <div className="form-grid">
                        <div className="input-group">
                            <label>Resume Text</label>
                            <textarea
                                placeholder="Paste your full resume text here..."
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                            ></textarea>
                        </div>

                        <button className="primary-btn" onClick={analyzeResume}>
                            Analyze Resume
                        </button>
                        <button className="secondary-btn" onClick={getRecommendations}>
                            Recommend Jobs
                        </button>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h4>AI Output</h4>

                    {!analysis && !recommendations && (
                        <div className="empty-state">
                            <p>No AI results yet. Start by analyzing your resume.</p>
                        </div>
                    )}

                    {analysis && (
                        <div className="result-box">
                            <div className="result-card">
                                <h4>Professional Summary</h4>
                                <p>{analysis.summary}</p>
                            </div>

                            <div className="result-card">
                                <h4>Experience</h4>
                                <p>{analysis.experience}</p>
                            </div>

                            <div className="result-card">
                                <h4>Education</h4>
                                <p>{analysis.education}</p>
                            </div>

                            <div className="result-card">
                                <h4>Skills</h4>
                                <div className="skills-list">
                                    {analysis.skills?.map((skill, index) => (
                                        <span className="skill-tag" key={index}>
                      {skill}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div className="result-card">
                                <h4>Recommended Job Titles</h4>
                                <div className="skills-list">
                                    {analysis.recommended_job_titles?.map((title, index) => (
                                        <span className="skill-tag" key={index}>
                      {title}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {recommendations && (
                        <div className="result-box">
                            {recommendations.recommendations?.map((job, index) => (
                                <div className="recommendation-card" key={index}>
                                    <h4>{job.job_title}</h4>
                                    <p><strong>Company:</strong> {job.company}</p>
                                    <p><strong>Match Score:</strong> {job.match_score}%</p>
                                    <p><strong>Reason:</strong> {job.reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AiResume;