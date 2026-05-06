const db = require("../config/db");

exports.createJob = (req, res) => {
    const { title, description, company, created_by } = req.body;

    db.query(
        "INSERT INTO jobs (title, description, company, created_by) VALUES (?, ?, ?, ?)",
        [title, description, company, created_by],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Job created" });
        }
    );
};

exports.getJobs = (req, res) => {
    db.query("SELECT * FROM jobs", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};