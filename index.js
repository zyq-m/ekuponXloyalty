const express = require("express");
const student = require("./src/routes/studentRoute");

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/student", student);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
