// Loading env variables
require("dotenv").config();
require("./config/passport.js"); // register all passport strategies

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override"); //for patch and delete req
const ejsMate = require("ejs-mate"); //to include other ejs files in a ejs file
const ExpressError = require("./utils/ExpressError"); // error handling
const session = require("express-session"); //for establishing a session
const MongoStore = require("connect-mongo"); // for production //MongoDB session store for Connect and Express
const flash = require("connect-flash"); //to show a flash msg when work (like post) is done
const passport = require("passport"); // passport for user login
const listingsRoutes = require("./routes/listing.js"); //listing route
const reviewRoutes = require("./routes/review.js"); //review route
const authUserRoutes = require("./routes/authUser.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/WanderNest";
const DATABASE_URL = process.env.ATLAS_DB_URL; //mongo atlas DB url

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

//connect-mongo session
//therefore the session related info is also stored in Mongo atlas instead of local sys
const store = MongoStore.create({
  mongoUrl: DATABASE_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // Interval(seconds) between session updates.
});

store.on("error", (err) => {
  console.log("Error in MONGO SESSION store", err);
});

//express session
const sessionOptions = {
  store, //passing connect-mongo session
  name: "WanderNest_session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Helps prevent cross-site scripting (XSS) attacks
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //A middleware that initializes passport
app.use(passport.session()); //the ability to identify its the same user as they browse from page to page in a single session.

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});
//adding user details to locals so that it can be accessed anywhere in files

// mongoose connection
async function main() {
  await mongoose.connect(DATABASE_URL);
}
const port = process.env.PORT || 3000;
main()
  .then(() => {
    console.log("Connection succcessful");
    app.listen(port, () => {
      console.log(`WanderNest server running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

// root page
app.get("/", (req, res) => {
  res.redirect("/listings");
});
// listings route
app.use("/listings", listingsRoutes);
//reviews route
app.use("/listings/:id/reviews", reviewRoutes);
// authUser routes
app.use("/", authUserRoutes);

//errors Handling (at end)
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { status,message });
});
