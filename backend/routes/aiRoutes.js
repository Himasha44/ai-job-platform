const router = require("express").Router();

const {
    analyzeResume,
    recommendJobs,
} = require("../controllers/aiController");

router.post("/analyze-resume", analyzeResume);
router.post("/recommend-jobs", recommendJobs);

module.exports = router;