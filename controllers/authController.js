// controllers/authController.js
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("../database.js");

exports.getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "Aman", "login.html"));
};

exports.getSignup = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "Aman", "signup.html"));
};

exports.postSignup = async (req, res) => {
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
};

exports.postLogin = (req, res) => {
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
          res.redirect("/employerD");
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
};

exports.getLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};