const db = require("../config/db");
const fs = require("fs");
const path = require("path");

exports.applyJob = (req, res) => {
    const { user_id, job_id, phone, portfolio_url, cover_letter } = req.body;

    if (!user_id || !job_id) {
        return res.status(400).json({
            message: "User ID and Job ID are required",
        });
    }

    if (!req.file) {
        return res.status(400).json({
            message: "Resume file is required",
        });
    }

    const resumePath = `uploads/resumes/${req.file.filename}`;
    const resumeOriginalName = req.file.originalname;

    // Prevent same user applying for same job multiple times
    db.query(
        "SELECT * FROM applications WHERE user_id = ? AND job_id = ?",
        [user_id, job_id],
        (checkErr, existingApplications) => {
            if (checkErr) {
                return res.status(500).json(checkErr);
            }

            if (existingApplications.length > 0) {
                // Delete uploaded file because application already exists
                const uploadedFilePath = path.join(__dirname, "../", resumePath);

                if (fs.existsSync(uploadedFilePath)) {
                    fs.unlinkSync(uploadedFilePath);
                }

                return res.status(409).json({
                    message: "You have already applied for this job",
                });
            }

            db.query(
                `INSERT INTO applications 
        (user_id, job_id, phone, portfolio_url, cover_letter, resume_path, resume_original_name) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    user_id,
                    job_id,
                    phone,
                    portfolio_url,
                    cover_letter,
                    resumePath,
                    resumeOriginalName,
                ],
                (err) => {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.json({
                        message: "Application submitted successfully",
                        application: {
                            user_id,
                            job_id,
                            phone,
                            portfolio_url,
                            cover_letter,
                            resume_path: resumePath,
                            resume_original_name: resumeOriginalName,
                        },
                    });
                }
            );
        }
    );
};

exports.getApplications = (req, res) => {
    const query = `
    SELECT 
      applications.*,
      users.name AS applicant_name,
      users.email AS applicant_email,
      jobs.title AS job_title,
      jobs.company AS company
    FROM applications
    JOIN users ON applications.user_id = users.id
    JOIN jobs ON applications.job_id = jobs.id
    ORDER BY applications.applied_at DESC
  `;

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};