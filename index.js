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
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "g3b476r2t9846nt3w96rt465r7bt3u28657brt87n2",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
  })
);

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

// using app
app.use((req, res, next) => {
  console.log(
    `[${req.method}] ${req.path} - Session ID: ${req.sessionID}, User:`,
    req.session.user
  );
  next();
});

app.get("/", authController.getHome);
app.get("/login", redirectIfLoggedIn, (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.sendFile(path.join(__dirname, "views", "Aman", "login.html"));
});

app.get("/signup", redirectIfLoggedIn, (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.sendFile(path.join(__dirname, "views", "Aman", "signup.html"));
});

app.use("/", authRouter);
app.use("/", homeRouter);
app.use("/adminD", restrictToRole(["Admin"]), adminRouter);
app.use("/employerD", restrictToRole(["Employer"]), employerRouter);
app.use("/freelancerD", restrictToRole(["Freelancer"]), freelancerRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
