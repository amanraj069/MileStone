const path = require("path");
const bcrypt = require("bcrypt");
const db = require("../database.js");

// Note: getLogin and getSignup methods are no longer needed as they're handled directly in app.js

exports.postSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, role, name],
      (err) => {
        if (err) {
          console.log("Signup error:", err);
          return res.send(
            '<script>alert("Email already exists"); window.location="/signup";</script>'
          );
        }
        res.redirect("/login");
      }
    );
  } catch (error) {
    console.log("Signup catch error:", error);
    res.send(
      '<script>alert("Error creating account"); window.location="/signup";</script>'
    );
  }
};

exports.postLogin = (req, res) => {
  const { email, password, role } = req.body;
  db.get(
    "SELECT * FROM users WHERE email = ? AND role = ?",
    [email, role],
    async (err, user) => {
      if (err || !user) {
        console.log("Login error or no user:", err);
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
          authenticated: true,
        };
        console.log(
          "User logged in, session set:",
          req.session.user,
          "Session ID:",
          req.sessionID
        );
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).send("Server error during login");
          }
          console.log(`Redirecting ${role} to dashboard`);
          if (role === "Admin") {
            res.redirect("/adminD/profile");
          } else if (role === "Employer") {
            res.redirect("/employerD/profile");
          } else if (role === "Freelancer") {
            res.redirect("/freelancerD/profile");
          }
        });
      } else {
        res.send(
          '<script>alert("Invalid credentials"); window.location="/login";</script>'
        );
      }
    }
  );
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
};

exports.getHome = (req, res) => {
  let dashboardRoute = "";
  if (req.session.user) {
    switch (req.session.user.role) {
      case "Admin":
        dashboardRoute = "/adminD/profile";
        break;
      case "Employer":
        dashboardRoute = "/employerD/profile";
        break;
      case "Freelancer":
        dashboardRoute = "/freelancerD/profile";
        break;
    }
  }
  res.render("Aman/home", {
    user: req.session.user || null,
    dashboardRoute: dashboardRoute,
  });
};
