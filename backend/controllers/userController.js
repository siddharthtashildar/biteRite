const User = require("../models/User");

async function saveUserData(req, res) {
  try {

    const {
      clerkId,
      name,
      email,
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

module.exports = { saveUserData, checkUser };