const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refresh,
  logout,
  me
} = require("../controllers/authController");

const authenticate = require("../middleware/authenticate");

// ✅ Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// ✅ Protected routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

module.exports = router;