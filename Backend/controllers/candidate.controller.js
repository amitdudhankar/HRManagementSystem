// controllers/candidate.controller.js
const XLSX = require("xlsx");
const moment = require("moment");
const Candidate = require("../models/Candidate");
const fs = require("fs").promises;

exports.uploadCandidates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Validate required fields
    const requiredFields = ["name", "phone", "email", "experience", "skills", "location"];
    for (const candidate of jsonData) {
      for (const field of requiredFields) {
        if (!candidate[field]) {
          return res.status(400).json({ message: `Missing required field: ${field}` });
        }
      }
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email)) {
        return res.status(400).json({ message: `Invalid email format for ${candidate.email}` });
      }
      // Validate experience is a number
      if (typeof candidate.experience !== "number" || candidate.experience < 0) {
        return res.status(400).json({ message: `Invalid experience for ${candidate.name}` });
      }
    }

    // Check for duplicate emails
    const emails = jsonData.map((c) => c.email);
    const existingCandidates = await Candidate.find({ email: { $in: emails } });
    if (existingCandidates.length > 0) {
      return res.status(400).json({
        message: "Duplicate emails found",
        duplicates: existingCandidates.map((c) => c.email),
      });
    }

    // Insert candidates
    await Candidate.insertMany(jsonData);

    // Delete the uploaded file
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error("File deletion error:", unlinkError);
      // Continue execution even if file deletion fails
    }

    res.status(200).json({ message: "Candidates uploaded successfully", count: jsonData.length });
  } catch (error) {
    console.error("Excel Upload Error:", error);
    res.status(500).json({ message: `Error uploading candidates: ${error.message}` });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ]
    };

    const total = await Candidate.countDocuments(query);
    const candidates = await Candidate.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: candidates,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Candidates Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch candidates" });
  }
};

exports.updateCandidateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Candidate status updated",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ message: "Error updating status" });
  }
};
exports.getCandidateStats = async (req, res) => {
  try {
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    //  Count of all candidates
    const totalCandidates = await Candidate.countDocuments();

    //  Count of calls made today (any status update today)
    const totalCallsToday = await Candidate.countDocuments({
      updatedAt: { $gte: todayStart, $lte: todayEnd },
    });

    //  Count by status
    const statusAggregation = await Candidate.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      Connected: 0,
      "Not Connected": 0,
      Shortlisted: 0,
      Rejected: 0,
      Interested: 0,
    };

    statusAggregation.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    return res.json({
      totalCandidates,
      totalCallsToday,
      ...statusCounts,
    });
  } catch (error) {
    console.error("Error in getCandidateStats:", error);
    res.status(500).json({ message: "Failed to get stats" });
  }
};
