const express = require("express");
const path = require("path");
// const adminRouter = require("./routes/adminRoutes");
// const employeeRouter = require("./routes/employeeRoutes");
// const freelancerRouter = require("./routes/freelanceRoutes");
const homeRouter = require("./routes/homeRoutes");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "Public")));
// app.use("/adminD", adminRouter);
// app.use("/employeeD", employeeRouter);
// app.use("/freelancerD", freelancerRouter);
app.use("/", homeRouter);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "Team", "Aman", "home.html"));
// });

// app.get("/chat", (req, res) => {
//   res.sendFile(path.join(__dirname, "Team", "Aman", "chat.html"));
// });

app.get("/job-listings", (req, res) => {
  res.sendFile(path.join(__dirname, "Team", "Deepak", "Job_listing.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
