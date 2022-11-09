const express = require("express");
const {
  createStudent,
  studentDetail,
  getStudent,
  editStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { userRegister, loginUser } = require("../controllers/userController");
const router = express.Router();

//user APIs
router.post("/register", userRegister);
router.post("/login", loginUser);

//Student APIs
router.post("/student/create", createStudent);
router.get("/student/:studentId", studentDetail);
router.get("/student", getStudent);
router.put("/student/:studentId", editStudent);
router.delete("/student/:studentId", deleteStudent);

module.exports = router;
