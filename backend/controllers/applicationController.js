const db = require("../config/db");

exports.applyJob = (req, res) => {
    const { user_id, job_id } = req.body;

    db.query(
        "INSERT INTO applications (user_id, job_id) VALUES (?, ?)",
        [user_id, job_id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Applied successfully" });
        }
    );
};

exports.getApplications = (req, res) => {
    db.query("SELECT * FROM applications", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};