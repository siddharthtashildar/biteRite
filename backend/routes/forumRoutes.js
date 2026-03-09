const express = require("express");
const router = express.Router();

const forumController = require("../controllers/forumController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, forumController.createPost);

router.get("/posts", forumController.getPosts);

router.post("/comment/:id", auth, forumController.comment);

module.exports = router;