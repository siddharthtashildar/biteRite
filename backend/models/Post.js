const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    // Optional reference to a registered user (not required)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    // Display name for unauthenticated/guest posts
    authorName: {
      type: String,
      default: "Anonymous"
    },

    content: {
      type: String,
      required: true
    },

    // Simple like counter (no per-user tracking)
    likesCount: {
      type: Number,
      default: 0
    },

    comments: [
      {
        authorName: {
          type: String,
          default: "User"
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);