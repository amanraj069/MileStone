// index.js
const express = require("express");
const path = require("path");
const session = require("express-session");
const adminRouter = require("./routes/adminRoutes");
const employerRouter = require("./routes/employerRoutes");
const freelancerRouter = require("./routes/freelancerRoutes");
const homeRouter = require("./routes/homeRoutes");

const app = express();
const PORT = 3000;

// Middleware
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

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Middleware to restrict access based on role
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

// Routes
app.use("/", homeRouter);
app.use("/adminD", restrictToRole(["Admin"]), adminRouter);
app.use("/employerD", restrictToRole(["Employer"]), employerRouter);
app.use("/freelancerD", restrictToRole(["Freelancer"]), freelancerRouter);

// Login and Signup Routes
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "Aman", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "Aman", "signup.html"));
});

const db = require("./database.js");
const bcrypt = require("bcrypt");

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, role, name],
      (err) => {
        if (err) {
          return res.send(
            '<script>alert("Email already exists"); window.location="/signup";</script>'
          );
        }
        res.redirect("/login");
      }
    );
  } catch (error) {
    res.send(
      '<script>alert("Error creating account"); window.location="/signup";</script>'
    );
  }
});

app.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  db.get(
    "SELECT * FROM users WHERE email = ? AND role = ?",
    [email, role],
    async (err, user) => {
      if (err || !user) {
        return res.send(
          '<script>alert("Invalid credentials"); window.location="/login";</script>'
        );
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
        if (role === "Admin") {
          res.redirect("/adminD");
        } else if (role === "Employer") {
          res.redirect("/employeeD");
        } else if (role === "Freelancer") {
          res.redirect("/freelancerD/profile");
        }
      } else {
        res.send(
          '<script>alert("Invalid credentials"); window.location="/login";</script>'
        );
      }
    }
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
