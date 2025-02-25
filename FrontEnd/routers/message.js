const express = require("express");
const Message = require("../models/message");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();


router.post("/sent", verifyToken, async (req, res) => {
  try {
    const { content, recipient, team } = req.body;
    const newMessage = new Message({ content, sender: req.user._id, recipient, team });
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending message" });
  }
});


router.get("/", verifyToken, async (req, res) => {
  try {
    const { recipient, team } = req.query;
    const filter = recipient ? { recipient } : { team };
    const messages = await Message.find(filter).populate("sender", "fullname").populate("recipient", "fullname");
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching messages" });
  }
});


router.get("/:id", verifyToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate("sender", "fullname").populate("recipient", "fullname");
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching message" });
  }
});


router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, { content }, { new: true });
    if (!updatedMessage) return res.status(404).json({ success: false, message: "Message not found" });
    res.status(200).json({ success: true, message: "Message updated successfully", data: updatedMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating message" });
  }
});


router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) return res.status(404).json({ success: false, message: "Message not found" });
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting message" });
  }
});

module.exports = router;