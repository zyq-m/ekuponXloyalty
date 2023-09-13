require("dotenv").config();
const express = require("express");
// Require routes
const student = require("./src/routes/studentRoute");
const cafe = require("./src/routes/cafeRoute");
const admin = require("./src/routes/adminRoute");
const feedback = require("./src/routes/feedbackRoute");
const auth = require("./src/routes/authRoute");
// Require middleware
const { authenticateToken } = require("./src/middlewares/authenticateToken");

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/auth", auth);
app.use(authenticateToken); // Every incomming request it will validate token
app.use("/api/student", student);
app.use("/api/cafe", cafe);
app.use("/api/admin", admin);
app.use("/api/feedback", feedback);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
