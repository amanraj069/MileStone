const express = require("express");
const path = require("path");
const session = require("express-session");
const adminRouter = require("./routes/adminRoutes");
const employerRouter = require("./routes/employerRoutes");
const freelancerRouter = require("./routes/freelancerRoutes");
const homeRouter = require("./routes/homeRoutes");
const authRouter = require("./routes/authRoutes");
const app = express();
const PORT = 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Static files

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Prevent client-side access to session cookie
    },
  })
);

// Debugging middleware
app.use((req, res, next) => {
  console.log(
    `[${req.method}] ${req.path} - Session ID: ${req.sessionID}, User:`,
    req.session.user
  );
  next();
});

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

// Redirect middleware for logged-in users trying to access login/signup
const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.user) {
    console.log(
      `Redirecting logged-in user from ${req.path} to / - Session: ${req.sessionID}`
    );
    return res.redirect("/");
  }
  next();
};

// Routes
// Apply redirectIfLoggedIn middleware to login and signup routes
app.get("/login", redirectIfLoggedIn, (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.sendFile(path.join(__dirname, "views", "Aman", "login.html"));
});

app.get("/signup", redirectIfLoggedIn, (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.sendFile(path.join(__dirname, "views", "Aman", "signup.html"));
});

// Other auth routes
app.use("/", authRouter);
app.use("/", homeRouter);
app.use("/adminD", restrictToRole(["Admin"]), adminRouter);
app.use("/employerD", restrictToRole(["Employer"]), employerRouter);
app.use("/freelancerD", restrictToRole(["Freelancer"]), freelancerRouter);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
