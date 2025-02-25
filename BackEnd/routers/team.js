// routes/team.js
const express = require("express");
const Team = require("../models/team");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();


// Create a new team
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { name, members } = req.body;
    const newTeam = new Team({ name, members });
    await newTeam.save();
    res.status(201).json({ success: true, message: "Team created successfully", data: newTeam });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating team" });
  }
});

// Get all teams
router.get("/", verifyToken, async (req, res) => {
  try {
    const teams = await Team.find().populate("members", "fullname");
    res.status(200).json({ success: true, data: teams });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching teams" });
  }
});

// Get a team by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("members", "fullname");
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });
    res.status(200).json({ success: true, data: team });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching team" });
  }
});

// Update a team
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updatedTeam) return res.status(404).json({ success: false, message: "Team not found" });
    res.status(200).json({ success: true, message: "Team updated successfully", data: updatedTeam });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating team" });
  }
});

// Delete a team
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) return res.status(404).json({ success: false, message: "Team not found" });
    res.status(200).json({ success: true, message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting team" });
  }
});

module.exports = router;