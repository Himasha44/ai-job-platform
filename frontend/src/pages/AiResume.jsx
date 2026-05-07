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

            const response = await API.post("/ai/analyze-resume", {
                resumeText,
            });

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

            const response = await API.post("/ai/recommend-jobs", {
                resumeText,
            });

            setRecommendations(response.data.result);
            setMessage("Recommendations generated successfully.");
        } catch (error) {
            console.error(error);
            setMessage("AI job recommendation failed.");
        }
    };

    return (
        <div className="page">
            <div className="form-card wide-card">
                <h2>AI Resume Analyzer</h2>
                <p>
                    Paste your resume text below. The AI will extract your skills and
                    recommend suitable jobs.
                </p>

                {message && <p className="message">{message}</p>}

                <textarea
                    placeholder="Paste your resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                ></textarea>

                <div className="button-group">
                    <button onClick={analyzeResume}>Analyze Resume</button>
                    <button onClick={getRecommendations}>Recommend Jobs</button>
                </div>

                {analysis && (
                    <div className="result-box">
                        <h3>Resume Analysis</h3>

                        <p>
                            <strong>Summary:</strong> {analysis.summary}
                        </p>

                        <p>
                            <strong>Experience:</strong> {analysis.experience}
                        </p>

                        <p>
                            <strong>Education:</strong> {analysis.education}
                        </p>

                        <h4>Skills</h4>
                        <ul>
                            {analysis.skills?.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>

                        <h4>Recommended Job Titles</h4>
                        <ul>
                            {analysis.recommended_job_titles?.map((title, index) => (
                                <li key={index}>{title}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {recommendations && (
                    <div className="result-box">
                        <h3>Recommended Jobs</h3>

                        {recommendations.recommendations?.map((job, index) => (
                            <div className="recommendation-card" key={index}>
                                <h4>{job.job_title}</h4>
                                <p>
                                    <strong>Company:</strong> {job.company}
                                </p>
                                <p>
                                    <strong>Match Score:</strong> {job.match_score}%
                                </p>
                                <p>
                                    <strong>Reason:</strong> {job.reason}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AiResume;