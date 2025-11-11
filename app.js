// app.js
require("dotenv").config();
require("./config/passport");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const listingsRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const authUserRoutes = require("./routes/authUser");

const app = express();

// --- App & View Engine Setup ----------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// --- Database Connection --------------------
const DATABASE_URL = process.env.ATLAS_DB_URL;
async function connectDB() {
	try {
		await mongoose.connect(DATABASE_URL);
		console.log("✅ MongoDB connected");
	} catch (err) {
		console.error("❌ MongoDB connection error:", err);
		process.exit(1);
	}
}
connectDB();

// --- Session & Flash ------------------------
const store = MongoStore.create({
	mongoUrl: DATABASE_URL,
	crypto: { secret: process.env.SESSION_SECRET },
	touchAfter: 24 * 3600,
});
store.on("error", (err) => console.error("Session store error:", err));

app.use(
	session({
		store,
		name: "WanderNest_session",
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		},
	})
);

app.use(flash());

// --- Passport Initialization -----------------
app.use(passport.initialize());
app.use(passport.session());

// --- Locals Middleware ----------------------
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

// --- Routes ----------------------------------
app.get("/", (req, res) => res.redirect("/listings"));
app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", authUserRoutes);

// --- 404 & Error Handler --------------------
app.all("/*splat", (req, res, next) => {
	next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Something went wrong" } = err;
	res.status(status).render("listings/error", { status, message });
});

module.exports = app;


