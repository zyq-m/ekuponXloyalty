require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
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

app.use(helmet());
app.use(hpp());
app.use(xssClean());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Restrict all routes to only 100 requests per IP address every 1o minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per IP
});
app.use(limiter);

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

// TEST PDF
const { generatePDF } = require("./src/utils/pdf/pdf");
app.get("/pdf", async (req, res) => {
  try {
    const pdf = await generatePDF(req);

    res.status(200).sendFile(pdf?.filename, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=example.pdf", // use inline to view file, use attachment to download
      },
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
