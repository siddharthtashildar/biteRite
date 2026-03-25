require("dotenv").config();
console.log("DB String Check:", process.env.MONGODB_URI ? "Found it!" : "Still missing from process.env");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");
const forumRoutes = require("./routes/forumRoutes");

const mongoose = require("mongoose");
const Recipe = require("./models/Recipe");

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Ensure uploads folder exists for storing images
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded images statically
app.use("/uploads", express.static(uploadsDir));

// 🔥 MIGRATION: Fix recipes with missing verification fields
const fixRecipeFields = async () => {
  try {
    console.log("🔄 Running recipe field migration...");

    // Update all recipes with pendingVerification: true to ensure they have verifiedByDietician: false
    const result = await Recipe.updateMany(
      { pendingVerification: true },
      {
        $set: {
          verifiedByDietician: false
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} recipes with pending verification`);

    // Check if any recipes are missing the new fields and set defaults
    const allRecipes = await Recipe.find({});
    let needsUpdate = 0;

    for (let recipe of allRecipes) {
      if (recipe.verifiedByDietician === undefined || recipe.verifiedByDietician === null) {
        needsUpdate++;
      }
    }

    if (needsUpdate > 0) {
      await Recipe.updateMany(
        { verifiedByDietician: { $exists: false } },
        { $set: { verifiedByDietician: false } }
      );
      console.log(`✅ Fixed ${needsUpdate} recipes with missing verifiedByDietician field`);
    }

  } catch (error) {
    console.error("❌ Migration error:", error);
  }
};

// Run migration after DB connection
setTimeout(fixRecipeFields, 1000);

app.get("/", (req, res) => {
  res.send("BiteRite backend running");
});
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/forum", forumRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});