const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    authorName: { type: String, default: "Anonymous" },
    content: { type: String, required: true },
    imageUrl: { type: String }, // To store the recipe/post image
    isRecipe: { type: Boolean, default: false }, // Distinguish posts from recipes
    
    // Upvotes/Approvals for Recipes
    upvotes: [{ type: String }], // Array of Clerk User IDs
    
    // Likes for Reactions (1 per person)
    likes: [{ type: String }], // Array of Clerk User IDs

    comments: [
      {
        authorName: { type: String, default: "User" },
        content: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);