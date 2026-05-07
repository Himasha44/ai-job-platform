const OpenAI = require("openai");
const db = require("../config/db");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Analyze resume text and extract skills
exports.analyzeResume = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText) {
            return res.status(400).json({
                message: "Resume text is required",
            });
        }

        const response = await client.responses.create({
            model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
            input: `
You are an AI resume parser for a job platform.

Analyze this resume text and return ONLY valid JSON.

Resume:
${resumeText}

Return JSON in this exact structure:
{
  "skills": [],
  "experience": "",
  "education": "",
  "recommended_job_titles": [],
  "summary": ""
}
`,
        });

        const aiText = response.output_text;

        let parsedResult;

        try {
            parsedResult = JSON.parse(aiText);
        } catch (error) {
            parsedResult = {
                raw_response: aiText,
            };
        }

        res.json({
            message: "Resume analyzed successfully",
            result: parsedResult,
        });
    } catch (error) {
        console.error("AI resume analysis error:", error);
        res.status(500).json({
            message: "AI resume analysis failed",
            error: error.message,
        });
    }
};

// Recommend jobs using resume text and existing jobs from database
exports.recommendJobs = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText) {
            return res.status(400).json({
                message: "Resume text is required",
            });
        }

        db.query("SELECT * FROM jobs", async (err, jobs) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (jobs.length === 0) {
                return res.json({
                    message: "No jobs available for recommendation",
                    recommendations: [],
                });
            }

            const response = await client.responses.create({
                model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
                input: `
You are an AI job recommendation assistant.

Compare the resume with the job list and recommend the best matching jobs.

Resume:
${resumeText}

Jobs:
${JSON.stringify(jobs)}

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "job_id": 1,
      "job_title": "",
      "company": "",
      "match_score": 0,
      "reason": ""
    }
  ]
}
`,
            });

            const aiText = response.output_text;

            let parsedResult;

            try {
                parsedResult = JSON.parse(aiText);
            } catch (error) {
                parsedResult = {
                    raw_response: aiText,
                };
            }

            res.json({
                message: "Job recommendations generated successfully",
                result: parsedResult,
            });
        });
    } catch (error) {
        console.error("AI job recommendation error:", error);
        res.status(500).json({
            message: "AI job recommendation failed",
            error: error.message,
        });
    }
};