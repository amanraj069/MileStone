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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
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

app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/adminD", restrictToRole(["Admin"]), adminRouter);
app.use("/employerD", restrictToRole(["Employer"]), employerRouter);
app.use("/freelancerD", restrictToRole(["Freelancer"]), freelancerRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
