// routes/candidate.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const candidateController = require("../controllers/candidate.controller");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

// Secure the upload route with JWT and role-based authorization
router.post(
  "/upload",
  verifyToken,
  authorizeRoles("admin"), // Restrict to admin and recruiter roles
  upload.single("file"),
  candidateController.uploadCandidates
);

// GET all candidates - accessible by admin and hr
router.get(
  "/get-candidates",
  verifyToken,
  authorizeRoles("admin", "hr"),
  candidateController.getCandidates
);
// GET all candidates - accessible by admin and hr
// routes/candidate.routes.js
router.post("/update-status/:id",
  verifyToken,
  authorizeRoles("admin", "hr"),
  candidateController.updateCandidateStatus
);
router.get(
  "/dashboard-stats",
  verifyToken,
  authorizeRoles("admin", "hr"),
  candidateController.getCandidateStats
);



module.exports = router;