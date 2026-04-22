const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const authMiddleware = require("../middlewares/auth.middleware");

// POST /api/upload
// Expects form-data with key 'image'
// Returns: { success: true, imageUrl: "..." }
router.post("/", authMiddleware, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    res.status(200).json({
      success: true,
      imageUrl: req.file.path, // Cloudinary URL
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

module.exports = router;
