const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const middleware = require("../middleware/middleware");

//signup
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new User({ email, username });
      const registeredUser = await User.register(newuser, password);
      //checking Admin
      if (registeredUser.email === "shaikraiyan2005@gmail.com") {
        registeredUser.isAdmin = true;
        await registeredUser.save();
      }
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to WanderNest!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

//login
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  middleware.storeReturnTo,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    const redirectUrl = res.locals.returnTo || "/listings";
    delete req.session.returnTo; // if user log out and log in again then old returnto is used, so delete it
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully.");
    res.redirect("/listings");
  });
});

// Google OAuth login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect("/listings");
  }
);

// GitHub OAuth login
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub OAuth callback
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect("/listings");
  }
);

module.exports = router;
