// Simple in-memory store for forum posts so the forum
// works even if MongoDB is not available.
let posts = [];
let nextId = 1;

exports.createPost = async (req, res) => {

  try {

    const { content, authorName } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const now = new Date();

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = {
      _id: String(nextId++),
      content: content.trim(),
      authorName:
        authorName && authorName.trim() ? authorName.trim() : "Anonymous",
      imageUrl,
      likesCount: 0,
      comments: [],
      createdAt: now,
      updatedAt: now
    };

    posts.unshift(post);

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getPosts = async (req, res) => {

  try {

    res.json(posts);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.comment = async (req, res) => {

  try {

    const post = posts.find((p) => p._id === req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { content, authorName } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = {
      content: content.trim(),
      authorName:
        authorName && authorName.trim() ? authorName.trim() : "User",
      createdAt: new Date()
    };

    post.comments.push(comment);
    post.updatedAt = new Date();

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.toggleLike = async (req, res) => {

  try {

    const post = posts.find((p) => p._id === req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likesCount = (post.likesCount || 0) + 1;
    post.updatedAt = new Date();

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};