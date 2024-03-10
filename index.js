require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
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
const point = require("./src/routes/pointRoute");
const limitSpend = require("./src/routes/limitSpendRoute");
// Require middleware
const { authenticateToken } = require("./src/middlewares/authenticateToken");
const { defineRole } = require("./src/middlewares/role");
// Service
const studentEvent = require("./src/services/socket.io/studentEvent");
const cafeEvent = require("./src/services/socket.io/cafeEvent");
const adminEvent = require("./src/services/socket.io/adminEvent");
const connectionEvent = require("./src/services/socket.io/connectionEvent");
const notificationEvent = require("./src/services/socket.io/notificationEvent");
const socketAuth = require("./src/services/socket.io/middlewares/socketAuth");

const app = express();
const apiServer = http.createServer(app);
const port = 3000;
const isProduction = process.env.NODE_ENV === "production";
const originConfig = {
  origin: isProduction ? process.env.PROD_ORIGIN.split(" ") : "*",
};

const io = new Server(apiServer, { cors: originConfig });

app.use(cors(originConfig));
app.use(helmet());
app.use(hpp());
app.use(xssClean());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

// Restrict all routes to only 100 requests per IP address every 1o minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per IP
});
app.use(limiter);

app.get("/", (req, res) => {
  res.send({ message: "Hello Ekupon" });
});

app.use("/auth", auth);
app.use(authenticateToken); // Every incomming request it will validate token
app.use("/student", student);
app.use("/cafe", defineRole(["CAFE"]), cafe);
app.use("/admin", admin);
app.use("/feedback", feedback);
app.use("/point", point);
app.use("/limit", defineRole(["ADMIN"]), limitSpend);

// Socket io
const onConnection = (socket) => {
  connectionEvent(io, socket);
  notificationEvent(io, socket);
  // STUDENT EVENTS
  studentEvent(io, socket);
  // CAFE EVENTS
  cafeEvent(io, socket);
  // ADMIN EVENTS
  adminEvent(io, socket);
};

// Socket.io middleware
// io.use(socketAuth);
io.on("connection", onConnection);

apiServer.listen(port, () => {
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
