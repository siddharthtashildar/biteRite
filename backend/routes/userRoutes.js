const express = require("express");
const router = express.Router();

const {
  saveUserData,
  checkUser,   // ✅ MAKE SURE THIS IS IMPORTED
  syncUser,
  getUserByClerkId,
  updateUser
} = require("../controllers/userController");
console.log("checkUser:", checkUser);
router.post("/onboarding", saveUserData);
router.post("/save", syncUser);
router.get("/check/:clerkId", checkUser); // ✅ now valid
router.get("/:clerkId", getUserByClerkId);
router.put("/:clerkId", updateUser); // ✅ ADD THIS

module.exports = router;