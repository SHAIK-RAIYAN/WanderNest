const passport = require("passport");
const LocalStrategy = require("passport-local"); //for local login
const GoogleStrategy = require("passport-google-oauth20").Strategy; //google login
const GitHubStrategy = require("passport-github").Strategy; //github login

const User = require("../models/user");

function configurePassport() {
  // Local Strategy
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              username: profile.displayName,
              googleId: profile.id,
              email: profile.emails?.[0]?.value,
              profileImage: profile.photos?.[0]?.value,
              isAdmin: profile.emails?.[0]?.value === process.env.ADMIN_EMAIL, //check admin
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // GitHub Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });
          if (!user) {
            user = await User.create({
              username: profile.username,
              githubId: profile.id,
              email: profile.emails?.[0]?.value,
              profileImage: profile.photos?.[0]?.value,
              isAdmin: profile.emails?.[0]?.value === process.env.ADMIN_EMAIL, //check admin
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

configurePassport();

module.exports = configurePassport;
