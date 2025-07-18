const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ email, username });
    const registeredUser = await User.register(newuser, password);
    //checking Admin
    if (registeredUser.email === process.env.ADMIN_EMAIL) {
      registeredUser.isAdmin = true;
      await registeredUser.save();
    }
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash(
        "success",
        `Welcome to WanderNest, " ${registeredUser.username} "!`
      );
      res.redirect("/listings");
    });
  } catch (e) {
    if (e.message.includes("duplicate key") || e.message.includes("exists")) {
      req.flash("error", "Username or email already in use.");
    } else {
      req.flash("error", e.message);
    }
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.localLoginSuccess = (req, res) => {
  const redirectUrl = res.locals.returnTo || "/listings";
  delete req.session.returnTo; // if user log out and log in again then old returnto is used, so delete it
  req.flash("success", `Welcome back, "${req.user.username}"!`);
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You’ve been logged out.");
    res.redirect("/listings");
  });
};

module.exports.googleLoginSuccess = (req, res) => {
  req.flash("success", `Welcome back, "${req.user.username}"!`);
  res.redirect("/listings");
};

module.exports.githubLoginSuccess = (req, res) => {
  req.flash("success", `Welcome back, "${req.user.username}"!`);
  res.redirect("/listings");
};

// Render profile page
module.exports.renderProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("users/profile", { user });
};

// Handle profile update
module.exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.username) {
      user.username = req.body.username;
    }

    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    // Re-login the user to update session
    req.login(user, function (err) {
      //Passport’s way of re-establishing a valid session after user data changes
      if (err) return next(err);
      req.flash("success", "Your profile has been updated.");
      return res.redirect("/profile");
    });
  } catch (err) {
    req.flash("error", "Failed to update profile. Please try again.");
    return res.redirect("/profile");
  }
};
