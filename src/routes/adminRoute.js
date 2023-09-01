const express = require("express");

// Require models
const {
  createStudent,
  getStudent,
} = require("../controllers/studentController");

const router = express.Router();

// Get list of students
router.get("/", async (req, res) => {
  const students = await getStudent();

  return res.send({ data: students }).status(200);
});

// Create a new student
router.post("/create/student", async (req, res) => {
  const { matricNo, icNo, b40, name, phoneNo, address } = req.body;
  try {
    const student = await createStudent(
      matricNo,
      icNo,
      b40,
      name,
      phoneNo,
      address
    );

    return res.send({ data: student }).status(200);
  } catch (error) {
    return res.send({ error }).status(500);
  }
});
