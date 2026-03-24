const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const forumController = require("../controllers/forumController");

// Configure multer storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueSuffix + "-" + safeName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  }
});

// Public forum endpoints: no authentication required
router.post("/create", upload.single("image"), forumController.createPost);

router.get("/posts", forumController.getPosts);

router.post("/comment/:id", forumController.comment);

router.post("/like/:id", forumController.toggleLike);

router.post("/upvote/:id", forumController.toggleUpvote);

router.delete("/delete/:id", forumController.deletePost);

module.exports = router;