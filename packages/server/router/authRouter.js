const express = require("express");
const { validateForm } = require("../middlewares/validateFormMiddleware");
const {
  handleLogin,
  checkLogin,
  handleSignup,
} = require("../controllers/authController");
const { rateLimiter } = require("../middlewares/rateLimiterMiddleware");

const router = express.Router();

router
  .route("/login")
  .get(checkLogin)
  .post(validateForm, rateLimiter(60, 10), handleLogin);
router.post("/signup", validateForm, rateLimiter(30, 4), handleSignup);

module.exports = router;
