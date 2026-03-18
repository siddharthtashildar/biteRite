const express = require("express");
const router = express.Router();

const {
  saveUserData,
  checkUser   // ✅ MAKE SURE THIS IS IMPORTED
} = require("../controllers/userController");
console.log("checkUser:", checkUser);
router.post("/onboarding", saveUserData);
router.get("/check/:clerkId", checkUser); // ✅ now valid

module.exports = router;