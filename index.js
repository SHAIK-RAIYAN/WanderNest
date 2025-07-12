//After Restructuring the project (express router)
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override"); //for patch and delete req
const ejsMate = require("ejs-mate"); //to include other ejs files in a ejs file
const ExpressError = require("./utils/ExpressError"); // error handling
const listingsRoutes = require("./routes/listing.js"); //listing route
const reviewRoutes = require("./routes/review.js"); //review route
const session = require("express-session"); //for establishing a session
const flash = require("connect-flash"); //to show a flash msg when work (like post) is done
const passport = require("passport"); // passport for user login
const LocalStrategy = require("passport-local"); //local login
const User = require("./models/user"); //user model
const authUserRoutes = require("./routes/authUser.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

//express session
const sessionOptions = {
  secret: "wanderNestSecretCode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //from current time to 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //to avoid cross-scripting attacks
  },
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(passport.initialize()); //A middleware that initializes passport
app.use(passport.session()); //the ability to identify its the same user as they browse from page to page in a single session.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //serializing or storing user info in the session
passport.deserializeUser(User.deserializeUser());

// mongoose connectioon
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/WanderNest";
main()
  .then((res) => {
    console.log("Connection succcessful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(3000, () => {
  console.log(`WanderNest server running on http://localhost:${3000}`);
});
// root page
app.get("/", (req, res) => {
  res.send("root page")
  // res.redirect("/listings");
  //   res.render("home");
});
// listings route
app.use("/listings", listingsRoutes);
//reviews route
app.use("/listings/:id/reviews", reviewRoutes);
// authUser routes
app.use("/", authUserRoutes);

//errors Handling (at end)
app.all("{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { status, message });
});
