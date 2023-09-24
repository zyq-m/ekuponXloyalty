require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");
// Require routes
const student = require("./src/routes/studentRoute");
const cafe = require("./src/routes/cafeRoute");
const admin = require("./src/routes/adminRoute");
const feedback = require("./src/routes/feedbackRoute");
const auth = require("./src/routes/authRoute");
// Require middleware
const { authenticateToken } = require("./src/middlewares/authenticateToken");
// Service
const studentEvent = require("./src/services/socket.io/studentEvent");
const cafeEvent = require("./src/services/socket.io/cafeEvent");
const adminEvent = require("./src/services/socket.io/adminEvent");

const app = express();
const apiServer = http.createServer(app);
const port = 3000;
const io = new Server(apiServer, {
  cors: {
    origin: "*", // ! CHANGE THIS BEFORE PROD
  },
});

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

apiServer.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// Socket io
const onConnection = socket => {
  console.log("ada org connect");
  socket.on("test", msg => {
    io.emit("test-res", msg);
  });

  // STUDENT EVENTS
  studentEvent(io, socket);

  // CAFE EVENTS
  cafeEvent(io, socket);

  // ADMIN EVENTS
  adminEvent(io, socket);
};

io.on("connection", onConnection);
