const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "Public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Team", "Aman", "home.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "Team", "Aman", "chat.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
