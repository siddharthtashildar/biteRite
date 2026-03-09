const express = require("express");
const router = express.Router();

const forumController = require("../controllers/forumController");

// Public forum endpoints: no authentication required
router.post("/create", forumController.createPost);

router.get("/posts", forumController.getPosts);

router.post("/comment/:id", forumController.comment);

router.post("/like/:id", forumController.toggleLike);

module.exports = router;