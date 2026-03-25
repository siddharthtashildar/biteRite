const User = require("../models/User");

async function saveUserData(req, res) {
  try {

    const {
      clerkId,
      name,
      email,
      role,
      dietType,
      healthConditions,
      allergies,
      age,
      weight,
      goal
    } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        name,
        email,
        role: role || "user",
        dietType,
        healthConditions,
        allergies,
        age,
        weight,
        goal,
        onboardingCompleted: true
      },
      {
        returnDocument: "after", // ✅ replaces new: true
        upsert: true
      }
    );

    res.json({ success: true });

  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save user"
    });
  }
}

async function getUserByClerkId(req, res) {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function checkUser(req, res) {
  try {

    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    res.json({
      exists: !!user,
      onboardingCompleted: user?.onboardingCompleted || false
    });

  } catch (error) {
    console.error("Check user error:", error);
    res.status(500).json({ success: false });
  }
}
async function updateUser(req, res) {
  try {
    const { clerkId } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      req.body,
      { new: true }
    );

    res.json(updatedUser);

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
}
async function syncUser(req, res) {
  try {
    const { clerkId, email, name } = req.body;

    let existingUser = await User.findOne({ clerkId });

    if (!existingUser) {
      const newUser = new User({
        clerkId,
        email,
        name,
        onboardingCompleted: false,
      });

      await newUser.save();
      console.log("✅ New user created");
      return res.json(newUser);
    }

    console.log("👀 User already exists");
    return res.json(existingUser);

  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { saveUserData, checkUser, syncUser, getUserByClerkId, updateUser};