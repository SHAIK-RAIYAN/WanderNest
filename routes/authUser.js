const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const middleware = require("../middleware/middleware");
const userController = require("../controllers/authUser");

//signup
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

//login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    middleware.storeReturnTo,
    passport.authenticate("local", {
      //for login the local user
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.localLoginSuccess
  );

// Logout
router.get("/logout", userController.logout);

// Google OAuth login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }) //for login the google user
);

// Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.googleLoginSuccess
);

// GitHub OAuth login
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }) //for login the github user
);

// GitHub OAuth callback
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.githubLoginSuccess
);

module.exports = router;
