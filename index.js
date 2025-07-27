const express = require("express");
const path = require("path");
const session = require("express-session");

const adminRouter = require("./routes/adminRoutes");
const employerRouter = require("./routes/employerRoutes");
const freelancerRouter = require("./routes/freelancerRoutes");
const homeRouter = require("./routes/homeRoutes");
const authRouter = require("./routes/authRoutes");
const authController = require("./controllers/authController");

const app = express();
const PORT = process.env.PORT || 3000;

// Set up static folder for CSS, JS, images
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(
  session({
    secret: "g3b476r2t9846nt3w96rt465r7bt3u28657brt87n2",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false,
      httpOnly: true,
    },
  })
);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const restrictToRole = (roles) => (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  if (!roles.includes(req.session.user.role)) {
    return res
      .status(403)
      .send(
        "Access denied: You do not have the correct role to access this page."
      );
  }
  next();
};

const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.user) {
    console.log(
      `Redirecting logged-in user from ${req.path} to / - Session: ${req.sessionID}`
    );
    return res.redirect("/");
  }
  next();
};

// Logging middleware
app.use((req, res, next) => {
  console.log(
    `[${req.method}] ${req.path} - Session ID: ${req.sessionID}, User:`,
    req.session.user
  );
  next();
});

// Routes
app.get("/", authController.getHome);

app.get("/login", redirectIfLoggedIn, (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.render("Aman/login"); // views/Aman/login.ejs
});

app.get("/signup", redirectIfLoggedIn, (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.render("Aman/signup"); // views/Aman/signup.ejs
});

// Route modules
app.use("/", authRouter);
app.use("/", homeRouter);
app.use("/adminD", restrictToRole(["Admin"]), adminRouter);
app.use("/employerD", restrictToRole(["Employer"]), employerRouter);
app.use("/freelancerD", restrictToRole(["Freelancer"]), freelancerRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
