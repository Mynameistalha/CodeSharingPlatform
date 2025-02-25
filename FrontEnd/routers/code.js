//routes/code.js
const express = require("express");
const Code = require("../models/code");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// Create a new code
router.post("/generate", verifyToken, async (req, res) => {
  try {
    const { title, language, code } = req.body;
    const newCode = new Code({ title, language, code, createdBy: req.user._id });
    await newCode.save();
    res.status(201).json({ success: true, message: "Code created successfully", data: newCode });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating code" });
  }
});

// Get all codes
router.get("/", verifyToken, async (req, res) => {
  try {
    const codes = await Code.find().populate("createdBy", "fullname");
    res.status(200).json({ success: true, data: codes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching codes" });
  }
});

// Get a code by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const code = await Code.findById(req.params.id).populate("createdBy", "fullname");
    if (!code) return res.status(404).json({ success: false, message: "Code not found" });
    res.status(200).json({ success: true, data: code });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching code" });
  }
});

// Update a code
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, language, code } = req.body;
    const updatedCode = await Code.findByIdAndUpdate(req.params.id, { title, language, code }, { new: true });
    if (!updatedCode) return res.status(404).json({ success: false, message: "Code not found" });
    res.status(200).json({ success: true, message: "Code updated successfully", data: updatedCode });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating code" });
  }
});

// Delete a code
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedCode = await Code.findByIdAndDelete(req.params.id);
    if (!deletedCode) return res.status(404).json({ success: false, message: "Code not found" });
    res.status(200).json({ success: true, message: "Code deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting code" });
  }
});

module.exports = router;