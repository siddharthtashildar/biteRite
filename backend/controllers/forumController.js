const Post = require("../models/Post");

exports.createPost = async (req, res) => {

  try {

    const post = await Post.create({
      author: req.user.id,
      content: req.body.content
    });

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getPosts = async (req, res) => {

  try {

    const posts = await Post.find()
      .populate("author", "name");

    res.json(posts);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.comment = async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    post.comments.push({
      author: req.user.id,
      content: req.body.content
    });

    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};