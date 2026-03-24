const Post = require("../models/Post"); // Import your Mongoose model

// 1. Create a Post (Saves to MongoDB)
exports.createPost = async (req, res) => {
  try {
    const { content, authorName } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Use the Mongoose Model to create a new document
    const post = new Post({
      content: content.trim(),
      authorName: authorName && authorName.trim() ? authorName.trim() : "Anonymous",
      imageUrl: imageUrl,
      likesCount: 0,
      comments: []
    });

    const savedPost = await post.save(); // This sends it to Atlas!
    res.json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get All Posts (Fetches from MongoDB)
exports.getPosts = async (req, res) => {
  try {
    // Sort logic: Recipes with most upvotes first, then by date
    const posts = await Post.find().sort({ upvotes: -1, createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleUpvote = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    const index = post.upvotes.indexOf(userId);
    if (index === -1) {
      post.upvotes.push(userId); // Approve
    } else {
      post.upvotes.splice(index, 1); // Remove approval
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 3. Add a Comment
exports.comment = async (req, res) => {
  try {
    const { content, authorName } = req.body;
    
    // Find post by ID and push a new comment object into the array
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          comments: { 
            content: content.trim(), 
            authorName: authorName || "User" 
          } 
        } 
      },
      { new: true } // Return the updated document
    );

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Toggle Like (Increment counter)
exports.toggleLike = async (req, res) => {
  try {
    const { userId } = req.body; // Pass the user's ID from frontend
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId); // Like
    } else {
      post.likes.splice(index, 1); // Unlike
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    // Optional: Delete the image file from /uploads if it exists
    if (post.imageUrl) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', post.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};